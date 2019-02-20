import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isChatCreator } from '../helpers/authorization';

export default {
  Query: {
    event: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models, currentUser }) => {
        try {
          const { sub: userId } = currentUser;

          return await models.Event.findById(id, {
            include: [{
              model: models.UserEvent,
              as: 'userEventIds',
              where: { userId }
            }, {
              model: models.User,
              as: 'participants',
            }]
          });
        } catch (error) {
          throw new Error(error);
        }
      }),

    allEvents: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
        try {
          const { sub: userId } = currentUser;

          return await models.Event.findAll({
            include: [{
              model: models.UserEvent,
              as: 'userEventIds',
              where: { userId }
            }, {
              model: models.User,
              as: 'participants',
            }, {
              model: models.User,
              as: 'creator'
            }]
          });
        }  catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  Mutation: {
    createEvent: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, currentUser }) => {
        try {
          const { sub: creatorId } = currentUser;
          args.creatorId = creatorId;
          args.participants.push(creatorId);

          const event = await models.Event.create(args);
          event.setParticipants(args.participants);

          console.info(event);

          return event;
        } catch (error) {
          throw new Error(error);
        }
      }),
  }
};
