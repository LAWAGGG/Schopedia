<<<<<<< HEAD
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { getName } from "../utils/utils";

export default function ProfileNav() {
    const [name, setName] = useState(getName());

    useEffect(() => {
        const handleStorageChange = () => {
            setName(getName());
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="shadow-sm ml-2 rounded-sm flex justify-between items-center p-4 w-[969px]">
            <h1 className="text-xl font-bold">Edit Profile</h1>
            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
    );
}
=======
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
        <div className="shadow-sm ml-2 rounded-sm flex justify-between items-center p-4 w-[969px]">
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-3 items-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
                <span className="truncate max-w-[150px] text-gray-700">{name}</span>
            </div>
        </div>
    );
}
>>>>>>> c2d2566b246d87dc6e5b10222e22b255fdf0cd9f
