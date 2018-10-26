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
    users: [User!]
  }
  
  type Mutation {
    signUp(username: String!, email: String!, password: String!, first_name: String!, last_name: String!): Tokens!
    signIn(login: String!, password: String!): Tokens!
    refreshToken(token: String!): Tokens!
    updateUser(id: ID!, username: String, email: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;