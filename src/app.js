import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import DataLoader from 'dataloader';
import { JwtService } from './server/services/auth';

import tokenConf from './server/config/token';
const typeDefs = mergeTypes(fileLoader('/real-national-problems-node-api/src/server/schema'));
const resolvers = mergeResolvers(fileLoader('/real-national-problems-node-api/src/server/resolvers'));
import models from './server/models';
import loaders from './server/loaders';

const app = express();

const getCurrentUser = async (token) => {
  if (token) {
    try {
      return await JwtService.verify(token, tokenConf.access.secret);
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
  context: async (data) => {
    const {
      req,
      connection
    } = data;
    let token;

    if (req) {
      token = req.headers['x-token'];
    } else if (connection) {
      token = connection.context['x-token']
    }

    const currentUser = await getCurrentUser(token);

    return {
      models,
      currentUser,
      loaders: {
        userProfile: new DataLoader((keys) => loaders.userProfile.batchUserProfiles(keys, models)),
        creators: new DataLoader((keys) => loaders.common.batchCreators(keys, models)),
        readMessage: new DataLoader((keys) => loaders.message.batchReadMessages(keys, currentUser, models)),
      },
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

app.use('/images', express.static('images'));

server.applyMiddleware({
  app
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(3000, () => {
  console.info('Apollo Server on http://localhost:3000/graphql');
});
