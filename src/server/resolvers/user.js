import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import {isAuthenticated, isAdmin, isOwner} from '../helpers/authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
};

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
    signUp: async (parent, { email, username, password, first_name, last_name }, { models, secret }) => {
      try {
        const user = await models.User.create({ email, username, password });
        await models.UserProfile.create({ userId: user.id, first_name, last_name });
        return { token: createToken(user, secret, '14d') };
      } catch (error) {
        throw new Error(error);
      }
    },

    signIn: async (parent, { login, password }, { models, secret }) => {
      try {
        const user = await models.User.findByLogin(login);
        console.info(user);

        if (!user) {
          throw new UserInputError('No user found with this login credentials.');
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
          throw new AuthenticationError('Invalid password.');
        }

        return { token: createToken(user, secret, '30d') };
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
