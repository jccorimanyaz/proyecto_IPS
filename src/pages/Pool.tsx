import Navbar from "../components/Navbar";
import PoolComponent from "../components/PoolComponent";
import Sidebar from "../components/Sidebar";

function Pool() {
    return(
      <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content px-3 py-4">
            <PoolComponent />
        </main> 
      </div>
    </div>
    );
  }
  
  export default Pool;