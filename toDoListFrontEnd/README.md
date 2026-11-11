# Text Popup

A small React + TypeScript application built with Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Click **Enter some text**, type your text, then press **Enter** or click **Submit**. Use **Cancel** or **Escape** to dismiss the popup. The last submitted text is displayed on the page and resets on refresh.

## Backend connection

`src/api.ts` sends `POST /api/toDo` with `{ "title": text, "completed": false }`. During development, Vite proxies `/api` requests to `http://127.0.0.1:3000`, keeping browser requests on the frontend's origin and avoiding cross-origin requests. Start the backend separately and restart `npm run dev` after changing the proxy configuration. The form awaits the request, prevents duplicate submissions, and displays any thrown error in the popup.

For production, configure your web server to forward `/api` to the backend. The Vite development proxy is not included in the built files.

## Production build

```sh
npm run build
npm run preview
```

The build command checks TypeScript and writes the production app to `dist/`.
