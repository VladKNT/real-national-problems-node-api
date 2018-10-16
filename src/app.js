import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import DataLoader from 'dataloader';

const typeDefs = mergeTypes(fileLoader('/real-national-problems-node-api/src/server/schema'));
const resolvers = mergeResolvers(fileLoader('/real-national-problems-node-api/src/server/resolvers'));
import models from "./server/models";
import loaders from './server/loaders';

const app = express();

const getCurrentUser = async (req) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const currentUser = await getCurrentUser(req);

    return {
      models,
      currentUser,
      loaders: {
        userProfile: new DataLoader((keys) => loaders.userProfile.batchUserProfiles(keys, models))
      },
      secret: process.env.SECRET
    };
  },
  playground: {
    endpoint: `http://localhost:3000/graphql`,
    settings: {
      'editor.theme': 'dark',
      'editor.cursorShape': 'line'
    }
  }
});

server.applyMiddleware({
  app
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(3000, () => {
  console.info('Apollo Server on http://localhost:3000/graphql');
});
