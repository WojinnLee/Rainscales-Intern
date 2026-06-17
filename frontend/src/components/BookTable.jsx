import { ChevronLeft, ChevronRight, Edit3, Eye, Trash2 } from "lucide-react";

function BookTable({
  books,
  loading,
  pagination,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onDetail,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-white">
      <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-normal text-ink">Books</h2>
          <p className="mt-1 text-sm text-body">
            {pagination.count} records, page {page} of {totalPages}
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-ink">
          Page size
          <select
            className="field w-28"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value={20}>20</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline text-left text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-body" colSpan={5}>
                  Loading books...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-body" colSpan={5}>
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="align-middle">
                  <td className="max-w-xs px-4 py-4 font-medium text-ink">
                    {book.title}
                  </td>
                  <td className="px-4 py-4 text-body">{book.author}</td>
                  <td className="px-4 py-4 text-body">{book.price}</td>
                  <td className="px-4 py-4 text-body">{book.quantity}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="icon-btn"
                        title="Detail"
                        onClick={() => onDetail(book.id)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => onEdit(book)}
                      >
                        <Edit3 size={17} />
                      </button>
                      <button
                        className="icon-btn text-coral"
                        title="Delete"
                        onClick={() => onDelete(book)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-hairline p-4">
        <button
          className="btn-secondary"
          disabled={!pagination.previous || loading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft size={18} />
          Previous
        </button>
        <span className="text-sm font-medium text-body">Page {page}</span>
        <button
          className="btn-secondary"
          disabled={!pagination.next || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default BookTable;
