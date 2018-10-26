export default {
  Query: {
    messages: async (parent, { chatId }, { models }) => {
      try {
        return await models.Message.findAll({ chatId }) ;
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    sendMessage: async (parent, args, { models }) => {
      try {
        return models.Message.create(args);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}