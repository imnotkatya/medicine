import { useState } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router,Routes, Route} from "react-router-dom";

import PatientTable from './PatientTable.jsx';
import Diagnose from './Diagnose.jsx';
import Valid_field from './valid.jsx'
import Morinfo from './morinfo.jsx'







function App() {
  return (
    <>
     {/* <Weather/> */}

       <Router> {/* Добавляем Routes */}
       <Routes>
            <Route path="/" element={<PatientTable />}></Route>
            <Route path="/valid" element={<Valid_field />}></Route>
            <Route path="/diagnose" element={<Diagnose />}></Route>
            <Route path="/morinfo" element={<Morinfo />}></Route>
            <Route path="/diagnose/:id" element={<Diagnose />} />
            <Route path="/morinfo/:id" element={<Morinfo />} /> {/* Страница Morinfo с параметром id */}
          </Routes>
       </Router>
  
    </>
  )
}

export default App;