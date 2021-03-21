const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config");

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongodb");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`server started at  ${res.url}`);
  })
  .catch((err) => console.log(err));

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});
