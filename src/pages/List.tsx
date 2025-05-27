import ListComponent from "../components/ListComponent";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function List() {
    return(
      <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content px-3 py-4">
          <ListComponent/>
        </main> 
      </div>
    </div>
    );
  }
  
  export default List;