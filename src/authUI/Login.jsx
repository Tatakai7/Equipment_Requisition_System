import { jwtDecode } from "jwt-decode";
import '../assets/style/login.css';
import { createSignal } from 'solid-js';
import userStore from "../component/userStore";
import { useNavigate } from "@solidjs/router";

const Login = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [errorMessage, setErrorMessage] = createSignal('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username() || !password()) {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username(), password: password() }),
            });

            if (response.ok) {
                const { token } = await response.json();
                const decodedToken = jwtDecode(token);

                userStore().setUserType(decodedToken.usertype);
                userStore().setUserID(decodedToken.emp_id);
                userStore().setAccID(decodedToken.acc_id);
                userStore.username = decodedToken.username;
                userStore.usertype = decodedToken.usertype;
                userStore.emp_id = decodedToken.emp_id;
                userStore.acc_id = decodedToken.acc_id;

                const setExpTimeToSec = 10 * 1000;
                const setExpTimeToHour = 1 * 60 * 60 * 1000;
                const setExpTimeToDay = 7 * 24 * 60 * 60 * 1000;

                document.cookie = `token=${token}; expires=${new Date(Date.now() + setExpTimeToDay).toUTCString()};  `;

                if (decodedToken.usertype === 'admin') {
                    window.location.href = "/admin/dashboard";
                } else if (decodedToken.usertype === 'user') {
                    window.location.href = "/user/request";
                } else {
                    setErrorMessage('Invalid user type');
                }

            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred while logging in.');
            }

        } catch (error) {
            setErrorMessage('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div>
            <div class="wrapper">
                <form onSubmit={handleSubmit}>

                    <div class="header">
                        <h1>Login</h1>
                    </div>
                    <div class="input-field">
                        <i class="fa-solid fa-user user"></i>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username()}
                            onInput={(e) => setUsername(e.target.value)}
                            required />
                    </div><br />
                    <div class="input-field">
                        <i class="fa-solid fa-lock lock"></i>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password()}
                            onInput={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div class="forget">
                        <label for="remember">
                            <input type="checkbox" id="remember" />
                            <p>Remember me</p>
                        </label>
                    </div>
                    <div class="white-border">
                        <button type="submit">Login</button>
                        {errorMessage() && <p class="error">{errorMessage()}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
