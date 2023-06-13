import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isCompleteProfile: false,
    isVerified: false,
    profileData: {},
  },
  reducers: {
    setLoginStatus: (state, action) => {
      state.isLogin = action.payload;
    },  
    setIsCompleteProfile: (state, action) => {
      state.isCompleteProfile = action.payload;
    },
    setVerifiedStatus: (state, action) => {
      state.isVerified = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
  },
});

export const {
  setLoginStatus,
  setIsCompleteProfile,
  setVerifiedStatus,
  setProfileData,
} = authSlice.actions;

export default authSlice.reducer;
