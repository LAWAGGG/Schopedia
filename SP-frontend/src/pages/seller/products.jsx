// import "./../../styles/dashboard.css";
import { useEffect, useState } from "react";
import Card from "../../components/cardSeller"
import CardSkeletons from "../../components/carsSellerskeleton";
import { getToken } from "../../utils/utils";
import Sidebar from '../../components/sideBar'

export default function Dashboard() {
    const [products, setProducts] = useState([])

    async function FetchProduct() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/product/own`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        });
        const data = await res.json();
        console.log(data);

        if (data.own_product) {
            setProducts(data.own_product);
        } else {
            console.warn("Data tidak ditemukan :", data);
        }
    }
    useEffect(() => {
        FetchProduct()
    }, []);

    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="ml-60">
                <div className="flex flex-wrap gap-4 justify-start ml-8 p-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Card
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                            />
                        ))
                    ) : (
                        <CardSkeletons />
                    )}
                </div>

            </div>
        </div>
    )
}