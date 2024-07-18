import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Noticias from "./pages/Noticias";
import Contatos from "./pages/Contatos";
import Adm from "./pages/Adm";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/adm" element={<Adm />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
