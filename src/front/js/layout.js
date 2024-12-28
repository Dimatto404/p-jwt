import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Login from "./pages/login";
import Signup from "./component/signup";
import injectContext from "./store/appContext";
import Private from "./newVisual/private";
import { Context } from "../js/store/appContext";
import LoginPost from "./pages/loginPost";

const Layout = () => {
  const { store } = useContext(Context);

  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Routes>
            {
              !store.token ?
                <>
                  <Route element={<Login />} path="/" />
                  <Route element={<Signup />} path="/signup" />
                  <Route element={<LoginPost />} path="loginpostregister" />
                  <Route element={<Navigate to="/" replace />} path="*" />
                </> :
                <Route element={<Private />} >
                  <Route element={<h1></h1>} path="*" />
                </Route>
            }
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);