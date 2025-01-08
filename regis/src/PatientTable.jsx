import { useState, useEffect } from 'react';
import axios from 'axios';
import PTS from './PatientTable.module.css';
import { useNavigate, Link } from 'react-router-dom';

// Компонент для отображения информации о пациенте в строке таблицы
const PatientItem = ({ patient }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Patient Name:', patient.name); // Для проверки

    navigate(`/morinfo/${patient.id_cases}`, { 
      state: { 
        id_cases: patient.id_cases, 
        patient_name: patient.name,
      } 
    });
  };

  return (
    <tr onClick={handleClick} className={PTS.PatientItem}>
      <td>{patient.id_cases}</td>
      <td>{patient.name}</td>
      <td>{patient.birthday ? new Date(patient.birthday).toLocaleDateString() : 'no info'}</td>
      <td>{patient.sex_words}</td>
      <td>{patient.age !== undefined && patient.age !== null ? patient.age : 'no info'      }</td>
      <td>{patient.diadate ? new Date(patient.diadate).toLocaleDateString() : 'no info'}</td>
    </tr>
  );
};

const PatientTable = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [haverequest, setHaveRequest] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null); // null: no sort, 'alphabet': by name, 'birthday': by date

  const handleSearchInput = (e) => setSearch(e.target.value);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/cases');
        setCases(response.data);
      } catch (err) {
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const searchStart = () => {
    setHaveRequest(true);
  };

  const handleSort = (type) => {
    setSort(type === sort ? null : type); // Переключение между сортировками и отключение
  };
  const filteredCases = haverequest
  ? cases.filter(patient => {
      if (!isNaN(search)) {
        // Если введены только цифры, ищем точное совпадение по ID
        return patient.id_cases.toString() === search;
      } else if (search.includes('.')) {
        // Если ввод содержит точку, ищем совпадения по части даты
        const formattedSearch = search.toLowerCase();
        return (
          new Date(patient.birthday).toLocaleDateString().startsWith(formattedSearch) ||
          new Date(patient.diadate).toLocaleDateString().startsWith(formattedSearch)
        );
      } else {
        // Если ввод — текст, ищем совпадение любого слова (независимо от регистра)
        return patient.name.toLowerCase().includes(search.toLowerCase());
      }
    })
  : cases;


  // Сортировка в зависимости от выбранного типа
  const sortedCases = sort
    ? [...filteredCases].sort((a, b) =>
        sort === 'alphabet'
          ? a.name.localeCompare(b.name)
          : new Date(a.birthday) - new Date(b.birthday)
      )
    : filteredCases;

  return (
    <div className={PTS.all}>
      <header>
        <div className={PTS.links_s}>
          <Link to="/valid">Add patient</Link>
        </div>

        <div className={PTS.dropdown}>
          <button className={PTS.SortBut}>Sort</button>
          <div className={PTS.content}>
            <button onClick={() => handleSort('alphabet')}>по алфавиту</button>
            <button onClick={() => handleSort('birthday')}>по дате рождения</button>
          </div>
        </div>

        <div className={PTS.search}>
          <input 
            value={search}
            onChange={handleSearchInput}
            onKeyPress={(event) => {
              if (event.key === 'Enter' || event.key === 'return') {
                searchStart();
              }
            }}
            placeholder="Enter to find"
            type="search" 
          />
        </div>
      </header>
      
      <div className={PTS.all_data_table}>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && sortedCases.length > 0 ? (
          <table style={{ minWidth: '50rem' }} className={PTS.table_pat}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Birthday</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Diadate</th>
              </tr>
            </thead>
            <tbody>
              {sortedCases.map(patient => (
                <PatientItem key={patient.id_cases} patient={patient} />
              ))}
            </tbody>
          </table>
        ) : !loading && <p>No data available.</p>}
      </div>
    </div>
  );
};

export default PatientTable;
