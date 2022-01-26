const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//Route All Import File
const ActivityRoutes = require('./routes/ActivityRoutes');
const AttendanceRoutes = require("./routes/AttendanceRoutes");
const BankingRoutes = require("./routes/BankingRoutes");
const CalendarRoutes = require('./routes/CalendarRoutes');
const CanteenRoutes = require('./routes/CanteenRouter');
const CampusRoutes = require('./routes/CampusRoutes');
const ChatRoutes = require('./routes/ChatRoutes');
const ClassesRoutes = require('./routes/ClassesRoutes');
const CoursesRoutes = require('./routes/CoursesRoutes');
const AcademicYear = require("./routes/CurrentYearRoutes");
const CorrespondanceRoutes = require('./routes/CorrespondanceRoutes');
const DepartmentsRoutes = require('./routes/DepartmentRoutes');
const DeductionsRoutes = require('./routes/DeductionsRoutes');
const DivisionRoutes = require('./routes/DivisionRoutes');
const DormitoriesRoutes = require('./routes/DormitoriesRoutes');
const FilesRoutes = require('./routes/FilesRoutes');
const FeesRoutes = require('./routes/FeesRoutes');
const NonPaymentRoutes = require('./routes/NonBillPaymentRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
// const OptionsRoutes = require('./routes/OptionsRoutes');
const PayrowRoutes = require("./routes/PayrowRoutes");
const PaymentPlanRoutes = require("./routes/PaymentPlanRoutes");
const PrefectsRoutes = require("./routes/PrefectsRoutes");
const UsersRoutes = require("./routes/UsersRoutes");
const SBARoutes = require("./routes/SBARoutes");
const ScholarshipRoutes = require("./routes/ScholarshipRoutes");
const SchoolRoutes = require("./routes/SchoolRoutes");
const SectionRoutes = require("./routes/SectionRoutes");
const StaffPayRoutes = require("./routes/StaffPayRoutes");
const StoreItemsRoutes = require("./routes/StoreItemsRoutes");
const StoreSalesRoutes = require("./routes/StoreSalesRoutes");
const TaskRoutes = require("./routes/TaskRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");



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
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/academicyear", AcademicYear);
app.use("/api/banking", BankingRoutes);
app.use('/api/calendar', CalendarRoutes);
app.use('/api/campuses', CampusRoutes);
app.use('/api/canteen', CanteenRoutes);
app.use('/api/correspondance', CorrespondanceRoutes);
app.use('/api/chats', ChatRoutes);
app.use('/api/classes', ClassesRoutes);
app.use('/api/courses', CoursesRoutes);
app.use('/api/departments', DepartmentsRoutes);
app.use('/api/deductions', DeductionsRoutes);
app.use('/api/divisions', DivisionRoutes);
app.use('/api/dormitories', DormitoriesRoutes);
app.use('/api/notes', FilesRoutes);
app.use('/api/fees', FeesRoutes);
app.use('/api/nonbillpayment', NonPaymentRoutes);
app.use('/api/notification', NotificationRoutes);
// app.use('/api/options', OptionsRoutes);
app.use("/api/payrow", PayrowRoutes);
app.use('/api/paymentplan', PaymentPlanRoutes);
app.use("/api/prefects", PrefectsRoutes);
app.use("/api/users", UsersRoutes);
app.use('/api/sba', SBARoutes);
app.use('/api/scholarships', ScholarshipRoutes);
app.use('/api/school', SchoolRoutes);
app.use('/api/sections', SectionRoutes);
app.use('/api/staffpay', StaffPayRoutes);
app.use("/api/store/items", StoreItemsRoutes);
app.use("/api/store/sales", StoreSalesRoutes);
app.use("/api/tasks", TaskRoutes);
app.use("/api/teachers", TeacherRoutes);


app.listen(PORT, () => {
  return console.log(`listening on port ${PORT}`);
});
