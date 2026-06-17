export const emptyBook = {
  title: "",
  author: "",
  price: "",
  quantity: "",
};

export function normalizeBookPayload(book) {
  return {
    title: book.title.trim(),
    author: book.author.trim(),
    price: Number(book.price),
    quantity: Number(book.quantity),
  };
}
