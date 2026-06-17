const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}, token) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data.detail || Object.values(data).flat().join(" ");
    const error = new Error(message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function login(credentials) {
  return request("/token/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logout(refresh, token) {
  return request(
    "/logout/",
    {
      method: "POST",
      body: JSON.stringify({ refresh }),
    },
    token,
  );
}

export function listBooks({ page, pageSize, title, author }, token) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (title) params.set("title", title);
  if (author) params.set("author", author);

  return request(`/books/?${params.toString()}`, {}, token);
}

export function getBook(id, token) {
  return request(`/books/${id}/`, {}, token);
}

export function createBook(book, token) {
  return request(
    "/books/",
    {
      method: "POST",
      body: JSON.stringify(book),
    },
    token,
  );
}

export function updateBook(id, book, token) {
  return request(
    `/books/${id}/`,
    {
      method: "PUT",
      body: JSON.stringify(book),
    },
    token,
  );
}

export function deleteBook(id, token) {
  return request(
    `/books/${id}/`,
    {
      method: "DELETE",
    },
    token,
  );
}
