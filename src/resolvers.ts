import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  RequireFields,
  MutationAddPostArgs,
  Resolver,
  ResolverTypeWrapper,
  User,
  Post,
  Comment,
} from "./generated/graphql";

import { Context } from "./context";

const AddPost: Resolver<
  ResolverTypeWrapper<Post>,
  {},
  Context,
  RequireFields<MutationAddPostArgs, "title" | "body">
> = async (_, args, { prisma }) => {
  const titleInput = args.title;
  const bodyInput = args.body;

  const user = await prisma.user.upsert({
    create: {
      email: "heath.dunlop.hd@gmail.com",
      name: "Heath",
    },
    where: {
      email: "heath.dunlop.hd@gmail.com",
    },
    update: {},
  });

  const newPost = prisma.post.create({
    data: {
      title: titleInput,
      slug: "",
      body: bodyInput,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      author: true,
    },
  });
  return newPost;
};

export const resolvers: Resolvers = {
  Query: {
    AllPosts: async (_, args, context) => {
      const posts = await context.prisma.post.findMany();
      return posts;
    },
  },
  Mutation: {
    AddPost,
  },
};
