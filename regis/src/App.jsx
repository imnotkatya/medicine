import { useState } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router,Routes, Route} from "react-router-dom";

import Diagnose from './Diagnose.jsx';

import Valid_field from './valid.jsx'
import './App.css'

function App() {
  return (
    <>
     {/* <Weather/> */}

       <Router> {/* Добавляем Routes */}
       <Routes>

            <Route path="/" element={<Valid_field />}></Route>
            <Route path="/diagnose" element={<Diagnose />}></Route>
          </Routes>
       </Router>
    
    </>
  )
}

export default App;