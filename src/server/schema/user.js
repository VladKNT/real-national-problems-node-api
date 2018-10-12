import { gql } from 'apollo-server-express';

export default gql `
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    userProfile: UserProfile
  }
  
  type Token {
    token: String!
  }
  
  type Query {
    users: [User!]
  }
  
  type Mutation {
    signUp(username: String!, email: String!, password: String): Token!
    signIn(login: String!, password: String!): Token!
    updateUser(id: ID!, username: String, email: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;