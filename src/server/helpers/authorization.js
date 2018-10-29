import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
import _ from 'lodash';

export const isAuthenticated = (parent, args, { currentUser }) => (
  currentUser ? skip : new ForbiddenError('Not authenticated as user.')
);

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { currentUser: { role } }) => (
    role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
  )
);

export const isOwner = combineResolvers(
  isAuthenticated,
  (parent, { id }, { currentUser }) => (
    id == currentUser.sub ? skip : new ForbiddenError('Not authorized as owner.')
  )
);

export const isChatCreator = combineResolvers(
  isAuthenticated,
  async (parent, { id }, { models, currentUser }) => {
    try {
      const { sub: creatorId } = currentUser;
      const chat = await models.Chat.findOne({ where: { id, creatorId } });

      if (_.isNull(chat)) {
        return new ForbiddenError('Not authorized as chat creator.');
      }

      return skip;
    } catch (error) {
      throw new Error(error);
    }

  }
);

export const isMessageCreator = combineResolvers(
  isAuthenticated,
  async (parent, { id }, { models, currentUser }) => {
    try {
      const { sub: creatorId } = currentUser;
      const message = await models.Message.findOne({ where: { id, creatorId } });

      if (_.isNull(message)) {
        return new ForbiddenError('Not authorized as message creator.');
      }

      return skip;
    } catch (error) {
      throw new Error(error);
    }
  }
);