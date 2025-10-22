import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Header from '../(components)/Header'
import { Minus, Plus, PlusCircle, SearchIcon, Trash2Icon } from 'lucide-react'
import axios from 'axios'

type productType = {
  _id: string
  name: string
  price: number
  category: string
  stockQuantity: number
}

const RigthSelector = ({formData, setFormData}: {formData: any, setFormData: Function}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  const handleAddProduct = ({product, e}: {product: productType, e: any}) => {
    e.preventDefault()
    const newProduct = {
      _id: product._id,
      name: product.name,
      unitPrice: product.price,
      quantity: 1
    }
    
    const isAlreadyAdded = formData.some((item: productType) => item._id === newProduct._id); 

      if(!isAlreadyAdded) {
      setFormData((prev: any) => [...prev, newProduct]
      )
    } else {
      setFormData((prev: any) =>
        prev.map((item: any) => 
        item._id === newProduct._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
      )
    }
  }

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

  return (
    <div className='ml-6 flex-1'>
      <div className='flex mb-2 items-center border-2 border-neutral-800 bg-black rounded focus-within:border-neutral-700'>
        <SearchIcon className='w-5 h-5 text-neutral-600 m-2' />
        <input className='w-full py-2 px-4 rounded focus:outline-none outline-none border-none' placeholder='Buscar productos...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className='w-full overflow-auto scrollbar rounded-md h-[28vh] max-h-[28vh] lg:h-[60vh] lg:max-h-[60vh]'>
        {products.map((product: productType) => {
          return (
            <div key={product._id} className='w-full flex items-center justify-between p-3 border-b-[1px] border-b-neutral-700'>
              <div className='w-[80%]'>
                <p className='text-nowrap text-ellipsis overflow-hidden'>
                  {product.name}
                </p>
                <p className=''>
                  Precio: <span className='font-semibold'>${product.price}</span>
                </p>
                <p className=''>
                  Stock: {product.stockQuantity}
                </p>
              </div>

              <button className='rounded-md bg-orange-500 hover:bg-orange-700 p-1'
                onClick={(e) => handleAddProduct({product, e})}
              >
                <PlusCircle className='size-5'/>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CreateSaleModal = ({ isOpen, onClose, onCreate} : any) => {
  const [formData, setFormData] = useState<productType[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(formData?.length > 0) {
      onCreate(formData) 
      onClose()
    } 
  }

  const handlePlusQuantity = (e: any, id: string) => {
    e.preventDefault();
    setFormData((prev: any) =>
      prev?.map((item: any) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  };


  
  const handleMinusQuantity = (e: any, id: string) => {
    e.preventDefault();
    setFormData((prev: any) =>
      prev.map((item: any) =>
        item._id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, id: string) => {
    const {name, value} = e.target
    setFormData((prevFormData: any) =>
      prevFormData.map((item: any) =>
        item._id === id
          ? {
              ...item,
              [name]:
                name === "unitPrice" || name === "stockQuantity" || name === "rating"
                  ? parseFloat(value)
                  : value,
            }
          : item
    )
    );
  }

  const handleDelete = (e: any, id: string) => {
    e.preventDefault()
    setFormData(prev => prev.filter((item: any) => item._id !== id));
  }

  const handleCreateSale = () => {
    if(formData.length == 0) return
    const body = {
      products: formData.map(({ name, _id, ...rest }) => ({
      ...rest,
      productId: _id
    }))
    }
    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales`, body)
    setFormData([])
    onClose()
  }

  const labelCssStyles = 'block text-sm font-medium text-gray-100'
  const inputCssStyles = 'block w-full mb-2 p-2 border-neutral-700 border-2 rounded-md'

  return isOpen && (
    <div className='fixed inset-0 bg-neutral-600/50 overflow-y-auto h-full w-full z-20'>
      <div className='relative top-20 mx-auto p-5 border w-[70vw] shadow-lg rounded-lg bg-neutral-800 flex flex-col-reverse lg:flex-row'>
        <div className='flex-1 lg:border-r-[1px] lg:border-r-neutral-700'>
          <Header name='Agregar una Venta' />
          <form onSubmit={handleSubmit} className='mt-5 h-[28vh] max-h-[28vh] lg:h-[60vh] lg:max-h-[60vh] overflow-auto scrollbar'>
            {formData?.map((product: any) => {
              return (
                <div key={product._id} className='w-full p-2 flex h-17 items-center justify-between border-b-[1px] border-b-neutral-700'>
                  <div className='w-[50%] md:w-[70%]'>
                    <p className='text-nowrap text-ellipsis overflow-hidden'>
                      {product.name}
                    </p>
                    <p className=''>
                      Precio: <span className='font-bold'>${product.unitPrice}</span>
                    </p>
                  </div>
                  <div className='flex items-center justify-around'>
                    <button className='rounded-md bg-neutral-700 hover:bg-neutral-600' onClick={(e) => handleMinusQuantity(e, product._id)}>
                      <Minus className='size-6'/>
                    </button>
                    <input type='number' name='quantity' key={product._id} value={product.quantity} className='w-6 no-spinner bg-neutral-900 rounded-sm mx-2' onChange={(e) => handleChange(e, product._id)} /> 
                    <button className='rounded-md bg-orange-500 hover:bg-orange-700' onClick={(e) => handlePlusQuantity(e, product._id)}>
                      <Plus className='size-6'/>
                    </button>
                    <button className='ml-3 p-1 bg-red-500/50 hover:bg-red-500/80 text-red-400 rounded-md' onClick={(e) => handleDelete(e, product._id)}>
                      <Trash2Icon className='size-6'/>
                    </button>
                  </div>
                </div>
              )
            })}
          </form>
            <button type='submit' onClick={handleCreateSale} className='mt-5 px-4 py-2 bg-orange-500 text-gray-100 rounded hover:bg-orange-700'>
              Crear Venta
            </button>
            <button type='button' className='ml-2 px-4 py-2 bg-neutral-700 text-gray-100 rounded hover:bg-neutral-600' onClick={onClose}>
              Cancelar
            </button>
        </div>

        <RigthSelector formData={formData} setFormData={setFormData}/>
      </div>
    </div>
  )
}

export default CreateSaleModal
