// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Navigate, Route, Routes } from "react-router-dom";
import Customize from "./pages/Customize";
import React from "react";
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";

function App() {
  const context = React.useContext(userDataContext);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            context.userData?.assistantName &&
            context.userData?.assistantImage ? (
              <Home />
            ) : (
              <Navigate to={"/customize"} />
            )
          }
        />

        <Route
          path="/signup"
          element={!context.userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!context.userData ? <SignIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/customize"
          element={
            context.userData ? <Customize /> : <Navigate to={"/signup"} />
          }
        />

        <Route
          path="/customize2"
          element={
            context.userData ? <Customize2 /> : <Navigate to={"/signup"} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
