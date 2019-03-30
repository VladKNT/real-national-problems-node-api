export const batchReadMessages = async (keys, currentUser, models) => {
  const { sub: userId } = currentUser;
  const readMessages = await models.UserMessage.findAll({ where: { messageId: keys, userId }});
  return keys.map(key => readMessages.find(readMessage => readMessage.messageId === key));
};
