import Sidebar from "../../components/sideBar";
import Navbar from '../../components/profileNav';

export default function Wallet() {
    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="ml-66">
                <Navbar title="E-Wallet" />
                <div className="logo">
                    
                </div>
            </div>
        </div>
    )
}