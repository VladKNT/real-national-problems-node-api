import { gql } from 'apollo-server-express';

export default gql `
  type Message {
    id: ID!
    message: String!
    owner: User!
    deleted: Boolean!
    edited: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  
  type Query {
    messages(chatId: ID!): [Message!]
  }
  
  type Mutation {
    sendMessage(message: String!, chatId: ID!, creatorId: ID!): Message!
  }
`;
