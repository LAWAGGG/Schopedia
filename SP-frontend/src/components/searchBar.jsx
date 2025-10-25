import { Search, User } from "lucide-react";
import { getName } from "../utils/utils";
import { useState } from "react";

export default function SearchBar({ onSearch, title }) {
    const [search, setSearch] = useState("");
    const name = getName();

    return (
        <div className="flex flex-col sm:flex-row bg-white rounded-md justify-between items-center shadow-sm p-3 sm:p-4 gap-3 sm:gap-4 w-full">
            <h1 className="hidden sm:block text-lg sm:text-xl font-bold text-left">
                {title}
            </h1>

            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full sm:max-w-[600px]">
                <Search
                    onClick={() => onSearch && onSearch(search)}
                    className="cursor-pointer w-4 h-4 text-gray-500 mr-2"
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

            <div className="hidden sm:flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
    );
}
