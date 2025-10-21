<<<<<<< HEAD
import Sidebar from "../../components/sideBar";

export default function Wallet() {
    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="content">

            </div>
        </div>
    )
=======
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
            </div>
        </div>
    )
>>>>>>> c2d2566b246d87dc6e5b10222e22b255fdf0cd9f
}