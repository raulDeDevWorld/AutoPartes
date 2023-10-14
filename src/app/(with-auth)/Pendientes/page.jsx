'use client'

import Button from '@/components/Button'
import Subtitle from '@/components/Subtitle'
import Modal from '@/components/Modal'
import Select from '@/components/Select'
import { useUser } from '@/context/'
import Tag from '@/components/Tag'
import { useRouter } from 'next/navigation';

import { useEffect, useState, useRef } from 'react'
import { writeUserData, readUserData, updateUserData, deleteUserData, readUserAllData } from '@/supabase/utils'
// import { uploadStorage } from '@/supabase/storage'

function Home() {
    const { user, setUserUuid, userDB, msg, setMsg, modal, setModal, temporal, setTemporal, distributorPDB, setUserDistributorPDB, setUserItem, setUserData, setUserSuccess, sucursales, setSucursales, pendientes, setPendientes } = useUser()

    const router = useRouter()
    const [state, setState] = useState({})
    const [postImage, setPostImage] = useState({})
    const [urlPostImage, setUrlPostImage] = useState({})
    const [disponibilidad, setDisponibilidad] = useState('')
    const [categoria, setCategoria] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [filter, setFilter] = useState('')
    const refFirst = useRef(null);

    function onChangeHandler(e) {
        setFilter(e.target.value.toLowerCase())
    }
    // async function save(i) {
    //     awai  t updateUserData('Producto', state[i.uuid], i.uuid)
    //     postImage[i.uuid] && await uploadStorage('Producto', postImage[i.uuid], i.uuid, updateUserData, true)
    //     const obj = { ...state }
    //     delete obj[i.uuid]
    //     setState(obj)
    //     readUserData('Producto', user.uuid, setUserDistributorPDB, 'distribuidor')
    // }
    async function deletConfirm() {
        await deleteUserData('Producto', userUuid)
        readUserData('Producto', userUuid, setUserDistributorPDB, 'distribuidor')
    }
    function delet(i) {
        setUserItem(i)
        setModal('Delete')
    }
    function redirect(id) {
        setUserUuid(id)
        return router.push('Administrador/Distribuidores/Productos')
    }
    function redirectPedidos(id) {
        setUserUuid(id)
        return router.push('Administrador/Distribuidores/Pedidos')
    }
    function sortArray(x, y) {
        if (x['nombre'].toLowerCase() < y['nombre'].toLowerCase()) { return -1 }
        if (x['nombre'].toLowerCase() > y['nombre'].toLowerCase()) { return 1 }
        return 0
    }


    const prev = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            console.log(scrollLeft)
            const itemWidth = screen.width - 50
            refFirst.current.scrollLeft = scrollLeft - itemWidth;
        });
    };

    const next = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            console.log(scrollLeft)
            const itemWidth = screen.width - 50
            console.log(itemWidth)
            refFirst.current.scrollLeft = scrollLeft + itemWidth;
        });
    };
    console.log('sucursales')

    console.log(sucursales)
    useEffect(() => {
        readUserAllData('Pendientes', setPendientes)
    }, [])

    return (

        <div className='h-full'>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>
            <div className="relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smoot" ref={refFirst}>
                {modal === 'Delete' && <Modal click={deletConfirm} funcion={() => delet(i)}>Estas seguro de eliminar al siguiente usuario {msg}</Modal>}
                <h3 className='font-medium text-[16px]'>Pendientes</h3>
                <br />
                <div className='flex justify-center w-full'>
                    <input type="text" className='border-b border-gray-300 gap-4 text-center focus:outline-none  w-[300px]' onChange={onChangeHandler} placeholder='Filtrar por nombre' />
                </div>
                <br />



                <table className="w-full min-w-[1100px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                    <thead className="w-full text-[14px] text-gray-900 uppercase border-b bg-gray-100">
                        <tr>
                            <th scope="col" className="px-3 py-3">
                                #
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-3 py-3">
                                CI
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Dirección
                            </th>

                            <th scope="col" className="px-3 py-3">
                                Servicios
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Whatsapp
                            </th>
                            <th scope="col" className="px-3 py-3">
                                A cuenta
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Saldo
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Avance
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Eliminar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendientes && pendientes.sort(sortArray).map((i, index) => {

                            return i.nombre.toLowerCase().includes(filter) && <tr className="bg-white text-[12px] border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                <td className="px-3 py-4  flex font-semibold text-gray-900 dark:text-white">
                                    <span className='h-full flex py-2'>{index + 1}</span>
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white" >
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} cols="6" name='nombre de producto 1' defaultValue={i['nombre de producto 1']} className="block p-1.5  w-full h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    {i['nombre']}
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white" >
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} cols="6" name='nombre de producto 1' defaultValue={i['nombre de producto 1']} className="block p-1.5  w-full h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    {i['CI']}
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white" >
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} cols="6" name='nombre de producto 1' defaultValue={i['nombre de producto 1']} className="block p-1.5  w-full h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    {i['direccion']}
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} name='costo' cols="4" defaultValue={i['costo']} className="block p-1.5 h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    {i['servicios']}
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} name='costo' cols="4" defaultValue={i['costo']} className="block p-1.5 h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    {i['whatsapp']}
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} name='costo' cols="4" defaultValue={i['costo']} className="block p-1.5 h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    
                                </td>
                                <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                                    {/* <textarea id="message" rows="6" onChange={(e) => onChangeHandler(e, i)} name='costo' cols="4" defaultValue={i['costo']} className="block p-1.5 h-full text-sm text-gray-900 bg-white rounded-lg  focus:ring-gray-100 focus:border-gray-100 focus:outline-none resize-x-none" placeholder="Write your thoughts here..."></textarea> */}
                                    
                                </td>

                                <td className="px-3 py-4">
                                    <Button theme={"Danger"} click={() => delet(i)}>Eliminar</Button>
                                </td>
                            </tr>
                        })
                        }
                    </tbody>
                </table>
            </div>
        </div>

    )
}
export default Home



{/* <div className='lg:flex hidden lg:fixed top-[100px] right-[65px] '>
                    <div className='flex justify-center items-center h-[50px] text-white text-[14px] font-normal font-medium bg-[#32CD32] border border-gray-200 rounded-[10px] px-10 cursor-pointer mr-2' onClick={redirect}>Agregar Sucursal</div>
                    <div className='flex justify-center items-center bg-[#0064FA] h-[50px] w-[50px]  rounded-full text-white cursor-pointer' onClick={redirect}> <span className='text-white text-[30px]'>+</span> </div>
                </div> */}

