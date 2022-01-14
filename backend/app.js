const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//Route All Import File
const DepartmentsRoutes = require('./routes/DepartmentRoutes');

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

app.use('/api/departments', DepartmentsRoutes);



app.listen(PORT, () => {
  return console.log(`listening on port ${PORT}`);
});
