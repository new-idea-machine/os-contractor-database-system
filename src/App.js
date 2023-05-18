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
  About
} from "./pages";
import ContractorContext from "./contexts/ContractorContext";
import ContractorProfile from "./components/ContractorProfile/ContractorProfile";
import AuthControl from "./contexts/auth";
import SkillsContext from "./contexts/SkillsContext";
import ScrollToTop from "./ScrollToTop";
import Search from "./components/Search/Search";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  
  return (
    <>
      <AuthControl>
        <ContractorContext>
          <SkillsContext>
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
                </Routes>
              </ScrollToTop>
            </Router>
          </SkillsContext>
        </ContractorContext>
      </AuthControl>
      <ToastContainer />
    </>
  );
}

export default App;
