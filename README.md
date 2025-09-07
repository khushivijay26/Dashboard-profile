
# Front-End Assignment – React (JavaScript)

A responsive dashboard built with **React (JavaScript) + Vite**. It implements a **Comments Dashboard** and a **Profile** screen using data from JSONPlaceholder.

## Features
- **Two screens** with routing:
  - **Dashboard**: comments in a custom **paginated** data grid.
  - **Profile**: First record from `/users` API, **read-only**, with a back-to-dashboard button.
- **Custom Pagination** (no library): page size options **10 / 50 / 100**.
- **Search**: partial search for **name**, **email**, and **phone** (note: JSONPlaceholder comments do **not** include `phone`; the input is included for parity and will match nothing).
- **Sorting**: for **Post ID**, **Name**, **Email** with a cycle of **none → asc → desc → none**. Only **one** active sort at a time.
- **State Persistence**: search, sort, page, and page size are saved to `localStorage` and restored on refresh.
- **Accessible semantics** where practical (labels, `aria-*`, keyboard-friendly controls).
- **Responsive** layout; basic styling with a modern dark theme.
- **No UI library** used for the table, pagination, search, or sorting logic.

## APIs
- https://jsonplaceholder.typicode.com/
- Comments: /comments (used as main dataset)
- Users: /users (profile screen)

## Getting Started
```bash
npm install
npm run dev
```

## Notes
- The assignment requested search on **name, email, phone**. The comments API does not include a `phone` field; to keep the UI consistent, a `phone` key is normalized to an empty string for all rows. Searching by phone will therefore yield no matches unless the data source changes to include phones.
- No UI component library was used for the table, pagination, search, or sorting logic.
- `node_modules` is intentionally excluded from the provided zip.