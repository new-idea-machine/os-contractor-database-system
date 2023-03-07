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

function App() {
  return (
    <>
      <AuthControl>
        <ContractorContext>
          <Router>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/contractorList" element={<ContractorList />} />
              <Route path="/contractor/:id" element={<ContractorProfile />} />
              <Route path='/myProfile' element={<MyProfile />} />
              <Route path="/UpdateProfile" element={<UpdateProfile />} />
            </Routes>
          </Router>
        </ContractorContext>
      </AuthControl>
      <ToastContainer />
    </>
  );
}

export default App;
