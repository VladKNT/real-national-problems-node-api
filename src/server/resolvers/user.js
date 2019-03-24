import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import _ from 'lodash';
import { TokenService } from '../services/auth';
import { JwtService } from "../services/auth";
import { isAuthenticated, isAdmin, isOwner } from '../helpers/authorization';
import { uploadImage } from '../helpers/imageUploader';
import tokenConf from '../config/token';

export default {
  Query: {
    getUser: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
        try {
          return await models.User.findById(currentUser.sub);
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    getUserById: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        try {
          return await models.User.findById(id);
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    users: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => {
        try {
          return await models.User.findAll();
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  Mutation: {
    signUp: async (parent, { email, username, password, firstName, lastName }, { models }) => {
      try {
        const user = await models.User.create({ email, username, password });
        await models.UserProfile.create({ userId: user.id, firstName, lastName });

        const tokenPair = await TokenService.generateTokenPair(user);
        await models.RefreshToken.create({ userId: user.id, token: tokenPair.refreshToken });

        return tokenPair;
      } catch (error) {
        throw new Error(error);
      }
    },

    signIn: async (parent, { login, password }, { models }) => {
      try {
        const user = await models.User.findByLogin(login, models);

        if (!user) {
          throw new UserInputError('No user found with this login credentials.');
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
          throw new AuthenticationError('Invalid password.');
        }

        const tokenPair = await TokenService.generateTokenPair(user);
        await models.RefreshToken.create({ userId: user.id, token: tokenPair.refreshToken });

        return tokenPair;
      } catch (error) {
        throw new Error(error);
      }
    },

    refreshToken: async (parent, { token }, { models }) => {
      try {
        const { secret, type } = tokenConf.refresh;
        const decodedToken = await await JwtService.decode(token);
        const currentData = new Date();

        const { email, username, role, tokenType, sub: userId, exp } = decodedToken;
        const user = {
          id: userId,
          email,
          username,
          role
        };

        const removeRefreshToken = async () => {
          await models.RefreshToken.destroy({ where: { userId} });
        };

        if (exp < currentData.getTime() / 1000) {
          await removeRefreshToken();
          throw new Error('Token is expired.');
        }

        if (type !== tokenType) {
          await removeRefreshToken();
          throw new Error('Invalid token type.');
        }

        await JwtService.verify(token, secret);
        const oldToken = await models.RefreshToken.findOne({ where: { userId, token} });

        if (_.isNull(oldToken)) {
          models.RefreshToken.destroy({ where: { userId } });
          throw new Error('Provided refresh token doesn\'t exist.');
        }

        const tokenPair = await TokenService.generateTokenPair(user);
        await models.RefreshToken.update({ token: tokenPair.refreshToken }, { where: { userId, token } });

        return tokenPair;
      } catch (error) {
        throw new Error(error);
      }
    },


    updateUser: combineResolvers(
      isOwner,
      async (parent, args, { models }) => {
        try {
          if (args.imageFile) {
            const photo = args.photo = await uploadImage(await args.imageFile, 'avatars');
            args.profilePhoto = photo.path;
          }

          const user = await models.User.update(args, {
            fields: Object.keys(args),
            returning: true,
            plain: true,
            where: { id: args.id }
          });

          await models.UserProfile.update(args, {
            fields: Object.keys(args),
            returning: true,
            plain: true,
            where: { userId: args.id }
          });

          return user[1];
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        try {
          await models.User.destroy({ where: { id } })
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  User: {
    userProfile: async ({ id }, args, { loaders }) => {
      try {
        return await loaders.userProfile.load(id);
      } catch (error) {
        throw new Error(error);
      }
    },

    chats: async ({ id }, args, { models }) => {
      try {
        return await models.Chat.findAll({
          include: [{
            model: models.UserChat,
            as: 'userChatIds',
            where: { userId: id }
          }]
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}
