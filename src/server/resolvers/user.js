import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import _ from 'lodash';
import { TokenService } from '../services/auth';
import { JwtService } from "../services/auth";
import { isAuthenticated, isAdmin, isOwner } from '../helpers/authorization';
import tokenConf from '../config/token';

export default {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => {
        try {
          return models.User.findAll();
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  Mutation: {
    signUp: async (parent, { email, username, password, first_name, last_name }, { models }) => {
      try {
        const user = await models.User.create({ email, username, password });
        await models.UserProfile.create({ userId: user.id, first_name, last_name });

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

    // Todo: delete token if it expired
    refreshToken: async (parent, { token }, { models }) => {
      try {
        const { secret, type } = tokenConf.refresh;
        const decodedToken = await JwtService.verify(token, secret);
        const { email, username, role, tokenType, sub: userId } = decodedToken;
        const user = {
          id: userId,
          email,
          username,
          role
        };

        if (type !== tokenType) {
          throw new Error('Invalid token type.');
        }

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
          const user = await models.User.update(args, {
            fields: Object.keys(args),
            returning: true,
            plain: true,
            where: { id: args.id }
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
    }
  }
}
