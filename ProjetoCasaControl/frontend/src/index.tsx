import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (process.env.NODE_ENV === "development") {
  // In development, avoid StrictMode here to prevent double mounting of effects
  // which causes duplicate fetches when React's StrictMode intentionally
  // mounts/unmounts components twice for dev checks.
  root.render(<App />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
