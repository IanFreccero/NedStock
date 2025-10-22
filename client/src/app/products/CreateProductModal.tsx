import React, { ChangeEvent, FormEvent, useState } from 'react'
import Header from '../(components)/Header'

type ProductFormData = {
  name: string
  price: number
  stockQuantity: number
  category: string
}

type CreateProductModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreate: (FormData: ProductFormData) => void
}

const CreateProductModal = ({ isOpen, onClose, onCreate, } : CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stockQuantity: 0,
    category: ""
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(formData.category === "" || formData.name === "" || formData.price === 0) {
      onCreate(formData)
      onClose()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]:
        name==="price" || name=== "stockQuantity" || name === "rating"
        ? parseFloat(value) : value
    })
  }

  const labelCssStyles = 'block text-sm font-medium text-gray-100'
  const inputCssStyles = 'block w-full mb-2 p-2 border-neutral-700 border-2 rounded-md'

  return isOpen && (
    <div className='fixed inset-0 bg-neutral-600/50 overflow-y-auto h-full w-full z-20'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-neutral-800'>
        <Header name='Crear Un Producto'/>
        <form onSubmit={handleSubmit} className='mt-5'>
          <label htmlFor='productName' className={labelCssStyles}>
            Nombre del Producto
          </label>
          <input type='text' name='name' placeholder='Nombre'
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          <label htmlFor='productPrice' className={labelCssStyles}>
            Precio
          </label>
          <input type='number' name='price' placeholder='Precio'
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          <label htmlFor='productStock' className={labelCssStyles}>
            Cantidad en stock
          </label>
          <input type='number' name='stockQuantity' placeholder='Stock'
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />
          <select value={formData.category} onChange={handleChange} name='category'
            className={inputCssStyles}>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Cosmética-Facial</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Cosmética-Corporal</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Coloración-y-Tintura</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Uñas-y-Manos</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Perfumería</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Instrumental-de-Peluquería</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Cuidado-Personal</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Higiene-Bucal</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Pañales</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Servilletas</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Bebés</option>
            <option className='bg-neutral-800 outline-none border-none text-gray-100'>Otros</option>
          </select>
          
          <button type='submit' className='px-4 py-2 bg-orange-500 text-gray-100 rounded hover:bg-orange-700'>
            Crear Producto
          </button>
          <button type='button' className='ml-2 px-4 py-2 bg-neutral-700 text-gray-100 rounded hover:bg-neutral-600' onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal
