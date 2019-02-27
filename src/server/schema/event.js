import { gql } from 'apollo-server-express';

export default gql `
  type Event {
    id: ID!
    name: String!
    description: String!
    photo: String!
    latitude: Float!
    longitude: Float!
    dateStart: String!
    dateEnd: String!
    participants: [User!]
    creator: User!
    createdAt: String!
    updatedAt: String!
    creatorId: ID!
  }
  
  type Query {
    event(id: ID!): Event
    allEvents: [Event]
  }
  
  type Mutation {
    createEvent(
      name: String!, 
      description: String!, 
      participants: [ID], 
      imageFile: Upload!
      latitude: Float!, 
      longitude: Float!,
      dateStart: String!
      dateEnd: String!
    ): Event!
  }
`;
