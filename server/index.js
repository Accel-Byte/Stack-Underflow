const { ApolloServer, PubSub } = require('apollo-server-express');
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
  .then(() => {
    console.log('Connected to mongodb');
    const pubsub = new PubSub();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      uploads: false,
      context: ({ req }) => ({ req, pubsub }),
    });
    server.applyMiddleware({ app });
    app.listen(PORT,() => console.log("started"));    
  })
  .catch((err) => console.log(err));


