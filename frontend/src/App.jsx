import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  login,
  updateBook,
} from "./api";

const emptyBook = {
  title: "",
  author: "",
  price: "",
  quantity: "",
};

function normalizeBookPayload(book) {
  return {
    title: book.title.trim(),
    author: book.author.trim(),
    price: Number(book.price),
    quantity: Number(book.quantity),
  };
}

function App() {
  const [auth, setAuth] = useState(() => {
    const access = localStorage.getItem("book_access_token");
    const refresh = localStorage.getItem("book_refresh_token");
    return access ? { access, refresh } : null;
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({ title: "", author: "" });
  const [draftFilters, setDraftFilters] = useState({ title: "", author: "" });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [listLoading, setListLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bookForm, setBookForm] = useState(emptyBook);
  const [editingBookId, setEditingBookId] = useState(null);
  const [savingBook, setSavingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(pagination.count / pageSize));
  }, [pageSize, pagination.count]);

  const signOut = useCallback(() => {
    localStorage.removeItem("book_access_token");
    localStorage.removeItem("book_refresh_token");
    setAuth(null);
    setBooks([]);
    setSelectedBook(null);
  }, []);

  const handleApiError = useCallback(
    (apiError) => {
      if (apiError.status === 401) {
        signOut();
        setLoginError("Session expired. Please sign in again.");
        return;
      }

      setError(apiError.message || "Something went wrong.");
    },
    [signOut],
  );

  const loadBooks = useCallback(async () => {
    if (!auth?.access) return;

    setListLoading(true);
    setError("");

    try {
      const data = await listBooks(
        {
          page,
          pageSize,
          title: filters.title.trim(),
          author: filters.author.trim(),
        },
        auth.access,
      );
      setBooks(data.results || []);
      setPagination({
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      });
    } catch (apiError) {
      handleApiError(apiError);
    } finally {
      setListLoading(false);
    }
  }, [auth?.access, filters.author, filters.title, handleApiError, page, pageSize]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const data = await login(loginForm);
      localStorage.setItem("book_access_token", data.access);
      localStorage.setItem("book_refresh_token", data.refresh);
      setAuth(data);
      setLoginForm({ username: "", password: "" });
    } catch (apiError) {
      setLoginError(apiError.message || "Unable to sign in.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setFilters(draftFilters);
  }

  function clearFilters() {
    const nextFilters = { title: "", author: "" };
    setDraftFilters(nextFilters);
    setFilters(nextFilters);
    setPage(1);
  }

  function startAdd() {
    setEditingBookId(null);
    setBookForm(emptyBook);
    setMessage("");
    setError("");
  }

  function startEdit(book) {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      quantity: String(book.quantity),
    });
    setMessage("");
    setError("");
  }

  async function handleSaveBook(event) {
    event.preventDefault();
    setSavingBook(true);
    setMessage("");
    setError("");

    try {
      const payload = normalizeBookPayload(bookForm);
      if (editingBookId) {
        await updateBook(editingBookId, payload, auth.access);
        setMessage("Book updated successfully.");
      } else {
        await createBook(payload, auth.access);
        setMessage("Book added successfully.");
      }
      setBookForm(emptyBook);
      setEditingBookId(null);
      await loadBooks();
    } catch (apiError) {
      handleApiError(apiError);
    } finally {
      setSavingBook(false);
    }
  }

  async function handleDetail(id) {
    setDetailLoading(true);
    setError("");

    try {
      const data = await getBook(id, auth.access);
      setSelectedBook(data);
    } catch (apiError) {
      handleApiError(apiError);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(`Delete "${book.title}"?`);
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await deleteBook(book.id, auth.access);
      setMessage("Book deleted successfully.");
      if (selectedBook?.id === book.id) {
        setSelectedBook(null);
      }
      await loadBooks();
    } catch (apiError) {
      handleApiError(apiError);
    }
  }

  if (!auth?.access) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
        <section className="w-full max-w-md rounded-xl border border-hairline bg-white p-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
              <BookOpen size={24} />
            </span>
            <div>
              <h1 className="text-3xl font-normal leading-tight text-ink">
                Book Manager
              </h1>
              <p className="mt-1 text-sm text-body">Sign in to manage the catalog.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                className="field mt-2"
                id="username"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                className="field mt-2"
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {loginError}
              </p>
            )}
            <button className="btn-primary w-full" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                <BookOpen size={22} />
              </span>
              <h1 className="text-4xl font-normal tracking-normal text-ink">
                Book Manager
              </h1>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
              Manage book inventory with search, pagination, and authenticated CRUD.
            </p>
          </div>
          <button className="btn-secondary" onClick={signOut}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <section className="space-y-6">
          <form
            className="grid gap-4 rounded-xl border border-hairline bg-surface-soft p-4 md:grid-cols-[1fr_1fr_auto_auto]"
            onSubmit={handleSearch}
          >
            <div>
              <label className="label" htmlFor="filter-title">
                Title
              </label>
              <input
                className="field mt-2"
                id="filter-title"
                value={draftFilters.title}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Search title"
              />
            </div>
            <div>
              <label className="label" htmlFor="filter-author">
                Author
              </label>
              <input
                className="field mt-2"
                id="filter-author"
                value={draftFilters.author}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    author: event.target.value,
                  }))
                }
                placeholder="Search author"
              />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full" type="submit">
                <Search size={18} />
                Search
              </button>
            </div>
            <div className="flex items-end">
              <button className="btn-secondary w-full" type="button" onClick={clearFilters}>
                <X size={18} />
                Clear
              </button>
            </div>
          </form>

          {(message || error) && (
            <div
              className={`rounded-md px-4 py-3 text-sm ${
                error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              {error || message}
            </div>
          )}

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
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
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
                  {listLoading ? (
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
                              onClick={() => handleDetail(book.id)}
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              className="icon-btn"
                              title="Edit"
                              onClick={() => startEdit(book)}
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              className="icon-btn text-coral"
                              title="Delete"
                              onClick={() => handleDelete(book)}
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
                disabled={!pagination.previous || listLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <span className="text-sm font-medium text-body">Page {page}</span>
              <button
                className="btn-secondary"
                disabled={!pagination.next || listLoading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-hairline bg-white p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-normal text-ink">
                {editingBookId ? "Edit book" : "Add book"}
              </h2>
              {editingBookId && (
                <button className="btn-secondary px-3" onClick={startAdd}>
                  <Plus size={18} />
                  New
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSaveBook}>
              <div>
                <label className="label" htmlFor="book-title">
                  Title
                </label>
                <input
                  className="field mt-2"
                  id="book-title"
                  value={bookForm.title}
                  onChange={(event) =>
                    setBookForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
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
                  value={bookForm.author}
                  onChange={(event) =>
                    setBookForm((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
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
                    value={bookForm.price}
                    onChange={(event) =>
                      setBookForm((current) => ({
                        ...current,
                        price: event.target.value,
                      }))
                    }
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
                    value={bookForm.quantity}
                    onChange={(event) =>
                      setBookForm((current) => ({
                        ...current,
                        quantity: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <button className="btn-primary w-full" disabled={savingBook}>
                <Plus size={18} />
                {savingBook
                  ? "Saving..."
                  : editingBookId
                    ? "Save"
                    : "Add Book"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-hairline bg-cream p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-normal text-ink">Book detail</h2>
              {selectedBook && (
                <button className="icon-btn" title="Close detail" onClick={() => setSelectedBook(null)}>
                  <X size={17} />
                </button>
              )}
            </div>
            {detailLoading ? (
              <p className="text-sm text-body">Loading detail...</p>
            ) : selectedBook ? (
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-muted">Title</dt>
                  <dd className="mt-1 text-lg text-ink">{selectedBook.title}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted">Author</dt>
                  <dd className="mt-1 text-ink">{selectedBook.author}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-muted">Price</dt>
                    <dd className="mt-1 text-ink">{selectedBook.price}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted">Quantity</dt>
                    <dd className="mt-1 text-ink">{selectedBook.quantity}</dd>
                  </div>
                </div>
              </dl>
            ) : (
              <p className="text-sm leading-6 text-body">
                Select Detail on a row to view the full book information.
              </p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;
