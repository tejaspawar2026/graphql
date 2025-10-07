export const bookResolver = {
  Query: {
    books: async (_, __, { db }) => {
      const [books] = await db.query("SELECT * FROM books");
      return books;
    },
  },
  Book: {
    category: async (parent, _, { db }) => {

      const [rows] = await db.query(
        "SELECT category_id, category_name FROM book_categories WHERE category_id = ?",
        [parent.category_id]
      );

      return rows[0] || null;
    },
  },
};