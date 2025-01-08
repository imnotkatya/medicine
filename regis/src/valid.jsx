import { StrictMode, useState, useEffect } from 'react';
import axios from 'axios';
import './valid.css';
import { Link, useNavigate } from "react-router-dom";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import { v4 as uuidv4 } from 'uuid'
const Valid = () => {
    const [error, setError] = useState(null);
    const [fio, setFio] = useState("");
    const [region, setRegion] = useState([]);
    const [address, setAddress] = useState("");
    const [year, setYear] = useState("");
 
    const [problemName, setProblemName] = useState(false);
    const [problemYear, setProblemYear] = useState(false);
    const [sexList, setSexList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);
    const [historyNum, setHistoryNum] = useState("");
    const [phone, setPhone] = useState("");
    const [sexId, setSexId] = useState('');
    const [caseId, setCaseId] = useState(11);
    const [regionId, setRegionId] = useState('');
    const navigate = useNavigate();

    const handleFioInput = (e) => setFio(e.target.value);
    const handleHistoryInput = (e) => setHistoryNum(e.target.value);
    const handleAddressInput = (e) => setAddress(e.target.value);
    const handlePhoneInput = (e) => setPhone(e.target.value);
    const handleSexChange = (e) => setSexId(e.target.value);
    const handleRegionChange = (e) => setRegionId(e.target.value);

    // const handleYearInput = (e) => {
    //     const inputYear = e.target.value;
    //     setYear(inputYear);
    //     if (inputYear.length === 10) {
            
          
    //     }
    // };

    // const calculateAge = (birthDate) => {
    //     const today = new Date();
    //     const birth = new Date(birthDate);
    //     let age = today.getFullYear() - birth.getFullYear();
    //     const monthDifference = today.getMonth() - birth.getMonth();

    //     if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    //         age--;
    //     }
    //     return age;
    // };

    // Validation check
    // const check = () => {
    //     const namePattern = /\d/;
    //     setProblemName(namePattern.test(fio));
    // };

    // Cancel all inputs
    const cancelAll = () => {
        setFio("");
        setYear("");
        setAddress("");
        setPhone("");
        setProblemName(false);
        setProblemYear(false);
      
    };

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/cases');
                setCases(response.data);
               setFio(response.name)
            } catch (err) {
                setError('Ошибка при получении данных');
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    useEffect(() => {
        const fetchSexList = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/sex_list');
                setSexList(response.data);
                setSexId(1);


            } catch (err) {
                setError('Ошибка при получении данных');
            }
        };
        fetchSexList();
    }, []);

    useEffect(() => {
        const fetchRegion = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/region_list');
                setRegion(response.data);
                setRegionId(1);
            } catch (err) {
                setError('Ошибка при получении данных');
            }
        };
        fetchRegion();
    }, []);

    const isFormValid = () => !problemName && !problemYear && fio && year;

 ;

 const handleSaveAndNavigate = async () => {
    if (window.confirm("Вы уверены, что хотите сохранить данные?")) {
        const data = {
            fio,         // Full name
            sexId,       // Sex ID
            regionId,    // Region ID
        };

        console.log('Data to send:', data);

        try {
            const response = await axios.post('http://localhost:5003/api/users', data);
            console.log('Server response:', response.data);
            navigate('/morinfo');  // Navigate after successful save
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
            alert('Произошла ошибка при сохранении данных. Пожалуйста, попробуйте снова.');
        }
    }
};


    return (
        <div className='all_v'>
            <div className='links_v'>
                {/* <Link to="/diagnose">Diagnose</Link> */}
                <Link to="/">Patients</Link>
               
                <h1>Personal Info</h1>
            </div>
           
            <label htmlFor="name">name{fio}</label>
            <div className='Input'>
            <input 
                className='name'
                type="text" 
                placeholder='Enter your Full name'
                value={fio}
                onChange={handleFioInput}
            />
            {problemName && <p style={{ color: 'red' }}>Name cannot contain numbers.</p>}
            </div>
            <label htmlFor="sex">Sex</label>
            <div className='Input'>
           
            <select name="sex" id="sex" onChange={handleSexChange} value={sexId}>

    {sexList.map(sex => (
        <option key={sex.id} value={sex.id}>
            {sex.caption}
        </option>
    ))}
</select>

            </div>
            <label htmlFor="region">Region</label>
            <div className='Input'>
           
            <select name="region" id="rg" onChange={handleRegionChange} value={regionId}>
           
                {region.map(r => (
                    <option key={r.id} value={r.id}>
                        {r.caption}
                    </option>
                ))}
            </select>
            </div>
{/* 
          

          

           

           */}
<div className='what_to_do'>
            <button 
                type="button" 
                onClick={handleSaveAndNavigate} 
                disabled={loading }
            >
                Add
            </button>

            <button type="button" onClick={cancelAll} disabled={loading}>Cancel</button>
            </div>
        </div>
    );
};

export default Valid;
