import "./../../styles/dashboardseller.css";
import Sidebar from "../../components/sideBar";
import Charts from "../../components/charts";
import SearchBar from "../../components/searchBar";
import { Wallet, PackageSearch, ShoppingCart, Boxes ,} from 'lucide-react';

export default function DashboardSeller() {
    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="ml-60 px-6 pb-6">

                <div className="mb-15">
                    <SearchBar />
                </div>

                <h2 className="text-xl font-bold mb-15">Welcome back ,<span>anjay</span></h2>

                <div className="menu  mb-15 ">
                    <div className="flex flex-wrap gap-6 justify-between">

                        {/* Saldo */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <Wallet className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Saldo</h3>
                                <h1 className="font-bold text-lg">Rp.156.111.203</h1>
                            </div>
                        </div>

                        {/* Total Products */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <PackageSearch className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Total Products</h3>
                                <h1 className="font-bold text-lg">36</h1>
                            </div>
                        </div>

                        {/* Total Sold */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Total Sold</h3>
                                <h1 className="font-bold text-lg">180</h1>
                            </div>
                        </div>

                        {/* Stock Left */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <Boxes className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Stock Left</h3>
                                <h1 className="font-bold text-lg">25</h1>
                            </div>
                        </div>

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