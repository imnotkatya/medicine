const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser'); 
 // For loading environment variables


//  сервер:      194.87.236.48\SQLEXPRESS,60333
// БД           KeitaBD
// логин        sa
// пароль       Gari1964








const app = express();
const port = process.env.PORT || 5003; // Change 5003 to another port, e.g., 5004
//USEFULL INFO!!!!!!!
//npx kill-port 5003
//node demo_db_connection.js
//lsof -i :5003
//kill -9 36922
// Middleware
app.use(cors());
app.use(express.json()); // Обработка JSON запросов
app.use(bodyParser.json());// If you plan to handle JSON requests

// Database configuration
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Gari1964',
  server: process.env.DB_SERVER || '194.87.236.48',
  port: 60333,
  database: process.env.DB_NAME || 'KeitaBD',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Initialize connection pool
let pool;
sql.connect(config).then((connectionPool) => {
  pool = connectionPool;
  console.log('Connected to SQL Server');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Endpoint for getting cases
app.get('/api/cases', async (req, res) => {
    try {
      if (!pool) {
        throw new Error('Нет подключения к базе данных');
      }
      const result = await pool.request().query(`SELECT 
    c.*,
    s.caption AS sex_words
FROM 
    cases c
JOIN 
    sex_list s 
ON 
    c.sex = s.id;
`);
      
      if (result.recordset.length === 0) {
        console.log('Таблица cases пуста');
      } else {
        console.log('Содержимое таблицы cases:', result.recordset);
      }
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });
  

  app.get('/api/clinic_list', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM clinic_list');
     
      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });

app.get('/api/evt_list', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM evt_list');
     
      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });
app.get('/api/region_list', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM region_list');

      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });
app.get('/api/therapy_group', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM therapy_group_list');
      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });

// Endpoint for getting sex list
app.get('/api/sex_list', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM sex_list');
    res.json(result.recordset);
  } catch (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).send('Ошибка при получении данных');
  }
});

app.get('/api/last_added_modify', async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT TOP 1 * FROM cases ORDER BY id_cases DESC');
    
    res.json(result.recordset); // Отправляем результат клиенту
  } catch (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).send('Ошибка при получении данных');
  }
});

app.post('/api/added_modify', async (req, res) => {
  try {
    const { id_cases } = req.body; // Получаем id_cases из тела запроса

    const result = await pool.request()
      .input('idcases', sql.Int, id_cases) // Передаем параметр в запрос
      .query('SELECT * FROM cases WHERE id_cases = @idcases'); // Используем параметр в запросе

    res.json(result.recordset); // Отправляем результат клиенту
  } catch (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).send('Ошибка при получении данных');
  }
});

app.post('/api/user_delete', async (req, res) => {
  try {
    const { caseId } = req.body; // Получаем caseId из тела запроса

    const result = await pool.request()
      .input('caseId', sql.Int, caseId) // Передаем параметр caseId
      .query('DELETE FROM cases WHERE id_cases = @caseId'); // Выполняем DELETE запрос

    res.json({ message: 'Пользователь успешно удален', rowsAffected: result.rowsAffected });
  } catch (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).send('Ошибка при удалении данных');
  }
});



app.get('/api/tod_list', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM tod_list');
      res.json(result.recordset);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      res.status(500).send('Ошибка при получении данных');
    }
  });
  app.post('/api/users', async (req, res) => {
    try {
      const { fio, sexId, regionId } = req.body; // Получение данных из тела запроса
  
      // Выполнение SQL-запроса для вставки данных в таблицу
      const result = await pool.request()
        .input('fio', sql.NVarChar, fio)
        .input('sexId', sql.Int, sexId)
        .input('regionId', sql.Int, regionId)
        .query(`
          INSERT INTO cases (name, sex, region) 
          VALUES (@fio, @sexId, @regionId)
        `);
  
      res.status(201).send('Пользователь успешно добавлен');
    } catch (err) {
      console.error('Ошибка при добавлении пользователя:', err);
      res.status(500).send('Ошибка при добавлении данных');
    }
  });
  

app.post('/api/users_update', async (req, res) => {
  try {
      const {
          caseId,
          fio,
          sexId,
          regionId,
          year,
          phone,
          address,
          history,
      } = req.body;

      // Assign NULL if values are empty or undefined
      const sanitizedInput = {
          caseId,
          fio: fio || null,
          sexId: sexId || null,
          regionId: regionId || null,
          address: address || null,
          year: year ? new Date(year) : null, // Ensure it's a Date object or null
          history: history || null,
          phone: phone || null
      };

      const result = await pool.request()
          .input('caseId', sql.Int, sanitizedInput.caseId)
          .input('fio', sql.NVarChar, sanitizedInput.fio)
          .input('regionId', sql.SmallInt, sanitizedInput.regionId)
          .input('sexId', sql.SmallInt, sanitizedInput.sexId)
          .input('address', sql.NVarChar, sanitizedInput.address)
          .input('year', sql.DateTime, sanitizedInput.year)
          .input('history', sql.NVarChar, sanitizedInput.history)
          .input('phone', sql.NVarChar, sanitizedInput.phone)
          .query(
              `UPDATE cases SET 
              name = @fio, 
              region = @regionId, 
              sex = @sexId, 
              address = @address, 
              birthday = @year,
              telephone = @phone,
              number_history = @history 
              WHERE id_cases = @caseId`
          );

      if (result.rowsAffected[0] === 0) {
          return res.status(404).send('Запись с данным id_cases не найдена');
      }

      res.status(200).send('Запись успешно обновлена');
  } catch (err) {
      console.error('Ошибка при обновлении записи:', err);
      res.status(500).send('Ошибка при обновлении данных');
  }
});

app.post('/api/users_Dia', async (req, res) => {
  try {
      const {
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
          clinicId
      } = req.body;

      // Проверка обязательных полей
    

      // Assign NULL if values are empty or undefined
      const sanitizedInput = {
        id_cases,
          age: age || null,
          diagDate: diagDate ? new Date(diagDate) : null,
          diagnose: diagnose || null,
          tgId: tgId || null,
          evtId: evtId || null,
          evtDate: evtDate ? new Date(evtDate) : null,
          todId: todId || null,
          todDate: todDate ? new Date(todDate) : null,
          catamnesis: catamnesis || null,
          clinicId: clinicId || null
      };

      // Логируем данные перед обновлением
      console.log(sanitizedInput);

      const result = await pool.request()
      .input('idcase', sql.Int, sanitizedInput.id_cases)
          .input('age', sql.Int, sanitizedInput.age)
          .input('diagDate', sql.DateTime, sanitizedInput.diagDate)
          .input('diagnose', sql.NVarChar, sanitizedInput.diagnose)
          .input('tgId', sql.Int, sanitizedInput.tgId)
          .input('evtId', sql.SmallInt, sanitizedInput.evtId)
          .input('evtDate', sql.DateTime, sanitizedInput.evtDate)
          .input('todId', sql.SmallInt, sanitizedInput.todId)
          .input('todDate', sql.DateTime, sanitizedInput.todDate)
          .input('catamnesis', sql.NVarChar, sanitizedInput.catamnesis)
          .input('clinicId', sql.Int, sanitizedInput.clinicId)
          .query(
              'UPDATE cases SET age = @age, diadate = @diagDate, diagnosis = @diagnose, therapy_group = @tgId, evt = @evtId, evtdat = @evtDate, tod = @todId, toddat = @todDate, catamnesis_memo = @catamnesis, clinic = @clinicId WHERE id_cases = @idcase'
          );

      res.status(200).send('Запись успешно обновлена');
  } catch (err) {
      console.error('Ошибка при обновлении записи:', err);
      res.status(500).send('Ошибка при обновлении данных');
  }
});

    // Проверка, обновилась ли запись


  
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.close();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});



