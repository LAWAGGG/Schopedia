import "../../styles/Register.css";

export default function Register() {
    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] min-h-screen md:h-screen md:overflow-hidden">
            {/* Kiri */}
            <div className="flex items-center justify-center w-full md:w-1/2 p-6 md:p-0 md:h-full">
                <img 
                    src="hape.png" 
                    alt="Shopping Illustration"
                    className="max-w-[300px] sm:max-w-[350px] md:max-w-[450px] w-full h-auto my-[20px] md:my-[60px] md:mx-[100px] animate-float" 
                />
            </div>

            {/* Kanan */}
            <div className="flex flex-col items-center gap-5 bg-white w-full md:w-1/2 rounded-t-[20px] md:rounded-none md:rounded-l-[20px] overflow-visible md:overflow-y-auto p-6 sm:p-8 md:p-10">
                
                {/* Logo */}
                <div className="flex justify-center">
                    <img 
                        src="Schopediagg.png" 
                        alt="Schopedia Logo" 
                        className="max-w-[180px] sm:max-w-[220px] md:max-w-[250px] mt-5" 
                    />
                </div>

                {/* Form */}
                <div className="flex flex-col items-center w-full max-w-[450px]">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Username</label>
                        <input 
                            type="text" 
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full" 
                            placeholder="Enter your username" 
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Email</label>
                        <input 
                            type="email" 
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full" 
                            placeholder="Enter your email" 
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Password</label>
                        <input 
                            type="password" 
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full" 
                            placeholder="Enter your password" 
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Confirm Password</label>
                        <input 
                            type="password" 
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full" 
                            placeholder="Confirm your password" 
                        />
                    </div>

                    <p className="terms text-gray-400 text-xs sm:text-sm text-center md:text-left max-w-[450px] mt-3 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a className="underline text-black" href="#">Terms of Service</a> and{" "}
                        <a className="underline text-black" href="#">Privacy Policy</a>.
                    </p>

                    <button 
                        className="w-full h-[40px] bg-[#713491] text-white rounded-md text-[16px] 
                        transition-all duration-300 hover:shadow-md active:scale-[0.98] mt-5 mb-6"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
