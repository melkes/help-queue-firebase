import React from "react";
import Header from "./Header";
import TicketControl from "./TicketControl";
import SignIn from "./SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App(){
  return (
    <Router>
      <div className="container">
        <Header />
         <div style={{ margin: '20px 0' }} /> 
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/" element={<TicketControl />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;