export const batchCreators = async (keys, models) => {
  const creators = await models.User.findAll({ where: { id: keys } });

  return keys.map(key => creators.find(creator => creator.id === key));
};
