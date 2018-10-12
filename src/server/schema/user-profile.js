import { gql } from 'apollo-server-express';

export default gql `
  type UserProfile {
    id: ID!
    first_name: String!
    last_name: String,
    userId: ID!
  }
  
  type Query {
    userProfile(userId: ID!): UserProfile!
  }
`;
