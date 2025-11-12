import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Schobot() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const scrollRef = useRef(null);

    const API_KEY = "AIzaSyD24dRI3iP3qn2WdZOoH0kMc21AiWZ0CTE";

    const quickReplies = ["Cara jualan?", "Cek order saya", "Bantuan produk"];

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{ sender: "bot", text: "Ada yang bisa saya bantu?" }]);
        }
    }, [open]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageToBot = async (text) => {
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setLoading(true);

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: `
                                                Kamu adalah Schobot, asisten AI untuk aplikasi e-commerce sederhana bernama Schopedia.
                                                jawab tanpa tanda spesial misal bintang untuk menebalkan teks itu tidak perlu(ini penting).
                                                jangan mengulang pengenalan diri kamu,saat pertama kali aja boleh kalo berkali kali jangan terlalu sering kecuali di tanya lagi
                                                Berikut informasi tentang sistem:
                                                - Nama toko: Schopedia
                                                - Fokus: jual beli produk digital & fisik
                                                - Cara jual: pengguna daftar sebagai seller, tambah produk, pembeli bisa checkout, bayar, dan tracking order.
                                                - Warna tema: ungu
                                                - Tugasmu: bantu pengguna menjelaskan fitur, cara jualan, dan hal umum di luar sistem juga.
                                                -Dibuat oleh:kelompok 1 intek,karllo,erzy,adit sebagai frontend ,faqih sebagai backend dan ladya,andhika sebagai ui/ux designer

                                                User: ${text}
                                        `,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );
            const data = await res.json();
            const textBot =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Maaf, saya tidak bisa menjawab itu.";
            setMessages((prev) => [...prev, { sender: "bot", text: textBot }]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Terjadi kesalahan, coba lagi." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!prompt.trim()) return;
        await sendMessageToBot(prompt);
        setPrompt("");
    };

    const handleQuickReply = async (text) => {
        setShowQuickReplies(false); // hilangkan tombol
        await sendMessageToBot(text); // langsung kirim pesan
    };

    return (
        <>
            {/* Tombol mengambang */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 transition"
            >
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Modal Chat */}
            {open && (
                <div className="fixed bottom-20 right-6 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 py-3 font-semibold flex justify-between items-center">
                        <span>Schobot 🤖</span>
                        <button onClick={() => setOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Area pesan */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100 relative"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg max-w-[80%] text-sm break-words ${msg.sender === "user"
                                    ? "bg-purple-600 text-white self-end ml-auto"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-gray-500 text-sm italic">
                                Schobot sedang mengetik...
                            </div>
                        )}

                        {/* Quick Replies di atas input */}
                        {showQuickReplies && messages.length === 1 && (
                            <div className="absolute bottom-[30px] right-3 flex flex-col gap-2">
                                {quickReplies.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickReply(q)}
                                        className="bg-purple-200 border text-purple-800 px-4 py-2 mt-1 rounded-lg text-sm hover:bg-purple-300 transition w-max shadow-md"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white flex items-center relative">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ketik pesan kamu..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="ml-2 bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-800 transition disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Animasi */}
            <style jsx>{`

            
        .animate-fadeIn {
            animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #a855f7;
            border-radius: 6px;
        }
        `}</style>
        </>
    );
}
