'use client'
import { readUserAllData, updateUserData, readUserData, getSpecificData, writeUserData } from '@/supabase/utils'
import { useUser } from '@/context'

import Button from '@/components/Button'
import Subtitle from '@/components/Subtitle'
import Card from '@/components/Card'
import CardM from '@/components/CardM'
// import QRreader from '@/components/QRreader'
import Tag from '@/components/Tag'
import Msg from '@/components/Msg'

import Modal from '@/components/Modal'
// import QRscanner from '@/components/QRscanner'
import { useRouter } from 'next/navigation';

import { useEffect } from 'react'
// import QrcodeDecoder from 'qrcode-decoder';
import { QRreaderUtils } from '@/utils/QRreader'
import { useState } from 'react'
import Input from '@/components/Input'
import MiniCard from '@/components/MiniCard'
import { useMask } from '@react-input/mask';

function Home() {
    const { filterDis, setFilterDis,
        user, userDB, cart, setUserCart,
        modal, setUserData,
        setModal, servicios, setServicios,
        setUserProduct, setUserPedidos, setUserItem, item, filter, setFilter, filterQR, setTienda, setFilterQR, recetaDBP, setRecetaDBP, tienda, setIntroClientVideo, search, setSearch, distributorPDB, setUserDistributorPDB, webScann, setWebScann,
        qrBCP, setQrBCP,
        ultimoPedido, setUltimoPedido, success, businessData } = useUser()
    const [disponibilidad, setDisponibilidad] = useState('')
    const [categoria, setCategoria] = useState('')
    const router = useRouter()
    const [filterNav, setFilterNav] = useState(false)
    const inputRefWhatsApp = useMask({ mask: '+ 591 __ ___ ___', replacement: { _: /\d/ } });
    const [state, setState] = useState({})
    const [mode, setMode] = useState('Services')

    function onChangeHandler(e) {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    function HandlerCheckOut() {
        router.push('/Asignar')
    }

    function HandlerOnChange(e) {
        QRreaderUtils(e, setFilterQR, setFilter, readUserData, setRecetaDBP)
    }


    function storeConfirm() {
        setTienda(modal)
        setUserCart({})
        setModal('')
    }






    function sortArray(x, y) {
        if (x['nombre 1'].toLowerCase() < y['nombre 1'].toLowerCase()) { return -1 }
        if (x['nombre 1'].toLowerCase() > y['nombre 1'].toLowerCase()) { return 1 }
        return 0
    }
    function handlerSearchFilter(data) {

        setFilter(data)
        setSearch(false)
    }

    function handlerWebScann(e) {
        e.stopPropagation()
        e.preventDefault()
        router.push('/Cliente/Scaner')
    }
    function searchQR(data) {
        filter === data
            ? setFilter('')
            : setFilter(data)
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()

        const data = {
            nombre: e.target[0].value,
            CI: e.target[1].value,
            direccion: e.target[2].value,
            whatsapp: e.target[3].value,
            uuid: user.id,
            servicios: cart

        }
        console.log(data)

        const res = await writeUserData('Pendientes', data)
        console.log(res)
        return
    }




    console.log(mode)







    console.log(businessData)
    return (

        <main className="">
            {(modal == 'Recetar' || modal == 'Comprar') && <Modal funcion={storeConfirm}>Estas seguro de cambiar a {modal}. <br /> {Object.keys(cart).length > 0 && 'Tus datos se borraran'}</Modal>}
            {modal == 'Auth' && <Modal funcion={() => setModal('')}>Tu perfil esta en espera de ser autorizado</Modal>}



            <div className={`h-[80vh] overflow-hidden w-full relative z-10 flex flex-col items-center md:grid`} style={{ gridTemplateColumns: '500px auto', gridAutoFlow: 'dense' }}>


                <div className="relative bg-transparent lg:bg-transparent h-[80vh] overflow-y-scroll  px-5  w-full flex flex-col items-center"  >
                    {filter.length == 0 &&
                        servicios !== null && servicios !== undefined &&
                        servicios.sort(sortArray).map((i, index) => {
                            return i.categoria.includes(categoria) && <Card i={i} key={index} />
                        })
                    }

                    {filter.length > 0 && filterQR.length === 0 && servicios !== null && servicios !== undefined &&
                        servicios.sort(sortArray).map((i, index) => {
                            return (i['nombre 1'].toLowerCase().includes(filter.toLowerCase()) ||
                                (i['nombre 2'] && i['nombre 2'].toLowerCase().includes(filter.toLowerCase())) ||
                                (i['nombre 3'] && i['nombre 3'].toLowerCase().includes(filter.toLowerCase()))) &&
                                i.categoria.includes(categoria) &&
                                <Card i={i} key={index} />
                        })
                    }
                </div>

                {user && user !== undefined ? <div className='relative  flex flex-col items-center w-full max-w-screen bg-red-500 h-[80vh] overflow-y-scroll    w-full bg-transparent  transition-all px-[15px]	z-0 hidden md:flex' >
                    <div className='w-full grid grid-cols-2 gap-[10px] md:col-span-2'>

                        <ul class="flex border-b">
                            <li class={`mr-1  ${mode === 'Services' ? '-mb-px' : ''}`} onClick={() => setMode('Services')}>
                                <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'Services' ? 'border-l border-t border-r rounded-t' : ''}`} >Servicios</span>
                            </li>
                            <li class={`mr-1 ${mode === 'Client' ? '-mb-px' : ''}`} onClick={() => setMode('Client')}>
                                <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'Client' ? 'border-l border-t border-r  rounded-t' : ''}`} >Cliente</span>
                            </li>
                            <li class={`mr-1 ${mode === 'Client' ? '-mb-px' : ''}`} onClick={() => setMode('QR de pago')}>
                                <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'QR de pago' ? 'border-l border-t border-r  rounded-t' : ''}`} >QR de pago</span>
                            </li>
                        </ul>
                    </div>

                    {mode === 'Client' && <form className={`w-full max-w-[450px] md:max-w-[600px]  mt-[15px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 md:grid md:grid-cols-2 md:gap-[5px]`} onSubmit={handlerSubmit} >

                        <h5 className="text-[18px] text-center text-gray-800 md:col-span-2" >Datos de usuario</h5>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Nombre</label>
                            <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">CI</label>
                            <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Direccion</label>
                            <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Whatsapp</label>
                            <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" reference={inputRefWhatsApp} placeholder="" required />
                        </div>
                        <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Registrar</Button>
                    </form>}

                    {mode === 'Services' && <table className="w-full mt-[15px] shadow-2xl border-[1px] border-gray-200 lg:w-full lg:min-w-auto text-[12px] text-left text-gray-500">

                        {Object.values(cart).length > 0 && <thead className="w-full text-[16px] text-gray-900 uppercase border-b bg-gray-100">
                            <tr>
                                <th scope="col-3" className="px-2 py-3 font-bold">
                                    Producto
                                </th>
                                <th scope="col" className="px-0 py-3  w-[100px] text-center font-bold">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-2 py-3 w-[100px] text-center font-bold">
                                    Costo total
                                </th>
                            </tr>
                        </thead>}
                        {Object.values(cart).length > 0 ? Object.values(cart).map((i, index) => <MiniCard i={i} />) : <span className='block text-[16px] text-center'>No tienes productos <br /> selecciona alguno <br /> </span>}
                        {Object.values(cart).length > 0 && <tbody>
                            <tr className="bg-white text-[12px] border-b">
                                <td className="px-2 py-4 text-[16px] text-gray-900">
                                    TOTAL:
                                </td>
                                <td className="px-2 py-4 text-[16px] text-gray-900"></td>
                                <td className="px-2 py-4 text-[16px] text-gray-900 text-center">
                                    {Object.values(cart).reduce((acc, i, index) => {
                                        const sum = i['costo'] * i['cantidad']
                                        return sum + acc
                                    }, 0)}  Bs.
                                </td>
                            </tr>
                        </tbody>}
                    </table>}

                    {mode === 'QR de pago' && <form className={`w-full max-w-[450px] md:max-w-[600px] flex flex-col items-center  mt-[15px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 md:grid md:grid-cols-2 md:gap-[5px]`} onSubmit={handlerSubmit} >

                        <h5 className="text-[18px] text-center text-gray-800 md:col-span-2" >Datos de usuario</h5>

                        <img src={businessData.url} className='w-[200px] h-auto' alt="" />
                        <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Registrar</Button>
                    </form>}







                    <Button type="submit" theme="Primary" styled={"md:col-span-2"} click={() => setMode('Client')}>Continuar</Button>

                </div>
                    : <div className='relative  flex flex-col items-center w-full max-w-screen bg-red-500 h-[80vh] overflow-y-scroll    w-full bg-transparent  transition-all px-[15px]	z-0 hidden md:flex' >
                        <div className='w-full grid grid-cols-2 gap-[10px] md:col-span-2'>

                            <ul class="flex border-b">
                                <li class={`mr-1  ${mode === 'Services' ? '-mb-px' : ''}`} onClick={() => setMode('Services')}>
                                    <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'Services' ? 'border-l border-t border-r rounded-t' : ''}`} >Servicios</span>
                                </li>
                                <li class={`mr-1 ${mode === 'Client' ? '-mb-px' : ''}`} onClick={() => setMode('Client')}>
                                    <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'Client' ? 'border-l border-t border-r  rounded-t' : ''}`} >Cliente</span>
                                </li>
                                <li class={`mr-1 ${mode === 'Client' ? '-mb-px' : ''}`} onClick={() => setMode('QR de pago')}>
                                    <span class={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer ${mode === 'QR de pago' ? 'border-l border-t border-r  rounded-t' : ''}`} >QR de pago</span>
                                </li>
                            </ul>
                        </div>
                        {mode === 'Client' && <form className={`w-full max-w-[450px] md:max-w-[600px]  mt-[15px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 md:grid md:grid-cols-2 md:gap-[5px]`} onSubmit={handlerSubmit} >

                            <h5 className="text-[18px] text-center text-gray-800 md:col-span-2" >Datos de usuario</h5>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Nombre</label>
                                <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">CI</label>
                                <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Direccion</label>
                                <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Whatsapp</label>
                                <Input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" reference={inputRefWhatsApp} placeholder="" required />
                            </div>
                            <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Registrar</Button>
                        </form>}

                        {mode === 'QR de pago' && <form className={`w-full max-w-[450px] md:max-w-[600px]  mt-[15px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 md:grid md:grid-cols-2 md:gap-[5px]`} onSubmit={handlerSubmit} >

                            <h5 className="text-[18px] text-center text-gray-800 md:col-span-2" >Datos de usuario</h5>

                            <img src={businessData.url} className='w-[200px] h-auto' alt="" />
                            <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Registrar</Button>
                        </form>}

                        {mode === 'Services' && <table className="w-full mt-[15px] shadow-2xl border-[1px] border-gray-200 lg:w-full lg:min-w-auto text-[12px] text-left text-gray-500">

                            {Object.values(cart).length > 0 && <thead className="w-full text-[16px] text-gray-900 uppercase border-b bg-gray-100">
                                <tr>
                                    <th scope="col-3" className="px-2 py-3 font-bold">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-0 py-3  w-[100px] text-center font-bold">
                                        Cantidad
                                    </th>
                                    <th scope="col" className="px-2 py-3 w-[100px] text-center font-bold">
                                        Costo total
                                    </th>
                                </tr>
                            </thead>}
                            {Object.values(cart).length > 0 ? Object.values(cart).map((i, index) => <MiniCard i={i} />) : <span className='block text-[16px] text-center'>No tienes productos <br /> selecciona alguno <br /> </span>}
                            {Object.values(cart).length > 0 && <tbody>
                                <tr className="bg-white text-[12px] border-b">
                                    <td className="px-2 py-4 text-[16px] text-gray-900">
                                        TOTAL:
                                    </td>
                                    <td className="px-2 py-4 text-[16px] text-gray-900"></td>
                                    <td className="px-2 py-4 text-[16px] text-gray-900 text-center">
                                        {Object.values(cart).reduce((acc, i, index) => {
                                            const sum = i['costo'] * i['cantidad']
                                            return sum + acc
                                        }, 0)}  Bs.
                                    </td>
                                </tr>
                            </tbody>}
                        </table>}
                        <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Finalizar venta</Button>

                    </div>
                }

            </div>


            {/* {Object.entries(cart).length !== 0 && <div className="lg:hidden fixed w-screen px-5 bottom-[70px] lg:w-[250px] lg:bottom-auto lg:top-[75px] lg:left-auto lg:right-5  z-20">
                {user.rol !== 'Cliente'

                    ? Object.values(cart).length > 0 && <div className="fixed w-screen px-5  lg:px-0 left-0 bottom-[70px] lg:w-[250px] lg:bottom-auto lg:top-[75px] lg:left-auto lg:right-5  z-20">
                        <Button theme="SuccessBuy" click={HandlerCheckOut}>Calcular Pago</Button>
                    </div>
                    : Object.values(cart).length > 0 && <div className="fixed w-screen px-5 lg:px-0  left-0  bottom-[70px] lg:w-[250px] lg:bottom-auto lg:top-[75px] lg:left-auto lg:right-5  z-20">
                        <Button theme="SuccessBuy" click={HandlerCheckOut}>Asignar Servicio</Button>
                    </div>
                }
            </div>} */}
        </main>
    )
}

export default Home