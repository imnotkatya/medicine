import { useState, useEffect } from 'react';
import axios from 'axios';
import './morinfo.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Morinfo = () => {
    const location = useLocation();
    const { id_cases } = location.state || {};
    const [error, setError] = useState(null);
    const [info, setInfo] = useState([]);
    const [fio, setFio] = useState("");
    const [region, setRegion] = useState([]);
    const [address, setAddress] = useState("");
    const [year, setYear] = useState("");
    const [sexList, setSexList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyNum, setHistoryNum] = useState("");
    const [phone, setPhone] = useState("");
    const [sexId, setSexId] = useState('');
    const [caseId, setCaseId] = useState('');
    const [regionId, setRegionId] = useState('');

    const navigate = useNavigate();

    // Обработчики ввода
    const handleFioInput = (e) => setFio(e.target.value);
    const handleHistoryInput = (e) => setHistoryNum(e.target.value);
    const handleAddressInput = (e) => setAddress(e.target.value);
    const handlePhoneInput = (e) => setPhone(e.target.value);
    const handleSexChange = (e) => setSexId(e.target.value);
    const handleRegionChange = (e) => setRegionId(e.target.value);
    const handleYearInput = (e) => setYear(e.target.value);

    // Получение данных пациента по id_cases
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (id_cases) {
                    const data = { id_cases };
                    const response = await axios.post('http://localhost:5003/api/added_modify', data);
                    setInfo(response.data);
                    if (response.data.length > 0) {
                        const patient = response.data[0];
                        setFio(patient.name);
                        setCaseId(patient.id_cases);
                        setRegionId(patient.region);
                        setSexId(patient.sex);
                        setAddress(patient.address);
                        setYear(patient.birthday);
                        setHistoryNum(patient.number_history);
                        setPhone(patient.telephone);
                    }
                } else {
                    const response = await axios.get('http://localhost:5003/api/last_added_modify');
                    setInfo(response.data);
                    if (response.data.length > 0) {
                        const patient = response.data[0];
                        setFio(patient.name);
                        setCaseId(patient.id_cases);
                        setRegionId(patient.region);
                        setSexId(patient.sex);
                        setAddress(patient.address);
                        setYear(patient.birthday ? patient.birthday.split('T')[0] : "");
                        setHistoryNum(patient.number_history);
                        setPhone(patient.telephone);
                    }
                }
                
            } catch (err) {
                setError('Ошибка при получении данных');
            }
        };
        fetchInfo();
    }, [id_cases]);

    // Получение списка регионов
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

    // Получение списка полов
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

    const backtoTable = () => {
        navigate('/');
    }

    // Сохранение данных и переход
    const handleSaveAndNavigate = async () => {
        if (window.confirm("Вы уверены, что хотите сохранить данные?")) {
            const data = {
                caseId,   // Передаем caseId
                fio,
                sexId,
                regionId,
                year,
                phone,
                address,
                history: historyNum
            };
    
            console.log("Данные для отправки:", data);  // Логируем данные
    
            try {
                const response = await axios.post('http://localhost:5003/api/users_update', data);
                console.log('Server response:', response.data);
                // navigate('/morinfo'); // Переход после успешного сохранения
            } catch (error) {
                console.error('Ошибка при сохранении данных:', error.response?.data || error.message);
                alert(`Произошла ошибка при сохранении данных. Ошибка: ${error.response?.data?.message || error.message}`);
            }
        }
    };
    
    const handleDelete = async () => {
        const adminPassword = prompt("Введите пароль администратора для подтверждения удаления:");
      
        if (adminPassword !== "1111") {
          alert("Неверный пароль!");
          return;
        }
      
        if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
          try {
            const response = await axios.post('http://localhost:5003/api/user_delete', { caseId, adminPassword });
            console.log('Server response:', response.data);
      
            if (response.data.message) {
              alert(response.data.message);
              navigate('/'); // Возвращаемся к таблице после успешного удаления
            }
          } catch (error) {
            console.error('Ошибка при удалении данных:', error.response?.data || error.message);
            alert('Произошла ошибка при удалении данных. Пожалуйста, попробуйте снова.');
          }
        }
      };
      
    useEffect(() => {
        console.log("Текущие данные пользователя:", {
            fio,
            caseId,
            sexId,
            regionId,
            year,
            phone,
            address,
            historyNum,
        });
    }, [fio, caseId, sexId, regionId, year, phone, address, historyNum]);
    
    const handleDiagnoseRedirection = () => {
        navigate(`/diagnose/${caseId}`, { state: { id_cases: caseId, patient_name: fio } });
    };
   
    return (
        <div>
            {error ? (
                <div>{error}</div>
            ) : (
                <div className='all_m'>
                    <h1>Редактирование/Заполнение:</h1>
                    {info.length > 0 ? (
                        <div>
                            <label htmlFor="name">Name</label>
                            <div className='Input'>
                                <input
                                    type='text'
                                    value={fio}
                                    onChange={handleFioInput}
                                />
                            </div>
                            <div>
                                <label htmlFor="region">Region</label>
                                <div className='Input'>
                                    <select 
                                        name="region" 
                                        id="rg" 
                                        onChange={handleRegionChange} 
                                        value={regionId}
                                    >
                                        <option value="">-- Select a Region --</option>
                                        {region.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.caption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="sex">Sex</label>
                                <div className='Input'>
                                    <select 
                                        name="sex" 
                                        id="sex" 
                                        onChange={handleSexChange} 
                                        value={sexId}
                                    >
                                        {sexList.map(sex => (
                                            <option key={sex.id} value={sex.id}>
                                                {sex.caption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="address">Address</label>
                                <div className='Input'>
                                    <textarea 
                                        className='address'
                                        value={address} 
                                        onChange={handleAddressInput}
                                        placeholder="Enter your address here..."
                                    ></textarea>
                                 </div>
                            </div>
                            <div>
                                <label htmlFor="birth">Birth date</label>
                                <div className='Input'>
                                    <input 
                                        className='birth'
                                        type="date" 
                                        value={year ? new Date(year).toISOString().split('T')[0] : ""}
                                        onChange={handleYearInput}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="nh">Number history</label> 
                                <div className='Input'>
                                    <input 
                                        type="text" 
                                        value={historyNum}
                                        onChange={handleHistoryInput}
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Phone number</label>
                                <div className='Input'>
                                    <input 
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneInput}
                                    />
                                 </div>
                            </div>
                        </div>
                    ) : (
                        <p>Нет данных для отображения.</p>
                    )}
                    <div className='what_to_do'>
                        <button onClick={handleSaveAndNavigate} type="button">
                            Save Changes
                        </button>
                        <button onClick={handleDiagnoseRedirection} type="button">
                            Diagnose
                        </button>
                        <button onClick={backtoTable}> Back to Table</button>
                        <button onClick={handleDelete} type="button">
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Morinfo;
