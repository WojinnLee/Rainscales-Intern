import { BookOpen } from "lucide-react";

function LoginScreen({
  form,
  error,
  loading,
  onChange,
  onSubmit,
}) {
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

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              className="field mt-2"
              id="username"
              value={form.username}
              onChange={(event) => onChange("username", event.target.value)}
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
              value={form.password}
              onChange={(event) => onChange("password", event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginScreen;
