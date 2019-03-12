import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from '../helpers/authorization';
import { uploadImage } from '../helpers/imageUploader';
import _ from 'lodash';

export default {
  Query: {
    event: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        try {
          return await models.Event.findById(id);
        } catch (error) {
          throw new Error(error);
        }
      }),

    allEvents: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => {
        try {
          return await models.Event.findAll();
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
          const photo = args.photo = await uploadImage(await args.imageFile, 'events');
          args.photo = photo.path;

          const { sub: creatorId } = currentUser;

          args.creatorId = creatorId;
          args.participants.push(creatorId);

          const event = await models.Event.create(args);
          await event.setParticipants(args.participants);

          return event;
        } catch (error) {
          throw new Error(error);
        }
      }),

    follow: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models, currentUser }) => {
        try {
          const { sub: userId } = currentUser;
          const event = await models.Event.findById(id,
            {
              include: {
                model: models.User,
                as: 'participants',
              }
            });

          let { participants } = event;
          participants = _.map(participants, (participant) => participant.id);

          if (_.includes(participants, parseInt(userId))) {
            _.remove(participants, (id) => id == userId);
          } else {
            participants.push(userId);
          }

          await event.setParticipants(participants);
          return event;
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  Event: {
    creator: async ({ creatorId }, args, { models, loaders }) => {
      try {
        return loaders.creators.load(creatorId);
      } catch (error) {
        throw new Error(error);
      }
    },

    participants: async ({ id }, args, { models }) => {
      try {
        return await models.User.findAll({
          include: [{
            model: models.UserEvent,
            as: 'userEventIds',
            where: { eventId: id }
          }]
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
