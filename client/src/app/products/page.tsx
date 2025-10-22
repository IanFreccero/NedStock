"use client"

import React, { useEffect, useState } from 'react'
import Header from '../(components)/Header'
import { PlusCircleIcon, SearchIcon } from 'lucide-react'
import { categories } from '../utils/utils'
import axios from 'axios'
import CreateProductModal from './CreateProductModal'
import { useSearchParams, useRouter } from 'next/navigation'

type ProductFormData = {
  name: string
  price: number
  stockQuantity: number
  category: string
}

type productType = {
  _id: string
  name: string
  price: number
  category: string
  stockQuantity: number
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState([])
  const searchParams = useSearchParams()
  const router = useRouter()
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);
  

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || "")
    router.replace("/products/")
  }, [])

    // debounce
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedValue(searchTerm);
      }, 400);
  
      return () => clearTimeout(timeout);
    }, [searchTerm]);

  useEffect(() => {
    searchTerm.length > 0 ?
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search/${debouncedValue}`)
      .then(res => setProducts(res.data))
    : axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/page/1`)
      .then(res => setProducts(res.data.products))
  }, [debouncedValue])

  const handleCreateProduct = (productData: ProductFormData) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, productData)
  }

  return (
    <div className='mx-auto pb-5 w-full'>
      
      <div className='mb-6'>
        <div className='flex items-center border-2 border-neutral-800 bg-black rounded focus-within:border-neutral-700'>
          <SearchIcon className='w-5 h-5 text-neutral-600 m-2' />
          <input className='w-full py-2 px-4 rounded focus:outline-none outline-none border-none' placeholder='Buscar productos...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className='flex justify-between items-center mb-6'>
        <Header name='Productos' />
        <button className='flex items-center bg-orange-500 hover:bg-orange-700 text-gray-200 font-bold py-2 px-4 rounded'
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className='w-5 h-5 mr-2 text-gray-200' />
          Crear un Producto
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between'>
        {products?.map((product: productType) => {
          const imgIndex = categories.indexOf(product.category) + 1;
            
            const imgSrc = imgIndex > 0 && imgIndex <= categories.length
              ? `/categories/${imgIndex}.png`
              : `/categories/13`;
              return (
                <div key={product._id} className='shadow rounded-md p-4 max-w-full w-full mx-auto bg-neutral-800'>
                  <div className='flex flex-col items-center'>
                    <img src={imgSrc}  className='bg-cover aspect-square rounded w-[40%]' />
                    <h3 className='text-lg text-gray-100 font-semibold'>
                      {product.name}
                    </h3>
                    <p className='text-gray-100 '>
                      ${product.price}
                    </p>
                    <div className='text-sm text-gray-100 mt-1'>
                      Stock: {product.stockQuantity}
                    </div>
                    <div className='text-sm text-gray-100 mt-1'>
                      Categoria: {product.category}
                    </div>
                  </div>
                </div>
              )
        }
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateProduct} />

    </div>
  )
}

export default Products
