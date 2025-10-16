import Sidebar from "../../components/sideBar";
import ProfileNav from "../../components/profileNav";
import { Pencil } from "lucide-react";

export default function Profile() {
    function handleButton(){
        alert("Edit Photo")
    }
    return (
        <div className="flex min-h-screen ">
            {/* Sidebar */}
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar di atas */}
                <div className="w-full  bg-white">
                    <ProfileNav />
                </div>

                {/* Konten utama */}
                <div className="flex flex-col items-center md:items-start md:px-10 px-4 py-10 w-full">
                    {/* Foto profil */}
                    <div className="relative flex justify-center w-full mb-6">
                        <div className="rounded-full p-1 bg-black shadow-lg">
                            <img
                                className="rounded-full w-40 h-40 object-cover border-4 border-black shadow-md"
                                src="hebat.jpg"
                                alt="profile"
                            />
                        </div>
                        <button
                            onClick={handleButton}
                            className="absolute bottom-2 right-[calc(50%-5rem)] bg-green-500 p-2 rounded-full hover:bg-gray-200 shadow-md transition"
                            title="Edit Photo"
                        >
                            <Pencil className="w-4 h-4 text-white" />
                        </button>
                    </div>


                    {/* Form */}
                    <form className="mt-8 w-full max-w-4xl">
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 text-gray-700">Name</label>
                            <input
                                type="text"
                                className="border border-gray-400 rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="mb-1 text-gray-700">Email</label>
                            <input
                                type="text"
                                className="border border-gray-400 rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label className="mb-1 text-gray-700">Password</label>
                            <input
                                type="password"
                                className="border border-gray-400 rounded-md p-2 w-full"
                            />
                        </div>
                    </form>

                    {/* Tombol */}
                    <div className="flex gap-4 justify-center w-full">
                        <button className="bg-[#8A38F5] text-white px-6 py-2 rounded-md hover:bg-gray-200 hover:text-black transition">
                            Back To Home
                        </button>
                        <button className="bg-[#3C1848] text-white px-6 py-2 rounded-md hover:bg-gray-200 hover:text-black transition">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
