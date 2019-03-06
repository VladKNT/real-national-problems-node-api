import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isChatCreator } from '../helpers/authorization';

export default {
  Query: {
    chat: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models, currentUser }) => {
      try {
        const { sub: userId } = currentUser;

        return await models.Chat.findById(id, {
          include: [{
            model: models.UserChat,
            as: 'userChatIds',
            where: { userId }
          }, {
            model: models.User,
            as: 'members',
          }],
        });
      } catch (error) {
        throw new Error(error);
      }
    }),

    userChats: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
      try {
        const { sub: userId } = currentUser;

        return await models.Chat.findAll({
          include: [{
            model: models.UserChat,
            as: 'userChatIds',
            where: { userId}
          }, {
            model: models.User,
            as: 'members',
          }],
        });
      } catch (error) {
        throw new Error(error);
      }
    })
  },

  Mutation: {
    createChat: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
      try {
        const { sub: creatorId } = currentUser;
        args.creatorId = creatorId;
        args.members.push(creatorId);

        const chat = await models.Chat.create(args);
        await chat.setMembers(args.members);

        return chat;
      } catch (error) {
        throw new Error(error);
      }
    }),

    createPrivateChat: combineResolvers(
      isAuthenticated,
      async (parent, { recipientId }, {models, currentUser }) => {
        try {
          const { sub: creatorId } = currentUser;

          const chat = await models.Chat.create({ private: true });
          await chat.setMembers([ creatorId, recipientId ]);

          return chat;
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    updateChat: combineResolvers(
      isChatCreator,
      async (parent, args, { models }) => {
      try {
        const chat = await models.Chat.update(args, {
          fields: Object.keys(args),
          returning: true,
          plain: true,
          where: { id: args.id }
        });

        return chat[1];
      } catch (error) {
        throw new Error(error);
      }
    }),

    deleteChat: combineResolvers(
      isChatCreator,
      async (parent, { id }, { models }) => {
      try {
        await models.Chat.destroy({ where: { id } });

        return true;
      } catch (error) {
        throw new Error(error);
      }
    })
  },

  Chat: {
    lastMessage: async ({ id }, args, { models }) => {
      try {
        return models.Message.findOne({
          where: { chatId: id },
          order: [[ 'createdAt', 'DESC' ]]
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
