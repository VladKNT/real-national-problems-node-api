import { combineResolvers } from 'graphql-resolvers';
import { isOwner } from '../helpers/authorization';

export default {
  Mutation: {
    updateUserProfile: combineResolvers(
      isOwner,
      async (parent, args, { models }) => {
        try {
          const userProfile = await models.UserProfile.update(args, {
            fields: Object.keys(args),
            returning: true,
            plain: true,
            where: { userId: args.id }
          });

          return userProfile[1];
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  }
}