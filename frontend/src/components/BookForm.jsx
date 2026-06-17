import { Plus } from "lucide-react";

function BookForm({
  book,
  editingBookId,
  saving,
  onChange,
  onSubmit,
  onNew,
}) {
  return (
    <section className="rounded-xl border border-hairline bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-normal text-ink">
          {editingBookId ? "Edit book" : "Add book"}
        </h2>
        {editingBookId && (
          <button className="btn-secondary px-3" onClick={onNew}>
            <Plus size={18} />
            New
          </button>
        )}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="book-title">
            Title
          </label>
          <input
            className="field mt-2"
            id="book-title"
            value={book.title}
            onChange={(event) => onChange("title", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="book-author">
            Author
          </label>
          <input
            className="field mt-2"
            id="book-author"
            value={book.author}
            onChange={(event) => onChange("author", event.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="book-price">
              Price
            </label>
            <input
              className="field mt-2"
              id="book-price"
              type="number"
              min="0"
              step="0.01"
              value={book.price}
              onChange={(event) => onChange("price", event.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="book-quantity">
              Quantity
            </label>
            <input
              className="field mt-2"
              id="book-quantity"
              type="number"
              min="0"
              step="1"
              value={book.quantity}
              onChange={(event) => onChange("quantity", event.target.value)}
              required
            />
          </div>
        </div>
        <button className="btn-primary w-full" disabled={saving}>
          <Plus size={18} />
          {saving ? "Saving..." : editingBookId ? "Save" : "Add Book"}
        </button>
      </form>
    </section>
  );
}

export default BookForm;
