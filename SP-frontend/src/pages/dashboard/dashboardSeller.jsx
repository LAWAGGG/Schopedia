import "./../../styles/dashboard.css";
import Sidebar from "../../components/sideBar";
import Charts from "../../components/charts";

export default function DashboardSeller() {
    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="ml-60 p-6">
                <div className="seacrhbar">
                    <h1>Dashboard</h1>
                </div>
                <h2 className="text-xl font-bold mb-4">Welcome back <span>anjay</span></h2>
                <div className="menu">
                    <div className="card">

                    </div>
                </div>
                <div className="grapik">
                    <Charts />
                </div>
                <div className="table"> 

                </div>
            </div>
        </div>
    )
}