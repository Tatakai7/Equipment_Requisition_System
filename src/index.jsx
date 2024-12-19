import { render } from 'solid-js/web';

import './pages/Home.jsx'
import './index.css';
import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root Element not found..'
    )
}

Render(() => <App />, root);