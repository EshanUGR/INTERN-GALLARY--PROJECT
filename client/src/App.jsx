import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";

import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";

import { ShoppingListProvider } from "./context/ShoppingListContext"; // yumeth-shopping-list
import { Toaster } from "react-hot-toast";




import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

import { useSelector } from "react-redux";


export default function App() {
  
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  const ProtectedRoute = ({ children }) => {
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  if (currentUser && !currentUser.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }


  return children;
};

//Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  if (currentUser && currentUser.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

  
  return (
    <BrowserRouter>
      <ShoppingListProvider>

        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route
            path="/sign-in"
            element={
              <RedirectAuthenticatedUser>
                <SignIn />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/sign-up"
            element={
              <RedirectAuthenticatedUser>
                <SignUp />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

        
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
         
          </Route>

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
        {/* <Route path = "/add-inventory"element={<DashAddInventory/>}/>
        <Route path = "/inventory-list" element={<DashInventory/>}/>
        <Route path="/update-inventory/:id" element={<DashUpdateInventory/>}/>
        <Route path="/update-category/:id" element={<DashUpdateCategory/>}/>
        <Route path = "/add-category"element={<DashAddCategory/>}/> */}

          <Route path="/dashboard" element={<Dashboard />} />
        


        <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        }
      />
        

      </Routes>


        <Toaster />

        <Footer />
      </ShoppingListProvider>
    </BrowserRouter>
  );

}
