'use client'
import { writeUserData, readUserData, updateUserData } from '@/supabase/utils'
import { uploadStorage } from '@/supabase/storage'
import { useState, useRef } from 'react'
import { useUser } from '@/context'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Label from '@/components/Label'
import LoaderBlack from '@/components/LoaderBlack'

import Success from '@/components/Success'
import Modal from '@/components/Modal'

import Button from '@/components/Button'
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/utils/UIDgenerator'
import { categoria, tiempo } from '@/constants'


function Home() {
    const router = useRouter()

    const { user, userDB, setUserData, setUserSuccess, success, setModal, modal } = useUser()
    const [state, setState] = useState({ categoria: 'Chompas', tiempo: '24 hrs' })

    const [postImage, setPostImage] = useState(null)
    const [urlPostImage, setUrlPostImage] = useState(null)
    const [disable, setDisable] = useState(false)

    const inputRef1 = useRef(null)
    const inputRef2 = useRef(null)
    const inputRef3 = useRef(null)
    const inputRef4 = useRef(null)
    const inputRef5 = useRef(null)


    const onClickHandlerSelect = (name, value) => {
        setState({ ...state, [name]: value })
    }

    function manageInputIMG(e) {
        const file = e.target.files[0]
        setPostImage(file)
        setUrlPostImage(URL.createObjectURL(file))
    }

    function onChangeHandler(e) {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    function handlerReset() {

        inputRef1.current.value = ''
        inputRef2.current.value = ''
        inputRef3.current.value = ''
        inputRef4.current.value = ''
        inputRef5.current.value = ''

        setPostImage(null)
        setUrlPostImage(null)
        setState({ sistema: '1.5', disponibilidad: 'Disponible' })
        setUserSuccess('')
        setDisable(false)

    }
    async function save(e) {
        e.preventDefault()
        setDisable(true)
        const uuid = generateUUID()
        console.log('submit')
        const res = await writeUserData('Servicios', { ...state, uuid })
        console.log(res)
        res.error === null && await uploadStorage('Servicios', postImage, 'qr_image', updateUserData, true)
        return handlerReset()
    }

    console.log(state)

    return (
        <div className='min-h-full p-5 pb-[30px] lg:pb-5'>
                {disable && <LoaderBlack></LoaderBlack>}

            <form className='p-10 min-w-screen  lg:min-w-auto bg-white shadow-2xl min-h-[80vh]' onSubmit={save}>
                <h3 className='text-center text-[16px] pb-3'>Agregar Producto</h3>

                <div className="w-full flex justify-center ">
                    <label htmlFor="fileUpload" className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 md:w-[250px] md:h-[200px]" style={{ backgroundImage: `url(${urlPostImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label htmlFor="fileUpload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                    <span>Cargar Imagen</span>
                                    <input id="fileUpload" name="frontPage" onChange={manageInputIMG} type="file" className="sr-only" accept="image/*" required />
                                </label>
                                <p className="pl-1">{' '} puede ser GIF</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF max 10MB</p>
                        </div>
                    </label>
                </div>
                <br />
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <Label htmlFor="">Nombre 1</Label>
                        <Input type="text" name="nombre 1" reference={inputRef1} onChange={onChangeHandler} require />
                    </div>
                    <div>
                        <Label htmlFor="">Nombre 2</Label>
                        <Input type="text" name="nombre 2" reference={inputRef2} onChange={onChangeHandler} />
                    </div>
                    <div>
                        <Label htmlFor="">Nombre 3</Label>
                        <Input type="text" name="nombre 3" reference={inputRef3} onChange={onChangeHandler} />
                    </div>
                    <div>
                        <Label htmlFor="">Marca o especificación</Label>
                        <Input type="text" name="marca" reference={inputRef4} onChange={onChangeHandler} require />
                    </div>
                    <div>
                        <Label htmlFor="">Descripción básica</Label>
                        <Input type="text" name="descripcion basica" reference={inputRef4} onChange={onChangeHandler} require />
                    </div>
                    <div>
                        <Label htmlFor="">Costo</Label>
                        <Input type="text" name="costo" styled={{ textAlign: 'center' }} reference={inputRef5} onChange={onChangeHandler} />
                    </div>
                    <div>
                        <Label htmlFor="">Stock</Label>
                        <Input type="number" name="stock" styled={{ textAlign: 'center' }} reference={inputRef5} onChange={onChangeHandler} />
                    </div>
                </div>
                <div className='flex w-full justify-around'>
                    <Button theme='Primary' >Guardar</Button>
                </div>
                {success == 'Se ha guardado correctamente' && <LoaderBlack />}
                {modal == 'Seleccione una categoria.' && <Modal funcion={() => setUserSuccess('')} alert={true}>{modal}</Modal>}
                {success == 'Se ha guardado correctamente' && <Success>Guardado correctamente</Success>}

            </form>

        </div>
    )
}


export default Home