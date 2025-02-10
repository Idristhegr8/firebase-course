import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth></Auth>}></Route>
          <Route path="c_user" element={<Home></Home>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
