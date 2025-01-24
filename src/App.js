import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/app.css";
import {
  Home,
  NotFound,
  UpdateProfile,
  ContractorList,
  MyProfile,
  Auth,
  About,
} from "./pages";

import ContractorProfile from "./components/ContractorProfile/ContractorProfile";
import ChatBox from "./components/Chat/ChatBox";
import AuthControl from "./contexts/Authorization";
import UserProfileContext from "./contexts/UserProfileContext";
import FavouritesContext from "./contexts/FavouritesContext";
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
        <UserProfileContext>
          <FavouritesContext>
            <SkillsContext>
              <MessagesContext>
                <Router>
                  <ScrollToTop>
                    <Routes>
                      <Route path="*" element={<NotFound />} />
                      <Route path="/" element={<Home />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/contractorList" element={<ContractorList />} />
                      <Route path="/contractor/:id"
                        element={ <ProtectedRoute><ContractorProfile /></ProtectedRoute>
                      }/>
                      <Route path="/myProfile" element={<MyProfile />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/UpdateProfile" element={<UpdateProfile />} />
                      <Route path="/About" element={<About />} />
                      <Route path="/inbox" element={<MyMessages/>} />
                      <Route path="/inbox/archived" element={<MyMessages view="archived" />} />
                      <Route path="/inbox/starred" element={<MyMessages view="starred" />} />
                      <Route path="/inbox/deleted" element={<MyMessages view="deleted" />} />
                      <Route path="/forgotPassword" element={<ForgotPassword/>} />
                      <Route path="/favorites" element={<RecruiterFavoriteList/>} />
                    </Routes>
                  </ScrollToTop>
                </Router>
              </MessagesContext>
            </SkillsContext>
          </FavouritesContext>
        </UserProfileContext>
      </AuthControl>
      <ToastContainer />
    </>
  );
}

export default App;
