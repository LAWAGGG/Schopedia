export default function SkeletonCard() {
    const skeletons = Array.from({ length: 15 });

    return (
        <div className="flex flex-wrap gap-4">
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl pb-3 shadow-md overflow-hidden w-43 flex-shrink-0 border border-gray-100 animate-pulse"
                >
                    {/* Gambar skeleton */}
                    <div className="w-full h-32 bg-gray-200" />

                    {/* Isi skeleton */}
                    <div className="p-2 text-center">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-1" />
                        <div className="h-2.5 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                    </div>

                    {/* Tombol skeleton */}
                    <div className="flex justify-center gap-2">
                        <div className="h-5 w-14 bg-gray-300 rounded-lg" />
                        <div className="h-5 w-12 bg-gray-400 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}
