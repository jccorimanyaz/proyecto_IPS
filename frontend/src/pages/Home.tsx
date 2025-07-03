import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';
import HomeComponent from '../components/HomeComponent';
const Home = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content px-3 py-4">
            <HomeComponent/>
        </main> 
      </div>
    </div>
  );
};

export default Home;