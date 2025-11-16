import { Pencil, LogOut, Home, Truck, Wallet, User, Loader2, X, AlertCircle, Check } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const AUTH_TOKEN_KEY = 'ecom_user_token'; 

const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const setToken = (token, isLogin, name) => {
  if (token && isLogin) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (name) {
      localStorage.setItem('ecom_user_name', name); 
    }
    console.log('Token saved via localStorage');
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('ecom_user_name');
    console.log('Token removed (Logout action)');
  }
};

const API_URL = import.meta.env.VITE_API_URL


const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "confirm" }) => {

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-between gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, type, onClose }) => {
  
    if (!message) return null;
    const baseClasses = "fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg flex items-center space-x-3 z-50 transition-all duration-300 ease-out transform";
    const colors = { success: "bg-green-500 text-white", error: "bg-red-600 text-white" };
    const Icon = type === 'success' ? Check : AlertCircle;
    
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`${baseClasses} ${colors[type] || 'bg-blue-500 text-white'}`}>
            <Icon className="w-5 h-5" />
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};


const Sidebarbuyyer = () => {
 
    const location = useLocation(); 

    const SidebarItem = ({ to, icon: Icon, label }) => {
       
        const isActive = location.pathname === to;
        
     
        const activeClasses = "bg-white text-[#713491] font-semibold relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-white before:rounded-r-lg";
        const inactiveClasses = "text-white/80 hover:bg-white/10";

        return (
            <NavLink 
                to={to} 
                className={`flex items-center p-3 my-1 rounded-lg transition-colors ${isActive ? activeClasses : inactiveClasses}`}
            >
                <Icon className="w-5 h-5 mr-4" /> 
                {label}
            </NavLink>
        );
    };

    return (
      
        <div className="fixed inset-y-0 left-0 w-64 bg-[#713491] shadow-2xl p-6 transition-transform duration-300 hidden md:flex flex-col z-30">
            
          
      

            <nav className="flex flex-col space-y-1 flex-grow">
                <SidebarItem to="/dashboard" icon={Home} label="Dashboard" />
                <SidebarItem to="/ordersBuyyer" icon={Truck} label="Orders" />
                <SidebarItem to="/walletBuyyer" icon={Wallet} label="E-Wallet" />
                <SidebarItem to="/profileBuyyer" icon={User} label="Profile" />
            </nav>
        </div>
    );
};


const ProfileNav = ({ title }) => (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    </div>
);


const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#713491]" />
        <p className="mt-2 text-sm font-medium text-gray-600">Loading...</p>
    </div>
);


export default function ProfileBuyyer() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        image: "https://placehold.co/160x160/E0E0E0/BDBDBD?text=?", 
    });
    const [form, setForm] = useState({ name: "", email: "", password: "", imageFile: null });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
  
    const navigate = useNavigate();
    const location = useLocation();
    
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {} });

  
    const closeToast = useCallback(() => setToast({ message: null, type: 'info' }), []);
    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));


    async function handleLogout() {
        setModal({
            isOpen: true,
            title: "Konfirmasi Logout",
            message: "Apakah Anda yakin ingin keluar?",
            onCancel: closeModal,
            onConfirm: async () => {
                closeModal();
                setLoading(true); 
                try {
                    const res = await fetch(`${API_URL}api/logout`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${getToken()}`,
                        }
                    });
                    
                    if (res.ok) {
                        setToken(null, false); 
                        navigate('/'); 
                    } else {
                        const data = await res.json();
                        throw new Error(data.message || "Gagal logout.");
                    }
                } catch (err) {
                    setToast({ message: err.message || "Terjadi kesalahan.", type: 'error' });
                } finally {
                    setLoading(false);
                }
            },
        });
    }

   
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
          
            return;
        }

        async function fetchUser() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}api/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Gagal mengambil data profil.");
                
                const data = await res.json();

                setUser({
                    id: data.id || "",
                    name: data.name || "",
                    email: data.email || "",
                    image: data.image
                
                        ? `${API_URL}${data.image.replace(/^\/?storage\//, "storage/")}`
                        : "https://placehold.co/160x160/713491/ffffff?text=User", 
                });
                setForm(prev => ({ ...prev, name: data.name || "", email: data.email || "" }));

            } catch (err) {
                console.error(err);
                setToast({ message: err.message || "Gagal memuat data profil.", type: 'error' });
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
       
    }, [navigate]); 

   
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { 
             setToast({ message: "Ukuran gambar maks 2MB.", type: 'error' });
             e.target.value = null; 
             return;
        }
        setForm((prev) => ({ ...prev, imageFile: file }));
        setPreview(URL.createObjectURL(file));
    };


    const handleSave = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("id", user.id);
            if (form.name && form.name !== user.name) formData.append("name", form.name);
            if (form.email && form.email !== user.email) formData.append("email", form.email);
            if (form.password) formData.append("password", form.password);
            if (form.imageFile) formData.append("image", form.imageFile);

            const res = await fetch(`${API_URL}api/users/update`, {
                method: "POST",
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUser((prev) => ({
                    ...prev,
                    name: form.name || prev.name,
                    email: form.email || prev.email,
                    image: preview || (data.image ? `${API_URL}${data.image.replace(/^\/?storage\//, "storage/")}` : prev.image),
                }));
                
                setForm((prev) => ({ ...prev, password: "", imageFile: null }));
                setPreview(null);
                setToken(token, true, form.name || user.name); 
                setToast({ message: "Profil berhasil diperbarui!", type: 'success' });

            } else {
                if (data.errors) {
                    const errors = Object.values(data.errors).flat().join(" ");
                    throw new Error(errors);
                } else {
                    throw new Error(data.message || "Gagal memperbarui profil");
                }
            }
        } catch (err) {
            console.error(err);
            setToast({ message: err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

 
    return (
        <div className="flex min-h-screen bg-gray-100 overflow-hidden">
            
            <div className="hidden md:block w-64"> 
                <Sidebarbuyyer />
            </div>

            <main className="flex-1 md:ml-64 flex flex-col pb-20 md:pb-0">
                
                <header className="sticky top-0 w-full bg-white shadow-md z-20">
                    <ProfileNav title="Profile Settings" />
                </header>

                <div className="flex flex-col items-center px-4 md:px-8 py-8 w-full flex-grow relative">
                    
                    {loading && (
                        <div className="absolute inset-0 bg-gray-100/80 flex justify-center items-center z-40">
                            <LoadingScreen />
                        </div>
                    )}

                    <div className="w-full max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl relative">
                        
                        {saving && (
                            <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-xl">
                                <LoadingScreen />
                            </div>
                        )}
                        
                        <div className="relative flex justify-center w-full mb-8">
                            <div className="rounded-full bg-white shadow-2xl p-1 md:p-2 transition-all duration-300 transform hover:scale-[1.02] border border-gray-200">
                                <img
                                    className="rounded-full w-32 h-32 md:w-36 md:h-36 object-cover border-4 border-[#713491] shadow-inner"
                                    src={preview || user.image}
                                    alt="profile"
                                    onError={(e) => (e.target.src = "https://placehold.co/160x160/f87171/ffffff?text=X")}
                                />
                            </div>
                            <label
                                htmlFor="imageUpload"
                                className="absolute right-1/2 translate-x-1/2 bottom-0.5 md:bottom-2 -mr-16 md:-mr-20 bg-[#713491] p-2 rounded-full hover:bg-[#5a2a75] shadow-lg cursor-pointer transition-colors duration-200"
                                title="Edit Photo"
                            >
                                <Pencil className="w-4 h-4 text-white" />
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        
                        <form onSubmit={handleSave} className="w-full space-y-6">
                            
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                  
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#713491] focus:border-[#713491] outline-none transition-colors placeholder:text-gray-400"
                                    placeholder="Masukkan nama baru"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Saat ini: <span className="font-medium text-gray-800">{user.name}</span></p>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                  
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#713491] focus:border-[#713491] outline-none transition-colors placeholder:text-gray-400"
                                    placeholder="Masukkan email baru"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Saat ini: <span className="font-medium text-gray-800">{user.email}</span></p>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">Password Baru</label>
                                <input
                                    type="password"
                                    placeholder="Isi hanya jika ingin mengganti password"
                                  
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#713491] focus:border-[#713491] outline-none transition-colors placeholder:text-gray-400"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full sm:w-auto bg-red-500 flex gap-2 items-center justify-center text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md font-semibold"
                                    disabled={saving || loading}
                                >
                                    <LogOut className="w-5 h-5" />
                                    Log out
                                </button>
                                <button
                                    type="submit"
                                  
                                    className="w-full sm:w-auto bg-[#713491] text-white px-8 py-3 rounded-xl hover:bg-[#5a2a75] transition-all shadow-lg font-semibold transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                    disabled={saving || loading}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* 3. Bottom Nav Mobile (Fixed + Styled) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] flex justify-around items-center h-16 md:hidden z-30 p-2 border-t border-gray-200">
                {
                    [
                        { to: "/dashboard", icon: Home, label: "Dashboard" },
                        { to: "/ordersBuyyer", icon: Truck, label: "Orders" },
                        { to: "/walletBuyyer", icon: Wallet, label: "Wallet" },
                        { to: "/profileBuyyer", icon: User, label: "Profile" }
                    ].map(({ to, icon: Icon, label }) => (
                        <button 
                            key={to}
                            onClick={() => navigate(to)} 
                          
                          
                            className={`flex flex-col items-center p-1 rounded-lg transition-colors ${location.pathname === to ? "text-[#713491] font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Icon size={22} />
                            <span className="text-xs mt-1">{label}</span>
                        </button>
                    ))
                }
            </div>

            {/* 4. Notifikasi */}
            <Modal 
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
                onCancel={modal.onCancel}
            />
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={closeToast} 
            />
        </div>
    );
}
