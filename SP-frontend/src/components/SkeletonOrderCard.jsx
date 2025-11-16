export default function SkeletonOrderCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-4">
                {/* Skeleton gambar */}
                <div className="w-16 h-22 bg-gray-200 rounded-lg"></div>

                <div className="flex-1 space-y-2">
                    {/* Nama produk */}
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                    {/* Harga */}
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>

                    {/* Status */}
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>

                    {/* Tanggal */}
                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                </div>

                {/* Arrow icon */}
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
