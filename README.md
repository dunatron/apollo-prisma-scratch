# Setup from scratch

```bash
mkdir backend && cd backend && npx prisma init
```

`prisma init` will do some setup for you. Head into .env, and you’ll see this: update it to the mongodb connection

```.env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

update it to a mongodb connection

```.env
mongodb+srv://Dunatron:xxxxxxxxx@freesharedcluster.xxxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

prisma init will also create a folder at the root called `prisma`

- prisma
  - schema.prisma

We will modify this file which creates MongoDb structures that we can use prisma client to interact with

schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Post {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  slug     String    @unique
  title    String
  body     String
  comments Comment[]
  author   User      @relation(fields: [authorId], references: [id])
  authorId String    @db.ObjectId
}

// Comments contain a comment string and connect back to the post.
// postId must have @db.ObjectId to match up with Post's id type
model Comment {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  post    Post   @relation(fields: [postId], references: [id])
  postId  String @db.ObjectId
  comment String
}

model User {
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  email String  @unique
  name  String?
  posts Post[]
}
```

```bash
yarn init -y
```

install the development dependencies

```bash
yarn add -D prisma typescript ts-node @types/node nodemon @graphql-codegen/cli
```

install the project dependencies

```bash
yarn add prisma apollo-server graphql
```

running `npx prisma generate` will then generate the PrismaClient in the node_modules folder for us to use.
it will also add it as a dependency in your package.json file e.g "@prisma/client": "3.15.2",

running `npx prisma studio`  
You’ll have an amazing GUI for your DB at http://localhost:5500

```bash
touch tsconfig.json && mkdir src && cd src && touch server.ts resolvers.ts typeDefs.ts context.ts
```

```bash
yarn add apollo-server graphql && yarn add -D nodemon typescript ts-node @graphql-codegen/cli
```

add this to the tsconfig.json file

```
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "lib": ["esnext"],
    "strict": true
  },
  "include": ["src/**/*"]
}
```

and add this script to your package.json

```
"scripts": {
  "start": "nodemon src/server.ts"
}
```

Add a `src/context.ts` file

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};
```

add a typeDefs.ts file

```ts
import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    name: String
    posts: [Post!]
  }
  type Post {
    id: String!
    slug: String
    title: String
    body: String
    comments: [Comment!]
    author: User
  }
  type Comment {
    id: String!
    post: Post
    postId: Int
    comment: String
  }
  type Query {
    AllPosts: [Post!]!
  }
  type Mutation {
    AddPost(title: String!, body: String!): Post!
  }
`;
```

add a `src/resolvers.ts` file

```ts
export const resolvers = {};
```

finally create a server.ts file

```ts
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
```

# Adding CodeGen

run `yarn graphql-codegen init`

You will be taken through a series of steps

- What type of Application are you building
  - Backend - API or server
- Where is your schema
  - hit enter for default
- Pick plugins
  - TypeScript (required by other typescript plugins)
  - TypeScript Resolvers (strongly typed resolve functions)
- Where to write the output
  - hit enter for default location
- Do you want to generate an introspection file?
  - Type "n" for introspection file unless you know you want one
- How to name the config file?
  - hit enter for default
- What script in package.json should run the codegen?
  - type "generate"

We then need to overwrite what is on the codegen.yaml file

```yaml
overwrite: true
schema: "http://localhost:4000"
generates:
  src/generated/graphql.ts:
    plugins:
      - "typescript"
      - "typescript-resolvers"
    config:
      contextType: ../context#Context
      useIndexSignature: true
```

run `yarn install`

then run the server so we can run a code generate against it later.  
run `yarn run start`  
then in another terminal run `yarn run generate`

This will generate some code to use
