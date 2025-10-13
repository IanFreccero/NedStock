"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAppSelector } from "../redux"
import { categories } from "../utils/utils"
import { ArrowDown, ArrowUp } from "lucide-react"


const ListProduct = ({name, prefix, quantity, isRevenue, category}: {name: string, prefix: string, quantity: number, isRevenue: boolean, category: string}) => {
  const imgIndex = categories.indexOf(category) + 1;
  
  // Use a fallback image if the category is not found
  const imgSrc = imgIndex > 0 && imgIndex <= categories.length
    ? `/categories/${imgIndex}.png`
    : `/categories/default.png`;
  return (
    <div>
    <div className="flex items-center text-center justify-between">
      <img src={imgSrc} alt={name} className="size-16 lg:size-12 object-cover bg-neutral-700 rounded-md mb-2 mr-4" />
      <div className="">
      <h4 className="font-bold text-md text-right relative bottom-1">{name}</h4>
      <p className="text-right">{prefix}: <span className="font-bold">{isRevenue ? `$${quantity}` : quantity}</span></p>
      </div>
    </div>
    <div className="border-b border-neutral-700 my-2" />
    </div>
  )
}

const Dashboard = () => {
  const [topSales, setTopSales] = useState([]);
  const [topRevenue, setTopRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  
  useEffect(() => {
    // Fetch top sales data
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product-sales/top-sales`)
      .then(response => {
        setTopSales(response.data);
      })
      .catch(error => {
        console.error("Error fetching top sales data:", error);
      });
      
    // Fetch top revenue data
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product-sales/top-revenue`)
      .then(response => {
        setTopRevenue(response.data);
      })
      .catch(error => {
        console.error("Error fetching top revenue data:", error);
      });
    // Fetch low stock data
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/low-stock`)
      .then(response => {
        console.log(response.data)
        setLowStock(response.data);
      })
      .catch(error => {
        console.error("Error fetching low stock data:", error);
      });
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:flex gap-6 w-100%">
      {/* left side */}
      <div className="flex flex-col gap-6 flex-1">
        {/* sales summary */}
        <div className="bg-neutral-800 rounded-lg p-5 w-full h-64">
          sales summary
        </div>
        {/* low stock */}
        <div className="bg-red-500/5 rounded-lg p-5">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg mb-4">Productos con Bajo Stock</h1>
            <ArrowDown color="#580E0EFF" size={28} />
          </div>
          {lowStock.map((product: any) => (
            <ListProduct key={product.productId || product.name} name={product.name} prefix="Stock" quantity={product.stockQuantity} isRevenue={false} category={product.category} />
          ))}
        </div>
      </div>
      
      {/* right side */}
      <div className="flex flex-1 lg:flex-2 h-fit">
        {/* top sales and top revenue */}
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
            <div className="bg-cyan-600/10 rounded-lg p-5 flex-1">
            <div className="flex justify-between">
              <h1 className="font-bold text-lg mb-4">Productos Mas Vendidos</h1>
              <ArrowUp color="#0E838EFF" size={28} />
            </div>
            {topSales.map((product: any) => (
              <ListProduct key={product.productId} name={product.name} prefix="Ventas" quantity={product.totalCount} isRevenue={false} category={product.category} />
            ))}
            </div>
          <div className="bg-cyan-600/10 rounded-lg p-5 flex-1">
            <div className="flex justify-between">
              <h1 className="font-bold text-lg mb-4">Productos con Mas Ganancias</h1>
              <ArrowUp color="#0E838EFF" size={28} />
            </div>
            {topRevenue.map((product: any) => (
              <ListProduct key={product.productId} name={product.name} prefix="Ingresos" quantity={product.totalRevenue} isRevenue={true} category={product.category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
