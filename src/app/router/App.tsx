import Home from "@/page/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        {/* Route mặc định cho trang chủ của khách hàng */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}