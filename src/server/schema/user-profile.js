import { gql } from 'apollo-server-express';

export default gql `
  type UserProfile {
    id: ID!
    firstName: String!
    lastName: String!
    profilePhoto: String
    userId: ID!
  }
  
  type Query {
    userProfile(userId: ID!): UserProfile!
  }
`;
