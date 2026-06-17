import { BookOpen, LogOut } from "lucide-react";

function PageHeader({ onLogout, logoutLoading }) {
  return (
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
        <button className="btn-secondary" onClick={onLogout} disabled={logoutLoading}>
          <LogOut size={18} />
          {logoutLoading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}

export default PageHeader;
