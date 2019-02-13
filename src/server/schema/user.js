import { gql } from 'apollo-server-express';

export default gql `
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    userProfile: UserProfile
  }
  
  type Tokens {
    accessToken: String!
    refreshToken: String!
  }
  
  type Query {
    getUser: User!
    users: [User!]
  }
  
  type Mutation {
    signUp(username: String!, email: String!, password: String!, firstName: String!, lastName: String!): Tokens!
    signIn(login: String!, password: String!): Tokens!
    refreshToken(token: String!): Tokens!
    updateUser(id: ID!, username: String, email: String, firstName: String, lastName: String, bio: String, profilePhoto: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;