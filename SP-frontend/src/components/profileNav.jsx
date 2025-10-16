import { User } from 'lucide-react';


export default function ProfileNav() {
    return (
        <div className="shadow-sm rounded-sm flex justify-between items-center p-4 w-[985px]">
            <h1 className="text-xl font-bold ">Edit Profile</h1>
            <div className="flex gap-2 border border-gray-300 rounded-2xl py-1 px-2 items-center">
                <User />
                <span>Fagih</span>
            </div>
        </div>
    )

}