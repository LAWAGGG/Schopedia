import { Search, User  } from 'lucide-react';

export default function SearchBar() {
    function handleSearch() {
        alert("searching...");
    }
    return (
        <div className="flex bg-white rounded-sm justify-between items-center shadow-sm p-4 ">
            <h1 className="text-xl font-bold ">Dashboard</h1>
                <Search onClick={handleSearch} className="absolute ml-38 cursor-pointer w-5 h-5 "/>
            <input 
                type="text"
                className="border border-gray-300 rounded-md py-1 px-9 w-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-2 items-center">
                {/* <img src="" alt="profile" /> */}
                <User />
                <span>Fagih</span>
            </div>
        </div>
    )
}