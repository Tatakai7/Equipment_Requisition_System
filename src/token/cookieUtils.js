export const setCookie = (name, value, seconds) => {
    const date = new Date();
    date.setTime(date.getTime() + seconds * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/;`;
  };
  
  export const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return '';
  };
  
  export const deleteCookie = (token) => {
    document.cookie = `token=${token}; expires=${new Date('Thu, 01 Jan 1970 00:00:00 UTC').toUTCString()};`;
  };