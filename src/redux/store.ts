import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { usersApi } from "./apis/usersApi";
import { messagesApi } from "./apis/messagesApi";
import { surveyApi } from "./apis/surveysApi";
import { careTeamApi } from "./apis/careTeamApi";

import usersReducer from "./slices/usersSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [surveyApi.reducerPath]: surveyApi.reducer,
    [careTeamApi.reducerPath]: careTeamApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(messagesApi.middleware)
      .concat(surveyApi.middleware)
      .concat(careTeamApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
