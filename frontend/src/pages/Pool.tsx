import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import '../styles/dashboard.css';
import PoolComponent from "../components/PoolComponent";


const Pool = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Navbar/>
        <main className="content px-3 py-4">
            <PoolComponent/>
        </main> 
      </div>
    </div>
  );
};

export default Pool;
