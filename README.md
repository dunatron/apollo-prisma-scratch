## Setup from scratch

```bash
mkdir backend && cd backend && npx prisma init
```

`prisma init` will do some setup for you. Head into .env, and you’ll see this: update it to the mongodb connection

```.env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

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

running `npx prisma generate` will then generate the PrismaClient in the node_modules folder for us to use

running `npx prisma studio`  
You’ll have an amazing GUI for your DB at http://localhost:5500

```bash
touch tsconfig.json && mkdir src && cd src && touch index.ts resolvers.ts typeDefs.ts
```

```bash
yarn add apollo-server graphql && yarn add -D nodemon typescript ts-node @graphql-codegen/cli
```

add this to the tsconfig.json file

```
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "lib": ["es2018"],
    "esModuleInterop": true,
    "baseUrl": "./src",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "pretty": true,
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

and add this script to your package.json

```
"scripts": {
  "start": "nodemon src/index.ts"
}
```
