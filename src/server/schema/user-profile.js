import { gql } from 'apollo-server-express';

export default gql `
  type UserProfile {
    id: ID!
    firstName: String
    lastName: String
    bio: String
    profilePhoto: String
    userId: ID!
  }
  
  type Query {
    userProfile(userId: ID!): UserProfile!
  }
  
  type Mutation {
    updateUserProfile(id: ID!, firstName: String, lastName: String, bio: String, profilePhoto: String): UserProfile!
  }
`;
