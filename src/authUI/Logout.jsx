import { deleteCookie, getCookie } from "../token/cookieUtils";

export default function handleLogout() {

        const token = getCookie('token');

        if(token){
        deleteCookie('token');
        window.location.href = '/';
        }

}

