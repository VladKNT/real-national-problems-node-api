import { gql } from 'apollo-server-express';

export default gql `
  type Message {
    id: ID!
    message: String!
    chatId: ID!
    ownerId: ID!
    owner: User!
    deleted: Boolean!
    deletedForAll: Boolean!
    edited: Boolean!
    read: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  
  type Query {
    messages(chatId: ID!, offset: Int, limit: Int): [Message!]
  }
  
  type Mutation {
    sendMessage(message: String!, chatId: ID!): Message!
    updateMessage(id: ID!, message: String!): Message!
    deleteMessage(id: ID!, deletedForAll: Boolean): Boolean!
    readMessages(messagesId: [ID]!): [Message]!
  }
  
  type Subscription {
    messageSent(chatId: ID!): Message!
    updateChat: Chat!
  }
`;
