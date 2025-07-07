import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import { store } from './store';
import "./styles/index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
