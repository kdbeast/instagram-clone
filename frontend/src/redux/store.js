import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import chatSlice from "./chatSlice";
import socketSlice from "./socketSlice";
import storage from "redux-persist/lib/storage";
import realTimeNotification from "./realTimeNotify";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["socketio"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: realTimeNotification,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "socket/setSocket",
        ],
        ignoredPaths: ["socketio.socket"],
      },
    }),
});

export default store;
