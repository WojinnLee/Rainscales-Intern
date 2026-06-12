# Book Manager Frontend

React Vite Tailwind app for the Django book API.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

The Vite dev server proxies `/api` to:

```text
http://127.0.0.1:8000
```

Start Django separately before logging in. Use an existing Django username and password; the app calls `POST /api/token/` and uses the returned JWT for `/api/books/`.
