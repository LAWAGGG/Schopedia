import { Search, User } from "lucide-react";
import { getName } from "../utils/utils";
import {useState} from 'react'

export default function SearchBar() {
    const [search, setSearch] = useState("");

    const name = getName();

    function handleSearch() {
        alert("searching " + search);
    }

    return (
        <div className="flex bg-white rounded-sm justify-between items-center shadow-sm p-4 gap-4">
            {/* Kiri */}
            <h1 className="text-xl font-bold whitespace-nowrap">Dashboard</h1>

            {/* Tengah: Input dan ikon Search */}
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 flex-grow max-w-[500px]">
                <Search
                    onClick={handleSearch}
                    className="cursor-pointer w-5 h-5 text-gray-500 mr-2"
                />
                <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-grow text-sm focus:outline-none"
                />
            </div>

            {/* Kanan: User Info */}
            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
    );
}
