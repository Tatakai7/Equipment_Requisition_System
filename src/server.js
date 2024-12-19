const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { handleLogin } = require('./api/accessControl/login');
const { addEmployee } = require('./api/admin/employees/addemployee');
const { showEmployees } = require('./api/admin/employees/showemployee');
const { addInventory } = require('./api/admin/inventory/addInventory');
const { showInventory } = require('./api/admin/inventory/showInventory');
const { addRequest } = require('./api/user/request/addRequest');
const { showAdminReq } = require('./api/admin/request/showRequest');
const { declineRequest } = require('./api/admin/request/declineRequest');
const { approveRequest } = require('./api/admin/request/approveRequest');
const { updateInventory } = require('./api/admin/inventory/updateInventory');
const { deleteInventory } = require('./api/admin/inventory/deleteInventory');
const { showReport } = require('./api/admin/report/showReport');
const { showTransaction } = require('./api/user/transaction/showTransaction');
const { showAdminNotif } = require('./api/admin/notification/showNotif');
const { showUserNotif } = require('./api/user/notification/showNotif');
const { readNotif } = require('./api/user/notification/readNotif');
const { showUserReq } = require('./api/user/request/showRequest');
const { updateEmployee } = require('./api/admin/employees/updateEmployee');
const { changePass } = require('./api/user/password/changePass');
const { showName } = require('./api/admin/profile/displayName');
const { resetPass } = require('./api/admin/employees/resetpass');
const { removeEmployee } = require('./api/admin/employees/removeEmpployee');
const { showDeptEquipment } = require('./api/admin/dashboard/equipment');
const { totalUsers } = require('./api/admin/dashboard/totalUsers');
const { totalAdmins } = require('./api/admin/dashboard/totalAdmins');
const { totalAccepted } = require('./api/admin/dashboard/totalAccepted');
const { totalDeclined } = require('./api/admin/dashboard/totalDeclined');


const app = express();
const port = process.env.port || 4000;

app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));

app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.post('/login', handleLogin);

//Admin api

//dashboard
app.get('/dashboard', showDeptEquipment);
app.get('/totalUsers', totalUsers);
app.get('/totalAdmins', totalAdmins);
app.get('/totalAccepted', totalAccepted);
app.get('/totalDeclined', totalDeclined);


//employee
app.post('/addemployee', addEmployee);
app.post('/updateemployee', updateEmployee);
app.get('/showemployees', showEmployees);
app.post('/resetpassword', resetPass);
app.post('/removeEmployee', removeEmployee);


//inventory
app.post('/addinventory', addInventory);
app.post('/updateinventory', updateInventory);
app.get('/showinventory', showInventory);
app.post('/deleteinventory', deleteInventory);

//request
app.get('/showrequest', showAdminReq);
app.post('/declinerequest', declineRequest);
app.post('/approverequest', approveRequest);

//report
app.get('/showreport', showReport);

//notification
app.get('/shownotif', showAdminNotif);

//display name
app.post('/getuserfn', showName);


//User api

//request
app.post('/addrequest', addRequest);
app.post('/showuserrequest', showUserReq);

//transaction
app.post('/showtransaction', showTransaction);

//password
app.post('/changepassword', changePass);

//notification
app.post('/showusernotif', showUserNotif);
app.post('/readnotif', readNotif)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})