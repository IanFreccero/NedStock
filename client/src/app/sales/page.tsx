"use client"

import { PlusCircleIcon} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Header from '../(components)/Header';
import axios from 'axios';
import CreateSaleModal from './CreateSaleModal';

const SalesPage = () => {
  const [sales, setSales] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales`)
      .then(res => setSales(res.data))
  }, [])

  return (
    <div className='mx-auto pb-5 w-full'>
      
      <div className='flex justify-between items-center mb-6'>
        <Header name='Ventas' />
        <button className='flex items-center bg-orange-500 hover:bg-orange-700 text-gray-200 font-bold py-2 px-4 rounded'
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className='w-5 h-5 mr-2 text-gray-200' />
          Agregar una Venta
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between'>
        {sales?.map((sale: any) => {
          if(sale.totalAmount > 0) {
            return (
                <div key={sale._id} className='shadow rounded-md p-4 max-w-full w-full mx-auto bg-neutral-800'>
                  <div className='flex flex-col items-start'>
                    <p className='text-lg text-gray-100 font-semibold'>
                      ID:{sale._id}
                    </p>
                    <p className='text-lg text-gray-100 font-semibold'>
                      Productos:
                    </p>
                    {sale.products.map((product: any) => (
                      <div key={product.productId}>
                        <div className='text-sm text-gray-100 mt-1'>
                          ID del producto: {product.productId}
                        </div>
                        <div className='text-sm text-gray-100 mt-1'>
                          Cantidad: {product.quantity}
                        </div>
                        <div className='text-sm text-gray-100 mt-1'>
                          Precio por unidad: ${product.unitPrice}
                        </div>
                        <div className='w-full border-b-[1px] border-neutral-700'/>
                      </div>
                    ))}
                    <p className='text-lg font-semibold text-gray-100'>
                      Total: ${sale.totalAmount}
                    </p>
                  </div>
                </div>
              )
          }
          return ""
        }
        )}

        <CreateSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  )
}

export default SalesPage
