import Navbar from "./Components/Header/Navbar";
import "./App.css";
import SignUp from "./Components/SignUp/SignUp";
import Home from "./Components/Home/Home";
import { Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn.jsx/SignIn";
import UpdateProfile from "./Components/Profile/UpdateProfile";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import {
  setIsCompleteProfile,
  setProfileData,
  setLoginStatus,
} from "./Store/Slices/AuthSlice";
import { setExpenses } from "./Store/Slices/ExpenseSlice";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const UserMail = localStorage.getItem('userName')
  const API = `https://expense-tracker-6667c-default-rtdb.firebaseio.com/${UserMail}`

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const getProfileData = async (token) => {
    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDo-GMUlH9BQyAiH-8WzkaPymtrR5opfKw",
        {
          idToken: token,
        }
      );
      const data = response.data;
      if (data.users) {
        const { displayName, photoUrl } = data.users[0];
        if (displayName && photoUrl) {
          console.log(displayName, photoUrl)
          dispatch(setIsCompleteProfile(true));
          dispatch(setProfileData({ name: displayName, photo: photoUrl }));
        }
      } else {
        dispatch(setIsCompleteProfile(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getExpenses = async ()=>{
    const response = await axios(`${API}.json`)
    const data = response.data
    if (data) {
      const expenseData = Object.values(data);
      dispatch(setExpenses(expenseData));
    } else {
      dispatch(setExpenses([]));
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("loginId");
    if (token) {
      getProfileData(token);
      getExpenses()
      dispatch(setLoginStatus(true));
    } else {
      dispatch(setLoginStatus(false));
    }
  }, [isLogin]);

  return (
    <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UpdateProfile />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
        <ToastContainer /> 
    </>
  );
}

export default App;
