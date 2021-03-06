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

        return await models.Message.findAll({ where: { chatId }, offset, limit, order: [[ "createdAt", "DESC" ]] }) ;
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
          const { chatId } = args;
          args.creatorId = creatorId;

          const message = await models.Message.create(args);
          await message.setReaders([creatorId]);

          const chat = await models.Chat.findById(chatId);

          pubsub.publish(EVENTS.MESSAGE.MESSAGE_SENT, {
            messageSent: message
          });

          pubsub.publish(EVENTS.MESSAGE.UDATE_CHAT, {
            updateChat: chat
          });

          return message;
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    readMessages: combineResolvers(
      isAuthenticated,
      async (parent, { messagesId }, { models, currentUser }) => {
        try {
          const { sub: creatorId } = currentUser;

          const messages = await models.Message.findAll({
            where: { id: messagesId },
            include: {
              model: models.User,
              as: 'readers',
            }});

          _.forEach(messages, async (message) => {
            await message.setReaders([...message.readers, creatorId]);
          });

          return messages;
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
    },

    updateChat: {
      subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MESSAGE.UDATE_CHAT), (payload, variables, { currentUser }) => {
        console.info(payload.updateChat);
        return true;
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

    read: async ({ id: messageId }, args, { models, currentUser, loaders }) => {
      try {
        const read = await loaders.readMessage.load(messageId);

        return !!read;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}
;