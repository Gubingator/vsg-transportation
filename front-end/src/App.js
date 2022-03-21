import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Lyft from "./pages/Lyft";
import ContactUs from "./pages/ContactUs";
import Vanderbilt from "./pages/Vanderbilt";
import Nashville from "./pages/Nashville";
import HowToUse from "./pages/HowToUse";
import ScheduleCarpool from "./pages/ScheduleCarpool";
import JoinCarpool from "./pages/JoinCarpool";

function App() {
  return (
    <div>
      <div
        style={{
          backgroundColor: "black",
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/lyft" exact element={<Lyft />} />
          <Route path="/contact-us" exact element={<ContactUs />} />
          <Route path="/vanderbilt" exact element={<Vanderbilt />} />
          <Route path="/nashville" exact element={<Nashville />} />
          <Route path="/how-to-use" exact element={<HowToUse />} />
          <Route path="/schedule-carpool" exact element={<ScheduleCarpool />} />
          <Route path="/join-carpool" exact element={<JoinCarpool />} />
          {/* don't use the exact keyword in anything but the / option */}
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
