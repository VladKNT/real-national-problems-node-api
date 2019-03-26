import { combineResolvers } from 'graphql-resolvers';
import { withFilter } from 'apollo-server';
import pubsub, { EVENTS } from "../subscriptions";
import { isAuthenticated, isMessageCreator } from '../helpers/authorization';
import _ from 'lodash';

export default {
  Query: {
    messages: combineResolvers(
      isAuthenticated,
      async (parent, { chatId, offset = 0, limit = 20 }, { models, currentUser }) => {
      try {
        const { sub: userId } = currentUser;

        const chat = await models.UserChat.findOne({ where: { userId, chatId }});

        if (_.isNull(chat)) {
          throw new Error('You don\'t have permission or chat doesn\'t exist');
        }

        return await models.Message.findAll({ chatId, offset, limit, order: [[ "createdAt", "DESC" ]] }) ;
      } catch (error) {
        throw new Error(error);
      }
    })
  },

  Mutation: {
    sendMessage: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
        try {
          const { sub: creatorId } = currentUser;
          args.creatorId = creatorId;

          const message = await models.Message.create(args);

          pubsub.publish(EVENTS.MESSAGE.MESSAGE_SENT, {
            messageSent: message
          });

          return message;
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    updateMessage: combineResolvers(
      isMessageCreator,
      async (parent, args, { models }) => {
        try {
          args.edited = true;
          const message = await models.Message.update(args, {
            fields: Object.keys(args),
            returning: true,
            plain: true,
            where: { id: args.id }
          });

          return message[1];
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    deleteMessage: combineResolvers(
      isMessageCreator,
      async (parent, args, { models }) => {
        args.deleted = true;
        await models.Message.update(args, {
          fields: Object.keys(args),
          where: { id: args.id }
        });

        return true;
      }
    )
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MESSAGE.MESSAGE_SENT), (payload, variables) => {
        return variables.chatId == payload.messageSent.chatId;
      }),
    }
  },

  Message: {
    owner: async ({ creatorId }, args, { models, loaders }) => {
      try {
        return loaders.creators.load(creatorId);
      } catch (error) {
        throw new Error(error);
      }
    },
  }
}
