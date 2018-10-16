export const batchUserProfiles = async (keys, models) => {
  const userProfiles = await models.UserProfile.findAll({ userId: keys });

  return keys.map(key => userProfiles.find(userProfile => userProfile.userId === key));
};
