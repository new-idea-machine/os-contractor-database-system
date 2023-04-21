import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
} from "./pages";
import ContractorContext from "./contexts/ContractorContext";
import ContractorProfile from "./components/ContractorProfile/ContractorProfile";
import AuthControl from "./contexts/auth";
import SkillsContext from "./contexts/SkillsContext";
import ScrollToTop from "./ScrollToTop";
import SearchQualification from "./components/Search/SearchQualification";
import SearchDevelopers from "./components/Search/SearchDevelopers/SearchDevelopers";
import SearchDesigners from "./components/Search/SearchDesigners/SearchDesigners";
import SearchProjectManagers from "./components/Search/SearchProjectManagers/SearchProjectManagers";
import SearchProductManagers from "./components/Search/SearchProductManagers/SearchProductManagers";

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
                  <Route
                    path="/contractor/:id"
                    element={<ContractorProfile />}
                  />
                  <Route path="/myProfile" element={<MyProfile />} />
                  <Route path="/search" element={<SearchQualification />} />
                  <Route path="/search/developers" element={<SearchDevelopers />} />
                  <Route path="/search/designers" element={<SearchDesigners />} />
                  <Route path="/search/projectmanagers" element={<SearchProjectManagers />} />
                  <Route path="/search/productmanagers" element={<SearchProductManagers />} />
                  <Route path="/UpdateProfile" element={<UpdateProfile />} />
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
