import { Search, X } from "lucide-react";

function FilterBar({ filters, onChange, onClear, onSubmit }) {
  return (
    <form
      className="grid gap-4 rounded-xl border border-hairline bg-surface-soft p-4 md:grid-cols-[1fr_1fr_auto_auto]"
      onSubmit={onSubmit}
    >
      <div>
        <label className="label" htmlFor="filter-title">
          Title
        </label>
        <input
          className="field mt-2"
          id="filter-title"
          value={filters.title}
          onChange={(event) => onChange("title", event.target.value)}
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
          value={filters.author}
          onChange={(event) => onChange("author", event.target.value)}
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
        <button className="btn-secondary w-full" type="button" onClick={onClear}>
          <X size={18} />
          Clear
        </button>
      </div>
    </form>
  );
}

export default FilterBar;
