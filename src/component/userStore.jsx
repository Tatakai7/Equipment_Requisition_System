import { createSignal } from "solid-js";
import { setCookie, getCookie } from "../token/cookieUtils";

const userStore = () => {
  const [user, setUser] = createSignal(null);

  const setUserType = (usertype) => {
    const currentUser = { ...user(), type: usertype };
    setUser(currentUser);
    setCookie("usertype", usertype);
  };

  const setUserID = (emp_id) => {
    const currentUser = { ...user(), emp_id: emp_id };
    setUser(currentUser);
    setCookie("emp_id", emp_id);
  };

  const setAccID = (acc_id) => {
    const currentUser = { ...user(), acc_id: acc_id };
    setUser(currentUser);
    setCookie("acc_id", acc_id);
  };

  const getUser = () => {
    const token = getCookie("token");
    const usertype = getCookie("usertype");
  
    if (token && usertype) {
      return { type: usertype }; // Return an object with type property
    }
  
    return null;
  };

  const getUserID = () => {
    const token = getCookie("token");
    const emp_id = getCookie("emp_id");
    if (token && emp_id) {
      return {emp_id: emp_id};
    }
    return null;
  }

  const getAccID = () => {
    const token = getCookie("token");
    const acc_id = getCookie("acc_id");
    if (token && acc_id) {
      return {acc_id: acc_id};
    }
    return null;
  }
  

  return {
    user,
    setUserType,
    setUserID,
    setAccID,
    getUser,
    getUserID,
    getAccID
  };
};

export default userStore;