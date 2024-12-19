  import { getCookie } from '../token/cookieUtils';
import userStore from './userStore';
import NotFound from '../pages/notfound';

const ProtectedRoute = ({ ...props}) => {
  const token = getCookie('token');

  

  const user = userStore().getUser() ;
  if (user && user.type) {
    const adminPaths = [ '/admin', '/admin/dashboard', '/admin/employee', '/admin/inventory', '/admin/request', '/admin/report'];
    const userPaths = ['/user', '/user/request', '/user/transaction'];

    if (user.type === 'user' && adminPaths.includes(window.location.pathname)) {
      window.location.href = '/notfound';
      return null;
    } else if (user.type === 'admin' && userPaths.includes(window.location.pathname)) {
      window.location.href = '/notfound';
      return null;
    }
  }


  return props.children;
};

export default ProtectedRoute;
