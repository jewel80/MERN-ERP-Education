const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//Route All Import File
const ActivityRoutes = require('./routes/ActivityRoutes');
const CalendarRoutes = require('./routes/CalendarRoutes');
const CampusRoutes = require('./routes/CampusRoutes');
const DepartmentsRoutes = require('./routes/DepartmentRoutes');
const DeductionsRoutes = require('./routes/DeductionsRoutes');
const DivisionRoutes = require('./routes/DivisionRoutes');
const DormitoriesRoutes = require('./routes/DormitoriesRoutes');

const path = require('path');
//const __dirname = path.resolve(path.dirname(""));

const app = express();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/consumerPhotos'));
app.use(express.static('./public'));

//routes
app.get('/', (req, res) => {
  res.send('welcome to EDU-system ERP api');
});

app.use('/api/activitylog', ActivityRoutes);
app.use('/api/calendar', CalendarRoutes);
app.use('/api/campuses', CampusRoutes);
app.use('/api/departments', DepartmentsRoutes);
app.use('/api/deductions', DeductionsRoutes);
app.use('/api/divisions', DivisionRoutes);
app.use('/api/dormitories', DormitoriesRoutes);



app.listen(PORT, () => {
  return console.log(`listening on port ${PORT}`);
});
