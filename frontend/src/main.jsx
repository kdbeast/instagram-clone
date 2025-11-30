import "./index.css";
import App from "./App.jsx";
import store from "./redux/store";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";

let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>
);
