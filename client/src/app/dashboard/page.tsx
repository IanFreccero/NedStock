"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { categories } from "../utils/utils"
import { ArrowDown, ArrowUp, Car, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


interface SalesSummaryItem {
  _id: string;
  totalSales: number;
  totalRevenue: number;
  month: string;
}

const CardSalesSummary = () => {
  const [salesSummaryData, setSalesSummaryData] = useState<SalesSummaryItem[]>([]);
  const totalValueSum = salesSummaryData.reduce((acc, curr) => acc + curr.totalRevenue, 0) || 0
  useEffect(() => {
     // Fetch sales summary data
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales-summary`)
      .then(response => {
        setSalesSummaryData(response.data.reverse());
      })
  }, [])

  return (
    <div className="bg-neutral-800 rounded-2xl flex flex-col justify-between">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-bold mb-1 px-4 pt-2">
          Ventas del Ultimo Año
        </h2>
        <div className="flex justify-between items-center mb-2 px-7 relative top-2">
          <div className="text-lg font-medium">
            <p className="text-xs text-gray-400 font-bold">Total</p>
            <span className="text-xl font-extrabold ">
            ${(totalValueSum / 1000000).toLocaleString("en", {maximumFractionDigits: 2})}m
            </span>
            <span className="text-green-500 text-sm ml-2">
              <TrendingUp className="inline w-4 h-4 mr-1"/>
            </span>
          </div>
        </div>
      </div>

      <div>
        
        <ResponsiveContainer width="100%" height={250} className="px-7">
              <BarChart
                data={salesSummaryData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    return `${value.slice(2,8)}`;
                  }}
                />
                <YAxis
                  dataKey="totalRevenue"
                  tickFormatter={(value) => {
                    return `$${(value / 1000000).toFixed(0)}m`;
                  }}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  wrapperClassName="rounded-sm text-gray-100"
                  contentStyle={{
                    backgroundColor: "#3F3F3FFF", // gris oscuro
                    borderColor: "#4b5563",
                    color: "#f9fafb", // texto claro
                  }}
                  />
                <Bar
                  dataKey="totalRevenue"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
      </div>
    </div>
  )
}


const ListProduct = ({name, prefix, quantity, isRevenue, category}: {name: string, prefix: string, quantity: number, isRevenue: boolean, category: string}) => {
  const imgIndex = categories.indexOf(category) + 1;
  
  const imgSrc = imgIndex > 0 && imgIndex <= categories.length
    ? `/categories/${imgIndex}.png`
    : `/categories/13`;
  return (
    <div>
    <div className="flex items-center text-center justify-between">
      <img src={imgSrc} alt={name} className="size-16 lg:size-12 object-cover bg-neutral-700 rounded-sm mb-2 mr-4 opacity-90" />
      <div className="">
      <h4 className=" text-sm text-right relative bottom-1">{name}</h4>
      <p className="text-right">{prefix}: <span className={`font-bold ${prefix === 'Stock' ? 'text-red-800' : 'text-cyan-800'}`}>{isRevenue ? `$${quantity}` : quantity}</span></p>
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
        setLowStock(response.data);
      })
      .catch(error => {
        console.error("Error fetching low stock data:", error);
      });
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:flex gap-4 w-100% md:h-[95vh]">
      {/* left side */}
      <div className="flex flex-col gap-6 flex-1 md:h-[95vh]">
        {/* sales summary */}
        <div className="">
          <CardSalesSummary />
        </div>
        {/* low stock */}
        <div className="bg-neutral-800 rounded-lg p-5 flex-1 max-h-[720px] lg:max-h-[450px] overflow-hidden">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg mb-4">Productos con Bajo Stock</h1>
            <ArrowDown color="#580E0EFF" size={28} />
          </div>
          <div className="pr-3 overflow-auto h-[650px] md:h-[90%] scrollbar">
            {lowStock.map((product: any) => (
              <ListProduct key={product.productId || product.name} name={product.name} prefix="Stock" quantity={product.stockQuantity} isRevenue={false} category={product.category} />
            ))}
          </div>
        </div>
      </div>
      
      {/* right side */}
      <div className="flex flex-1 lg:flex-2 md:h-[95vh]">
        {/* top sales and top revenue */}
        <div className="flex flex-col lg:flex-row gap-5 md:gap-2 flex-1">
          <div className="bg-neutral-800 rounded-lg p-5 flex-1 max-h-[720px] md:max-h-[50%] lg:max-h-full overflow-hidden">
            <div className="flex justify-between">
              <h1 className="font-bold text-lg mb-4">Productos Mas Vendidos</h1>
              <ArrowUp color="#0E838EFF" size={28} />
            </div>
             <div className="pr-3 overflow-auto h-[95%] md:h-[85%] lg:h-[95%] scrollbar">
              {topSales.map((product: any) => (
                <ListProduct key={product.productId} name={product.name} prefix="Ventas" quantity={product.totalCount} isRevenue={false} category={product.category} />
              ))}
              </div>
            </div>
          <div className="bg-neutral-800 rounded-lg p-5 flex-1 max-h-[720px] md:max-h-[50%] lg:max-h-full overflow-hidden">
            <div className="flex justify-between">
              <h1 className="font-bold text-lg mb-4">Productos con Mas Ganancias</h1>
              <ArrowUp color="#0E838EFF" size={28} />
            </div>
             <div className="pr-3 overflow-auto h-[95%] md:h-[85%] lg:h-[95%] scrollbar">
              {topRevenue.map((product: any) => (
                <ListProduct key={product.productId} name={product.name} prefix="Ingresos" quantity={product.totalRevenue} isRevenue={true} category={product.category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
