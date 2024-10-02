import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, Link } from "react-router-dom";


const valid=()=>
{
const [fio,setFio]=useState("");
const [adress,setAdress]=useState("");
const [year,setYear]=useState(0);
const [problemName,setProblemName]=useState(false);
const [problemYear,setProblemYear]=useState(false);

    const handleFioInput=(e)=>
    {
    setFio(e.target.value)
    }
    const handleYearInput=(e)=>
    {
        setYear(e.target.value)
    }
    const handleAdressInput=(e)=>
        {
            setAdress(e.target.value)
        }
    const Check=()=>
    {
       const pattern=/\d/;
       const answer=pattern.test(fio);
       answer?setProblemName(true):setProblemName(false);


       const pattern2 = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19\d{2}|20[0-4]\d)$/;

       const answer2=pattern2.test(year);
       answer2?setProblemYear(false):setProblemYear(true);
      
      
    }
    const CancelAll=()=>
    {
       setFio("");
       setYear(0);
       setAdress("");
       setProblemName(false);
       setProblemYear(false);
    }

       
          
    
    return(
    <div>
     
     <Link to="/">Personal Info</Link><br/>
     <Link to="/diagnose">Diagnose</Link>
        <h1>Check Fields Validation</h1>
        <input 
        type="text" 
        placeholder='enter your Full name'
        value={fio}
        onChange={handleFioInput}
        />
        <br/>
       <select name="sex" id="sex">
       <option value="undefined">undefined</option>
        <option value="male">male</option>
        <option value="female">female</option>
       </select>
       <br/>
     <input type="enter birth date"  placeholder="dd/mm/yyyy"  onChange={handleYearInput}/>
    <br/>
    <address>
        <h4>adress</h4>
        <textarea value={adress} onChange={handleAdressInput}>

        </textarea>
        <br></br>
    </address>
    {fio!=""&& year!=0? <button onClick={Check}>Save</button>:<></>}
    {fio!=""&& year!=0? <button onClick={CancelAll}>Cancel</button>:<></>}
       { problemName || problemYear?<h1>no</h1> : <h1>its okay</h1>}
    </div>
)
}
export default valid;