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
import Search from "./components/Search/Search";

function App() {
  return (
    <>
      <AuthControl>
        <SkillsContext>
          <ContractorContext>
            <Router>
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Login />} />
                <Route path="/contractorList" element={<ContractorList />} />
                <Route path="/contractor/:id" element={<ContractorProfile />} />
                <Route path="/myProfile" element={<MyProfile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/UpdateProfile" element={<UpdateProfile />} />
              </Routes>
            </Router>
          </ContractorContext>
        </SkillsContext>
      </AuthControl>
      <ToastContainer />
    </>
  );
}

export default App;
