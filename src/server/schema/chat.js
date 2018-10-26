import { gql } from 'apollo-server-express';

export default gql `
  type Chat {
    id: ID!
    name: String!
    description: String!
    icon: String!
    lastMessage: Message!
    createdAt: String!
    updatedAt: String!
    creatorId: ID!
  }
  
  type Query {
    chat(id: ID!): Chat!
    chats(userId: ID!): [Chat!]!
  }
  
  type Mutation {
    createChat(name: String, description: String, creatorId: ID, members: [ID]!): Chat!
    updateChat(id: ID!, name: String, description: String): Chat!
  }
`;
