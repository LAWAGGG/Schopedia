// import "./../../styles/dashboard.css";
import { useEffect,useState  } from "react";
import Card from "../../components/cardSeller"
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

        if(data.all_products){
            setProducts(data.all_products);
        }else{
            console.warn("Data tidak ditemukan :",data);
        }
    }
    useEffect(()=>{
        FetchProduct()
    },[]);
    
    return(
        <div className="dashboard">
            <div className="sidebar">
            
            </div>
            <div className="content">
                    {/* card */}
                    {products.length > 0 ?(
                        products.map((products)=>(
                            <Card 
                            key={products.id}
                            image ={products.image}
                            name={products.name}
                            price={products.price}
                            />
                        ))
                    ):(
                        <p>memuat product....</p>
                    )}
                
            </div>
        </div>
    )
}