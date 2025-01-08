import { useState, useEffect } from 'react';
import axios from 'axios';
import DiaStyle from './Dia.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Diagnose = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_cases = '', patient_name = '' } = location.state || {};

  const [therapygroup, setTherapygroup] = useState([]);
  const [evtList, setEvtList] = useState([]);
  const [todList, setTodList] = useState([]);
  const [clinic, setClinic] = useState([]);

  const [tgId, setTgId] = useState('');
  const [evtId, setEvtId] = useState('');
  const [todId, setTodId] = useState('');
  const [clinicId, setClinicId] = useState('');
  
  const [age, setAge] = useState("");
  const [diagnose, setDiagnose] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [diagDate, setDiagDate] = useState("");
  const [todDate, setTodDate] = useState("");
  const [catamnesis, setCatamnesis] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const handleAgeInput = (e) => setAge(e.target.value);
  const handleDiagnoseInput = (e) => setDiagnose(e.target.value);
  const handleCatamnesisInput = (e) => setCatamnesis(e.target.value);
 
  const handleDiaDateInput = (e) => setDiagDate(e.target.value);
  const handleEvtDateInput = (e) => setEvtDate(e.target.value);
  const handleTodDateInput = (e) => setTodDate(e.target.value);

  const handleClinicChange = (e) => {
    const selectedClinicId = e.target.value;
    setClinicId(selectedClinicId);
    const selectedClinic = clinic.find(cl => cl.id === parseInt(selectedClinicId));
    console.log('Выбран ID клиники:', selectedClinic?.id || 'Неизвестная клиника');
  };

  const handleSaveAndNavigate = async () => {
    console.log(clinicId);
    if (window.confirm("Вы уверены, что хотите сохранить данные?")) {
      const data = {
        id_cases,
        age,
        diagDate,
        diagnose,
        tgId,
        evtId,
        evtDate,
        todId,
        todDate,
        catamnesis,
        clinicId,
      };
      
      try {
        const response = await axios.post('http://localhost:5003/api/users_Dia', data);
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
        alert('Произошла ошибка при сохранении данных. Пожалуйста, попробуйте снова.');
      }
    }
  };

  const ClearAll = () => {
    setAge("");
    setDiagDate("");
    setDiagnose("");
    setEvtDate("");
    setTodDate("");
    setCatamnesis("");
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/cases');
        if (response.data.length > 0) {
          const patient = response.data.find(p => p.id_cases === id_cases);
          
          if (patient) {
            setAge(patient.age);
            setDiagDate(patient.diadate ? patient.diadate.split('T')[0] : "");
            setEvtDate(patient.evtdat ? patient.evtdat.split('T')[0] : "");
            setTodDate(patient.toddat ? patient.toddat.split('T')[0] : "");
            setDiagnose(patient.diagnosis);
            setTgId(patient.therapy_group);
            setEvtId(patient.evt);
            setTodId(patient.tod);
            setCatamnesis(patient.catamnesis_memo);
            setClinicId(patient.clinic);
  
            // Логируем всю информацию о выбранном человеке
            console.log('Информация о пациенте:', {
              id_cases: patient.id_cases,
              patient_name: patient.patient_name,
              age: patient.age,
              diagDate: patient.diadate,
              evtDate: patient.evtdat,
              todDate: patient.toddat,
              diagnose: patient.diagnosis,
              therapyGroupId: patient.therapy_group,
              evtId: patient.evt,
              todId: patient.tod,
              catamnesis: patient.catamnesis_memo,
              clinicId: patient.clinic,
            });
          }
        }
      } catch (err) {
        setError('Ошибка при получении данных');
        console.error('Ошибка при загрузке данных пациента:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [id_cases]);
  

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/clinic_list');
        setClinic(response.data);
        setClinicId(1);
      } catch (err) {
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, []);

  useEffect(() => {
    const fetchTherapy = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/therapy_group');
        setTherapygroup(response.data); 
        setTgId(1);
      } catch (err) {
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapy();
  }, []);

  useEffect(() => {
    const fetchTod = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/tod_list');
        setTodList(response.data); 
        setTodId(1);
      } catch (err) {
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false); 
      }
    };

    fetchTod();
  }, []);

  useEffect(() => {
    const fetchEvt = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/evt_list');
        setEvtList(response.data); 
        setEvtId(1);
      } catch (err) {
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false); 
      }
    };

    fetchEvt();
  }, []);

  const backtoTable = () => {
    navigate('/');
  };

  return (
    <div className={DiaStyle.all}>
      <div className={DiaStyle.links}>
        <Link to="/">Patients</Link>
        <Link to={`/morinfo/${id_cases}`} state={{ id_cases, patient_name }}>Personal Info</Link>
      </div>

      <div className='Name'> 
        Name <h1>{patient_name}</h1>
      </div>

      <div className='Age'>
        <label>Age</label>
        <div className={DiaStyle.Input}>
          <input type='num' value={age} onChange={handleAgeInput} />  
        </div>
      </div>

      <div className='DiaDate'>
        <label>Diagnose Date</label>
        <div className={DiaStyle.Input}>
          <input type='date' value={diagDate} onChange={handleDiaDateInput} />
        </div>
      </div>

      <div className='Diagnosis'>
        <label>Diagnosis</label>
        <div className={DiaStyle.Input}>
          <textarea type="diagnose" placeholder='Enter Diagnosis...' value={diagnose} onChange={handleDiagnoseInput} />
        </div>
      </div>

      <div className='Therapy'>
        <label>Therapy Group</label>
        <div className={DiaStyle.Input}>
          <select value={tgId} onChange={(e) => setTgId(e.target.value)}>
            {therapygroup.map(tg => (
              <option key={tg.id} value={tg.id}>{tg.caption}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='Evt'>
        <label>Evt</label>
        <div className={DiaStyle.Input}>
          <select value={evtId} onChange={(e) => setEvtId(e.target.value)}>
            {evtList.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.caption}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='EvtDate'>
        <label>Evt Date</label>
        <div className={DiaStyle.Input}>
          <input type='date' value={evtDate || ""} onChange={handleEvtDateInput} />
        </div>
      </div>

      <div className='Tod'>
        <label>Tod</label>
        <div className={DiaStyle.Input}>
          <select value={todId} onChange={(e) => setTodId(e.target.value)}>
            {todList.map(tod => (
              <option key={tod.id} value={tod.id}>{tod.caption}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='TodDate'>
        <label>Tod Date</label>
        <div className={DiaStyle.Input}>
          <input type='date' value={todDate || ""} onChange={handleTodDateInput} />
        </div>
      </div>

      <div className='Catamnesis'>
        <label htmlFor="Catamnesis">Catamnesis</label>
        <div className={DiaStyle.Input}>
          <textarea value={catamnesis} onChange={handleCatamnesisInput} placeholder="Enter here..." />
        </div>
      </div>

      <div className='Clinic'>
        <label>Clinic</label>
        <div className={DiaStyle.Input}>
          <select value={clinicId} onChange={handleClinicChange}>
            {clinic.map(cl => (
              <option key={cl.id} value={cl.id}>{cl.caption}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleSaveAndNavigate}>Save</button>
      <button onClick={ClearAll}>Clear All</button>
      <button onClick={backtoTable}>Back</button>
    </div>
  );
};

export default Diagnose;
