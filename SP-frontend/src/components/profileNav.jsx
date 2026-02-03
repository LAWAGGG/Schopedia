import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { getName } from "../utils/utils";

export default function ProfileNav({title}) {
    const [name, setName] = useState(getName());

    useEffect(() => {
        const handleStorageChange = () => {
            setName(getName());
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-md justify-between items-center shadow-sm p-3 sm:p-4 gap-3 sm:gap-4 w-full">
            <h1 className="hidden sm:block text-lg sm:text-xl font-bold text-left">
                {title}
            </h1>

            <div className="hidden sm:flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
);

}
