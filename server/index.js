const { ApolloServer, PubSub } = require('apollo-server-express');
const http  = require('http');
const mongoose = require('mongoose');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const cors = require("cors");

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
const { MONGODB, PORT } = require('./config');

const app = express();
app.use(
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
);
app.use(cors());

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to mongodb');
    const pubsub = new PubSub();
    const server = new ApolloServer({
      typeDefs,
      resolvers,  
      uploads: false,
      subscriptions:{
        path: '/subscriptions'
      },
      context: ({ req }) => ({ req, pubsub }),
    });
    await server.start();
    server.applyMiddleware({ app });
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    
    httpServer.listen(PORT,() => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql${server.subscriptionsPath}`);
    });    
  })
  .catch((err) => console.log(err));


