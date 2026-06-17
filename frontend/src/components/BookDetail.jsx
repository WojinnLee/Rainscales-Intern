import { X } from "lucide-react";

function BookDetail({ book, loading, onClose }) {
  return (
    <section className="rounded-xl border border-hairline bg-cream p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-normal text-ink">Book detail</h2>
        {book && (
          <button className="icon-btn" title="Close detail" onClick={onClose}>
            <X size={17} />
          </button>
        )}
      </div>
      {loading ? (
        <p className="text-sm text-body">Loading detail...</p>
      ) : book ? (
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-muted">Title</dt>
            <dd className="mt-1 text-lg text-ink">{book.title}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted">Author</dt>
            <dd className="mt-1 text-ink">{book.author}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-muted">Price</dt>
              <dd className="mt-1 text-ink">{book.price}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted">Quantity</dt>
              <dd className="mt-1 text-ink">{book.quantity}</dd>
            </div>
          </div>
        </dl>
      ) : (
        <p className="text-sm leading-6 text-body">
          Select Detail on a row to view the full book information.
        </p>
      )}
    </section>
  );
}

export default BookDetail;
