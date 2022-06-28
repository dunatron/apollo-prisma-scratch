require("dotenv").config();
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { context } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: context,
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port http://localhost:4000
    Explore at https://studio.apollographql.com/dev
  `);
});
