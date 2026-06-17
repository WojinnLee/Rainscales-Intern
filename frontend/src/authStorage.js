const ACCESS_TOKEN_KEY = "book_access_token";
const REFRESH_TOKEN_KEY = "book_refresh_token";

export function getStoredAuth() {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

  return access ? { access, refresh } : null;
}

export function storeAuth(auth) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refresh);
}

export function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
