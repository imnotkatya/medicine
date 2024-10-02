import { Outlet, Link } from "react-router-dom";
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
const Diagnose = () => {




  return (
    <div>
      
      <Link to="/">Personal Info</Link><br/>
      <Link to="/diagnose">Diagnose</Link>
      <br></br>
    diagnose date
    <input></input>
    <br></br>
    diagnose
    <select>
      <option>OPL</option>
      <option>OML</option>
      <option>XML</option>
      
    </select>
    <br></br>
    Leukocytes  <input></input>
    <br></br>
    <button>Save</button>
    <button>Cancel</button>
     {/* Здесь будет отображаться компонент Valid_field */}
    </div>
  );
}
export default Diagnose;