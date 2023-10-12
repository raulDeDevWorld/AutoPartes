'use client'
import { useUser } from '@/context'
import { onAuth, signUpWithEmailAndPassword, passwordRedirect } from '@/supabase/utils'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Msg from '@/components/Msg'
import { useRouter } from 'next/navigation';
import LoaderWithLogo from '@/components/LoaderWithLogo'


export default function Home() {
    const { user, introVideo, setSound, setIntroVideo, userDB, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, sound1, sound2, setSound1, setSound2, } = useUser()
    const [isDisable, setIsDisable] = useState(false)
    const router = useRouter()


    const signUpHandler = async (e) => {
        e.preventDefault()
        setIsDisable(true)
        let email = e.target[0].value
        let password = e.target[1].value

        if (email.length == 0 && password.length == 0) {
            setUserSuccess('Complete')
            return setIsDisable(false)
        }
        if (password.length < 8) {
            setUserSuccess('ContraseñaCorta')
            return setIsDisable(false)
        }
        const data = await signUpWithEmailAndPassword(email, password, setUserProfile)
        console.log(data)
        setUserProfile(data.user)
        data.user == null ? setUserSuccess('CuentaExiste') : router.push('/Register')
        return setIsDisable(false)

    }



    // useEffect(() => {
    //     user === undefined && onAuth(setUserProfile)
    //     if (user !== undefined && user !== null) router.replace('/')
    // }, [user])
    // console.log(user)

    return (
        user === undefined
            ? <LoaderWithLogo></LoaderWithLogo>
            : <div className='w-full  flex flex-col justify-center items-center p-5 '>
                <form className={`w-full max-w-[450px] space-y-4 shadow-2xl bg-white shadow rounded-[20px] px-5 py-10 `} onSubmit={!isDisable ? signUpHandler : (e) => e.preventDefault()} >
                    <h5 className="text-[18px] text-center text-gray-800">Registrate</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-[16px] text-left font-medium text-gray-800">Email</label>
                        <Input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-[16px] text-left  font-medium text-gray-800">Contraseña</label>
                        <Input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" required />
                    </div>
                    <div className="flex items-start">
                        <Link href='/Resetear' className="ml-auto  text-[14px] text-gray-400 underline">Olvidaste tu contraseña?</Link>
                    </div>
                    <Button type="submit" theme="Primary">Registrarme</Button>
                    <div className="text-[14px] text-center font-medium text-gray-800">Ya tienes una cuenta? <Link href="/Login" className="text-gray-400 underline">Inicia Sesión</Link ></div>
                </form>
                {success == 'AccountNonExist' && <Msg>Cuenta inexistente</Msg>}
                {success == 'CompleteEmail' && <Msg>Introduce tu email</Msg>}
                {success == 'Complete' && <Msg>Complete el formulario</Msg>}
            </div>

    )
}

