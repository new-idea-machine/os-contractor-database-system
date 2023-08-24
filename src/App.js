import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/app.css";
import {
 
  Home,
  NotFound,
  UpdateProfile,
  ContractorList,
  MyProfile,
  Login,
  About,
  
 
} from "./pages";

import ContractorContext from "./contexts/ContractorContext";
import ContractorProfile from "./components/ContractorProfile/ContractorProfile";
import ChatBox from "./components/Chat/ChatBox";
import RecruiterContext from "./contexts/RecruiterContext";
import AuthControl from "./contexts/auth";
import SkillsContext from "./contexts/SkillsContext";
import ScrollToTop from "./ScrollToTop";
import Search from "./components/Search/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import MyMessages from "./pages/MyMessages";
import ForgotPassword from "./pages/ForgotPassword";
import MessagesContext from "./contexts/MessagesContext";
import RecruiterFavoriteList from "./pages/RecruiterFavoriteList";

function App() {
  
  return (
    <>
      <AuthControl>
        <ContractorContext>
          <RecruiterContext>
          <SkillsContext>
          <MessagesContext>
            <Router>
              <ScrollToTop>
                <Routes>
                  <Route path="*" element={<NotFound />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Login />} />
                  <Route path="/contractorList" element={<ContractorList />} />
                  <Route path="/contractor/:id" element={ <ProtectedRoute><ContractorProfile /></ProtectedRoute>
                   }/>
                  <Route path="/myProfile" element={<MyProfile />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/UpdateProfile" element={<UpdateProfile />} />
                  <Route path="/About" element={<About />} />
                  <Route path="/chat/:uid" element={<ChatBox />} />
                  <Route path="/inbox" element={<MyMessages/>} />
                  <Route path="/forgotPassword" element={<ForgotPassword/>} />
                  <Route path="/favorites" element={<RecruiterFavoriteList/>} />
                  
                </Routes>
              </ScrollToTop>
            </Router>
            </MessagesContext>
          </SkillsContext>
          </RecruiterContext>
        </ContractorContext>
      </AuthControl>
      <ToastContainer />
    </>
  );
}

export default App;
