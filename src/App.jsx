import {  lazy } from "solid-js";
import { render } from "solid-js/web";
import { Router, Route, useNavigate } from "@solidjs/router";
import userStore from "./component/userStore";
import { getCookie } from '../src/token/cookieUtils';

const Login = lazy(() => import("./authUI/Login"));
const Logout = lazy(() => import("./authUI/Logout"));

const Admin = lazy(() => import("./pages/adminPage/Admin"));
const Dashboard = lazy(() => import("./pages/adminPage/Dashboard"));
const Employee = lazy(() => import("./pages/adminPage/Employee"));
const Inventory = lazy(() => import("./pages/adminPage/Inventory"));
const Request = lazy(() => import("./pages/adminPage/Request"));
const Report = lazy(() => import("./pages/adminPage/Report"));

const User = lazy(() => import("./pages/userPage/User"));
const Urequest = lazy(() => import("./pages/userPage/request"));
const Utransaction = lazy(() => import("./pages/userPage/transaction"));

const NotFound = lazy(() => import("./pages/notfound"));



const LoginUI = () => ( 
  <Router root={Login}>
    <Route path="/"  />
    <Route path="*" component={Login}/>
  </Router>
)

const AdminPage = () => {
  return (
  <Router root={Admin}>
      <Route path="*" />
      <Route path="/admin"    />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/employee" component={Employee} />
      <Route path="/admin/inventory" component={Inventory} />
      <Route path="/admin/request" component={Request} />
      <Route path="/admin/report" component={Report} /> 
      <Route path="/admin/logout" component={Logout} />
      <Route path='/admin/*404' />
  </Router>
);
}

const UserPage = () => {
  return (
  <Router root={User}>
        <Route path="*" />
        <Route path="/user"/>
        <Route path="/user/request" component={Urequest} />
        <Route path="/user/transaction" component={Utransaction} />
        <Route path="/user/logout" component={Logout} />
        <Route path='/user/*404' />
  </Router>
  );
}

const NotFoundPage = () => {
  return (
    <Router root={NotFound}>
      <Route path="/admin/*404"  />
      <Route path="/user/*404" />
    </Router>
  );
}


const Main = () => {  
  const user = userStore().getUser();
  const token = getCookie('token');

  const a = 'admin';
  const b = 'user';

    if (token && user) {
      if (user.type === a) {
        return <AdminPage />;
        
      } else if (user.type === b) {
        return <UserPage />;

      } else  { 
        return <NotFoundPage />;
      }
    } else {
      return <LoginUI />;
    }

  }

render(() => <Main /> , document.getElementById("root"));