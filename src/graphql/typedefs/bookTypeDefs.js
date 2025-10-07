export const bookTypeDefs = `#graphql
  type Book {
    book_id: ID!
    title: String!
    author: String!
    category_id: ID!
    category: Category
  }

  type Category {
    category_id: ID!
    category_name: String!
  }

  type Query {
    books: [Book]
  }
`;