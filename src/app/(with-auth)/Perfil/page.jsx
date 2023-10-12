'use client'

import { writeUserData, readUserData, updateUserData } from '@/supabase/utils'
import { uploadStorage } from '@/supabase/storage'
import { useState, useEffect } from 'react'
import { useUser } from '@/context'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Label from '@/components/Label'
import LoaderBlack from '@/components/LoaderBlack'
import Button from '@/components/Button'
import { useMask } from '@react-input/mask';
import { useRouter } from 'next/navigation';
import { WithAuth } from '@/HOCs/WithAuth'

                               
function Home() {
    const router = useRouter()

    const { user, userDB, setUserData, success, setUserSuccess } = useUser()
    const [state, setState] = useState({})

    const [postImage, setPostImage] = useState(null)
    const [urlPostImage, setUrlPostImage] = useState(null)
        

    const inputRefCard = useMask({ mask: '____ ____ ____ ____', replacement: { _: /\d/ } });
    const inputRefDate = useMask({ mask: '__/__', replacement: { _: /\d/ } });
    const inputRefCVC = useMask({ mask: '___', replacement: { _: /\d/ } });
    const inputRefPhone = useMask({ mask: '+ 591 _ ___ ___', replacement: { _: /\d/ } });
    const inputRefWhatsApp = useMask({ mask: '+ 591 __ ___ ___', replacement: { _: /\d/ } });

   
    function onChangeHandler(e) {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    async function save(e) {
        e.preventDefault()
      
    }

    

    return (
        <div className='w-full flex justify-center p-5'>

        <form className='p-5 py-10 bg-white w-full max-w-[800px] shadow-2xl' onSubmit={save} >
            {success === "Cargando" && <LoaderBlack></LoaderBlack>}
            <h3 className='text-center text-[14px] pb-3 font-bold'>Datos Empresariales</h3>
            <br />
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="">Whatsapp</Label>
                    <Input type="text" name="whatsapp" onChange={onChangeHandler} reference={inputRefWhatsApp} defValue={userDB && userDB['whatsapp']} require />
                </div>
            </div>
            <br />
            <br />
            <div className='flex w-full justify-around'>
                <Button theme='Primary'>Guardar</Button>
            </div>
        </form>
        </div>
    )
}

export default Home



