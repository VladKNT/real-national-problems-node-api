import { combineResolvers } from 'graphql-resolvers';
import { withFilter } from 'apollo-server';
import { isAuthenticated } from '../helpers/authorization';
import { uploadImage } from '../helpers/imageUploader';
import pubsub, { EVENTS } from "../subscriptions";
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
          return await models.Event.findAll({ order:[[ "dateStart", "DESC" ]]});
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

          pubsub.publish(EVENTS.EVENT.EVENT_CREATED, {
            eventCreated: event
          });

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


          pubsub.publish(EVENTS.EVENT.FOLLOW_EVENT, {
            followEvent: event
          });

          return event;
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  },

  Subscription: {
    eventCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.EVENT.EVENT_CREATED)
    },

    followEvent: {
      subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.EVENT.FOLLOW_EVENT), (payload, variables) => {
        return variables.id == payload.followEvent.id;
      }),
    }
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
