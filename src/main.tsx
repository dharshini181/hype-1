import {StrictMode} from 'react';import {createRoot} from 'react-dom/client';import App from './App';import '@fontsource/rubik/latin-500.css';import '@fontsource/rubik/latin-700.css';import '@fontsource/bungee/latin-400.css';import '@fontsource/press-start-2p/latin-400.css';import './index.css';
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
if('serviceWorker' in navigator&&import.meta.env.PROD)window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})});
