"use client"

import { useEffect, useState }from 'react'
import axios from 'axios'
import Header from '../(components)/Header'
import { ArrowLeft, ArrowRight, Check, Edit, Trash2, X } from 'lucide-react'

type productType = {
  name: string,
  price: number,
  category: string,
  _id: string,
  stockQuantity: number
}

const ListHeader = () => {
  return (
    <div className='w-full flex bg-neutral-700'>
      <div className='w-[20%] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
        <p className='md:font-semibold text-lg'>ID</p>
      </div>
      <div className='flex w-[25%]'>
        <div className='w-[] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-lg'>Nombre</p>
        </div>
      </div>
      <div className='flex w-[10%]'>
        <div className='w-[] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-lg'>Precio</p>
        </div>
      </div>
      <div className='flex w-[20%]'>
        <div className='w-[] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-lg'>Categoria</p>
        </div>
      </div>
      <div className='flex w-[5%]'>
        <div className='w-[] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-lg'>Stock</p>
        </div>
      </div>
    </div>
  )
}

const ListItem = ({id, name, stockQuantity, price, category, reload, setReload }: {id: string, name: string, stockQuantity: number, price: number, category:string, reload: boolean, setReload: Function}) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [formData, setFormData] = useState({
    name: name,
    stockQuantity: stockQuantity,
    category: category,
    price: price
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name==="price" || name=== "stockQuantity" || name === "rating"
        ? parseFloat(value) : value
    })
  };

  const handleSubmit = (e: any) => {
    e.preventDefault()

    console.log(formData)
    axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`, formData)
      .then(setReload(!reload))
    setIsBeingEdited(false)
  }

  const deleteOnClick = () => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
      .then(setReload(!reload))
  }
  const editOnClick = (e: any) => {
    e.preventDefault()
    setIsBeingEdited(!isBeingEdited)
  }

  return (
    isBeingEdited 
    ? <form className='w-full flex hover:bg-neutral-700/70 border-b-[1px] border-b-neutral-700'>
      <div className='py-4 flex items-center w-[20%] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 border-r-[1px] border-r-neutral-700 overflow-auto scrollbar'>
        <p className='md:font-semibold text-sm md:text-sm md:text-md'>{id}</p>
      </div>
      <div/>
      <input type='text' name="name" value={formData.name} onChange={(e) => handleChange(e)} autoFocus spellCheck={false}  className='py-4 flex w-[25%] border-r-[1px] border-r-neutral-700 md:font-semibold pl-2 md:pl-3 lg:pl-4' />
  
      <input type='number' name='price' value={formData.price} onChange={(e) => handleChange(e)} className='py-4 flex w-[10%] border-r-[1px] pl-2 md:pl-3 lg:pl-4 border-r-neutral-700 md:font-semibold no-spinner' />
  
      <select value={formData.category} onChange={(e) => handleChange(e)} name='category'
      className='py-4 flex w-[20%] border-r-[1px] pl-2 md:pl-3 lg:pl-4 border-r-neutral-700 md:font-semibold'>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Cosmética-Facial</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Cosmética-Corporal</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Coloración-y-Tintura</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Uñas-y-Manos</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Perfumería</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Instrumental-de-Peluquería</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Cuidado-Personal</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Higiene-Bucal</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Pañales</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Servilletas</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Bebés</option>
        <option className='bg-neutral-700 outline-none border-none text-gray-100'>Otros</option>
      </select>
  
      <input type='number' name='stockQuantity' onChange={(e) => handleChange(e)} value={formData.stockQuantity} className='py-4 flex w-[5%] pl-2 md:pl-3 lg:pl-4 border-r-[1px] border-r-neutral-700 md:font-semibold no-spinner' />
  
      <div className='py-4 flex w-[20%] justify-evenly items-center'>
        <button className='p-2 bg-neutral-800 rounded-md hover:bg-red-200/40 hover:text-red-300' onClick={(e) => editOnClick(e)}>
          <X className='size-6' color='#aa111188'/>
        </button>
        <button className='p-2 bg-neutral-800 rounded-md hover:bg-green-200/40' onClick={(e) => handleSubmit(e)}>
          <Check className='size-6' color='#347E399D'/>
        </button>
      </div>
    </form>
    : <div className='w-full flex hover:bg-neutral-700/70 border-b-[1px] border-b-neutral-700'>
      <div className='overflow-auto scrollbar flex items-center w-[20%] pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 border-r-[1px] border-r-neutral-700 '>
        <p className='md:font-semibold text-sm md:text-md'>{id}</p>
      </div>
      <div className='flex w-[25%] border-r-[1px] border-r-neutral-700'>
        <div className='w-full pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4 '>
          <p className='md:font-semibold text-sm md:text-md'>{name}</p>
        </div>
      </div>
      <div className='flex w-[10%] border-r-[1px] border-r-neutral-700'>
        <div className='w-full pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-sm md:text-md'>${price}</p>
        </div>
      </div>
      <div className='flex w-[20%] border-r-[1px] border-r-neutral-700'>
        <div className='w-full pl-2 md:pl-3 lg:pl-4 border-l-neutral-300 py-4'>
          <p className='md:font-semibold text-sm md:text-md'>{category}</p>
        </div>
      </div>
      <div className='flex w-[5%] pl-2 md:pl-3 lg:pl-4 border-r-[1px] border-r-neutral-700 md:font-semibold'>
        <div className='w-full border-l-neutral-300 py-4'>
          <p className=''>{stockQuantity}</p>
        </div>
      </div>
      <div className='flex w-[20%] justify-evenly items-center'>
        <button className='p-2 bg-neutral-800 rounded-md hover:bg-neutral-600' onClick={(e) => editOnClick(e)}>
          <Edit className='size-6'/>
        </button>
        <button className='p-2 bg-neutral-800 rounded-md hover:bg-red-200/40 hover:text-red-300' onClick={deleteOnClick}>
          <Trash2 className='size-6' color='#aa111188'/>
        </button>
      </div>
    </div>
  )
}

const ListFooter = ({page, setPage, totalPages}: {page: number, setPage: Function, totalPages: number}) => {
  const arrowLeftOnClick = () => {
    if (page <= 1 ) return
    setPage(page-1)
  }
  const arrowRightOnClick = () => {
    if (page >= totalPages) return
    setPage(page+1)
  }

  return (
    <div className='bg-neutral-700 w-full flex items-center justify-between px-4 py-2 rounded-b-2xl'>
      <p className='text-md md:font-semibold'>Pagina {page}</p>
      <div className='flex items-center justify-between'>
        <button onClick={arrowLeftOnClick} className={`p-1 mx-2 bg-neutral-800 rounded-sm ${page <= 1 ? "opacity-40" : "hover:opacity-70"}`}>
          <ArrowLeft />
        </button>
        <button onClick={arrowRightOnClick} className={`p-1 mx-2 bg-neutral-800 rounded-sm ${page >= totalPages ? "opacity-40" : "hover:opacity-70"}`}>
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}

const List = ({reload, setReload, products, page, setPage, totalPages}: {reload: boolean, setReload: Function, products: productType[], page: number, setPage: Function, totalPages: number}) => {

  return <div className='rounded-t-2xl overflow-hidden mt-5 bg-neutral-800'>
    <ListHeader />
    {products.map((product: productType) => <ListItem key={product._id} id={product._id} name={product.name} price={product.price} stockQuantity={product.stockQuantity} category={product.category} reload={reload} setReload={setReload} />)}
    <ListFooter page={page} setPage={setPage} totalPages={totalPages}/>
  </div>
}

const Inventory = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState({
    totalPages: 0,
    products: []
  })
  const [reload, setReload] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/page/${page}`)
      .then(res => setProducts(res.data))
    console.log("nuevovalor")
  }, [page, reload])
  
  return (
    <div className='flex flex-col'>
      <Header name='Inventory' />
      <List reload={reload} products={products.products} setReload={setReload} page={page} setPage={setPage} totalPages={products.totalPages} />
    </div>
  )
}

export default Inventory