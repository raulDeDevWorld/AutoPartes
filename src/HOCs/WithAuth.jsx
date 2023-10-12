'use client'

import Loader from '@/components/Loader'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/'
import { readUserData} from '@/supabase/utils'
import { onAuth } from '@/supabase/utils'

export function WithAuth(Component) {
    return () => {
        const { user, userDB, setUserProfile, setUserData } = useUser()
        const router = useRouter()
        // console.log(user)
        useEffect(() => {
            if(user === undefined) onAuth(setUserProfile)
            if(user === null) router.push('/Login')
            if(user !== undefined && user !== null && user.rol && userDB === undefined) {
                console.log('ejecu')
                readUserData(user.rol, user.uuid, setUserData)} 
        }, [user, userDB])
        
        return (
            <>
                {user === undefined && <Loader />}
                {user && <Component {...arguments} />}
            </>
        )
    }
}