import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  login,
  logout,
  updateBook,
} from "./api";
import { clearStoredAuth, getStoredAuth, storeAuth } from "./authStorage";
import { emptyBook, normalizeBookPayload } from "./bookUtils";
import BookDetail from "./components/BookDetail";
import BookForm from "./components/BookForm";
import BookTable from "./components/BookTable";
import FilterBar from "./components/FilterBar";
import LoginScreen from "./components/LoginScreen";
import PageHeader from "./components/PageHeader";
import StatusMessage from "./components/StatusMessage";

const emptyFilters = { title: "", author: "" };

function App() {
  const [auth, setAuth] = useState(getStoredAuth);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState(emptyFilters);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
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

  const clearSession = useCallback(() => {
    clearStoredAuth();
    setAuth(null);
    setBooks([]);
    setSelectedBook(null);
  }, []);

  const handleApiError = useCallback(
    (apiError) => {
      if (apiError.status === 401) {
        clearSession();
        setLoginError("Session expired. Please sign in again.");
        return;
      }

      setError(apiError.message || "Something went wrong.");
    },
    [clearSession],
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
      storeAuth(data);
      setAuth(data);
      setLoginForm({ username: "", password: "" });
    } catch (apiError) {
      setLoginError(apiError.message || "Unable to sign in.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    if (!auth?.access) {
      clearSession();
      return;
    }

    setLogoutLoading(true);
    setError("");

    try {
      await logout(auth.refresh, auth.access);
    } catch (apiError) {
      if (apiError.status !== 401) {
        setError(apiError.message || "Unable to call logout API.");
      }
    } finally {
      clearSession();
      setLogoutLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setFilters(draftFilters);
  }

  function clearFilters() {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
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
      startAdd();
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
      <LoginScreen
        form={loginForm}
        error={loginError}
        loading={loginLoading}
        onChange={(field, value) =>
          setLoginForm((current) => ({ ...current, [field]: value }))
        }
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white text-ink">
      <PageHeader onLogout={handleLogout} logoutLoading={logoutLoading} />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <section className="space-y-6">
          <FilterBar
            filters={draftFilters}
            onChange={(field, value) =>
              setDraftFilters((current) => ({ ...current, [field]: value }))
            }
            onClear={clearFilters}
            onSubmit={handleSearch}
          />

          <StatusMessage error={error} message={message} />

          <BookTable
            books={books}
            loading={listLoading}
            pagination={pagination}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            onDetail={handleDetail}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        </section>

        <aside className="space-y-6">
          <BookForm
            book={bookForm}
            editingBookId={editingBookId}
            saving={savingBook}
            onChange={(field, value) =>
              setBookForm((current) => ({ ...current, [field]: value }))
            }
            onSubmit={handleSaveBook}
            onNew={startAdd}
          />

          <BookDetail
            book={selectedBook}
            loading={detailLoading}
            onClose={() => setSelectedBook(null)}
          />
        </aside>
      </div>
    </main>
  );
}

export default App;
