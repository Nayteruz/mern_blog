import { createSlice } from "@reduxjs/toolkit";

interface ICurrentUser {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
}

interface IState {
  currentUser: ICurrentUser | null;
  error: string | null;
  loading: boolean;
}

const initialState: IState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
