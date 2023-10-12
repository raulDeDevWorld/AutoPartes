'use client'
import { useUser } from '@/context'
import { onAuth, signOut, signInWithEmailAndPassword, passwordRedirect, writeUserData } from '@/supabase/utils'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Msg from '@/components/Msg'
import { useRouter } from 'next/navigation';
import LoaderWithLogo from '@/components/LoaderWithLogo'
import { useMask } from '@react-input/mask';


export default function Home() {
    const { user, introVideo, setSound, userDB, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, sound1, sound2, setSound1, setSound2, } = useUser()
    const [isDisable, setIsDisable] = useState(false)
    const router = useRouter()
    const inputRefWhatsApp = useMask({ mask: '+ 591 __ ___ ___', replacement: { _: /\d/ } });


    const signInHandler = async (e) => {
        e.preventDefault()
        setIsDisable(true)

        const data = {
            nombre: e.target[0].value,
            CI: e.target[1].value,
            direccion: e.target[2].value,
            whatsapp: e.target[3].value,
            uuid: user.id
        }
console.log(data)

        const res = await writeUserData('Clientes', data, user.id, user, setUserProfile, null, null, null, true)
        console.log(res)
        return setIsDisable(false)
    }

    const handleSignOut = () => {
        signOut()
    }

    useEffect(() => {
        user === undefined && onAuth(setUserProfile)
        if (user === null) {
            router.push('/Login')
        }
        if (user && user !== undefined && user.rol) { router.push('/') }
    }, [user]);

    // useEffect(() => {
    //     user === undefined && onAuth(setUserProfile)
    //     if (user !== undefined && user !== null && user.rol !== undefined) router.replace('/')
    // }, [user])
    console.log(user)

    return (
        user === undefined
            ? <LoaderWithLogo></LoaderWithLogo>
            : <div className='w-full  flex flex-col justify-center items-center p-5 '>


                <form className={`w-full max-w-[450px] md:max-w-[600px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 md:mt-[0px] md:grid md:grid-cols-2 md:gap-[5px]`} onSubmit={isDisable === false ? signInHandler : (e) => e.preventDefault()} >
                    <h5 className="text-[18px] text-center text-gray-800 md:col-span-2" >Registrate</h5>

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
                        <Button type="submit" theme="Primary" styled={"md:col-span-2"}>Registrarme</Button>
                    <div className="text-[14px] text-center font-medium text-gray-800 md:col-span-2">Ya tienes una cuenta? <Link href="/Login" className="text-gray-400 underline" onClick={handleSignOut}>Inicia Sesión</Link ></div>
                </form>
                {success == 'AccountNonExist' && <Msg>Cuenta inexistente</Msg>}
                {success == 'CompleteEmail' && <Msg>Introduce tu email</Msg>}

                {success == 'Complete' && <Msg>Complete el formulario</Msg>}
            </div>


    )
}
