import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';

import Donate from "./pages/Donate";
import Admin from "./pages/Admin";
import NoPage from "./pages/NoPage";



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/donate" replace />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<NoPage />} />
      </Routes>
    </Router>
  )
}

export default App