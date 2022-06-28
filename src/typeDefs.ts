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
