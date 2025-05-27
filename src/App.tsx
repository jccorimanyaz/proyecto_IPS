/*import Titulo from "./Titulo";
import Card, { CardBody } from "./components/Card";
import List from "./components/List";
function App() {
  const data=["tamjiro", "Comida", "Salado"]
  return (
    <Card>
      <CardBody title={"Titulo 01"} text={"texto numero 01"} />
      <List lista={data}/>
    </Card>
  );
}

export default App;
*/

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
