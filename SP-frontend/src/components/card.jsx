export default function Card({ image, name, price }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">{price}</p>
        </div>
    );
}
