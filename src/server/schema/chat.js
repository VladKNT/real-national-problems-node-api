import { gql } from 'apollo-server-express';

export default gql `
  type Chat {
    id: ID!
    name: String!
    description: String!
    icon: String!
    unreadMessages: Int
    lastMessage: Message
    members: [User!]!
    private: Boolean!
    createdAt: String!
    updatedAt: String!
    creatorId: ID!
  }
  
  type Query {
    chat(id: ID!): Chat!
    userChats: [Chat!]!
  }
  
  type Mutation {
    createChat(name: String!, description: String, members: [ID]!): Chat!
    createPrivateChat(recipientId: ID!): Chat!
    updateChat(id: ID!, name: String, description: String): Chat!
    deleteChat(id: ID!): Boolean!
  }
`;
