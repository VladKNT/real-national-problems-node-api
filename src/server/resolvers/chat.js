export default {
  Query: {
    chat: async (parent, { id }, { models }) => {
      try {
        return await models.Chat.findById(id);
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    createChat: async (parent, args, { models }) => {
      try {
        return await models.Chat.create(args);
      } catch (error) {
        throw new Error(error);
      }
    },

    updateChat: async (parent, args, { models }) => {
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

    }
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
}