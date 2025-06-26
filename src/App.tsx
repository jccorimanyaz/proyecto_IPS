
// App.tsx
import './styles/dashboard.css';
import Home from './pages/Home'
import {Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRouter from './router/AppRouter';

function App(){
  return (
    <>
    <AppRouter/>
    </>
  );
};

export default App;
