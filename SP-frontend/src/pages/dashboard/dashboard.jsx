// import "./../../styles/dashboard.css";
import { useEffect, useState } from "react";
import Card from "../../components/card"
import { getToken } from "../../utils/utils";

export default function Dashboard() {
    const [products, setProducts] = useState([])

    async function FetchProduct() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/product`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":`Bearer ${getToken()}`
            },
        });
        const data = await res.json();
        console.log(data);
    }
    useEffect(()=>{
        FetchProduct()
    },[]);
    return(
        <div className="dashboard">
            <div className="sidebar">
                <Card />
            </div>
            <div className="content">

            </div>
        </div>
    )
}