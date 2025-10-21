import { Search, User } from "lucide-react";
import { getName } from "../utils/utils";
import { useState } from "react";

export default function SearchBar({ onSearch,title }) {
    const [search, setSearch] = useState("");
    const name = getName();

    function handleSearch() {
        if (onSearch) onSearch(search);
    }

    return (
        <div className="flex bg-white rounded-sm justify-between items-center shadow-sm p-4 gap-4">
            <h1 className="text-xl font-bold whitespace-nowrap">{title}</h1>

            <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 flex-grow max-w-[500px]">
                <Search
                    onClick={handleSearch}
                    className="cursor-pointer w-5 h-5 text-gray-500 mr-2"
                />
                <input
                    type="text"
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (onSearch) onSearch(e.target.value);
                    }}
                    placeholder="Search..."
                    className="flex-grow text-sm focus:outline-none"
                />
            </div>

            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
    );
}
