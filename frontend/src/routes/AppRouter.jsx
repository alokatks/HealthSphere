import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <h2>HealthSphere Frontend Ready</h2>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}