'use client';
import { useState, useEffect } from 'react'
import Button from '@/components/Button';
import { useUser } from '@/context'
import Title from '@/components/Title'
import { WithAuth } from '@/HOCs/WithAuth'
import { writeUserData, readUserData, updateUserData } from '@/supabase/utils'
import { uploadStorage } from '@/supabase/storage'
import Page from '@/components/Page'
import Label from '@/components/Label'
import MiniCard from '@/components/MiniCard'
import Input from '@/components/Input'
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import Msg from "@/components/Msg"
import Modal from "@/components/Modal"
import { useMask } from '@react-input/mask';
// import { getDayMonthYear } from '@/utils/DateFormat';
const InvoicePDF = dynamic(() => import("@/components/ProformaPDF"), {
  ssr: false,
});

function Comprar({ theme, styled, click, children }) {

  const { user, userDB, cart, productDB, setUserProduct, setUserItem, setUserData, setUserSuccess, success, state, setState, modal, setModal, qrBCP, setQrBCP, paySuccess, setPaySuccess, check, setCheck } = useUser()
  const inputRefWhatsApp = useMask({ mask: '__ ___ ___', replacement: { _: /\d/ } });
  const inputRefWhatsApp2 = useMask({ mask: '__ ___ ___', replacement: { _: /\d/ } });
  const [pay, setPay] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  function onChangeHandler(e) {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  function handlerPay(e) {
    e.preventDefault()
    e.stopPropagation()
    if (modal === 'SuccessFull') {
      return
    }

    if (state['nombre del paciente'] && state['celular del paciente'] && state['celular del paciente'].length === 10 && state['referencia del paciente'].length === 10 && state['referencia del paciente']) {
      if (pay === true) {
        setModal('SuccessFull')
        const val = calculator()
        val >= 0 && requestQR()
      } else {
        setPay(true)
      }
    } else {
      setUserSuccess('Complete')
    }
  }

  function handlerCheck(data) {
    setCheck(data)
    setState({ ...state, check: data })
  }

  function calculator() {
    const val = Object.values(cart).reduce((acc, i, index) => {
      const sum = i['costo'] * i['cantidad']
      return sum + acc
    }, 0)
    return val
  }
  console.log(window.location.href.includes('https'))














  function closeModal() {
    setModal('')
    setQrBCP(undefined)
  }


  window.onbeforeunload = function () {
    return "¿Desea recargar la página web?";
  };

  async function verify() {
    const res = await readUserData('Pedido', qrBCP.id, null, 'idBCP')
    res[0].message === 'Correcto' && router.push('/Cliente/Comprar/Detalle')
  }


  useEffect(() => {
    paySuccess !== null && paySuccess !== undefined && router.push('/Cliente/Comprar/Detalle')
  }, [paySuccess]);

  console.log(userDB)
  return (<div className='w-full min-h-screen relative px-5 pb-[50px] bg-gray-100' onClick={() => setPay(false)}>
    <InvoicePDF />

    {pay && <Modal
      primary="bg-amber-400 hover:bg-amber-400  text-black font-bold"
      alert={true}
      cancel={()=>isLoading ? '':setPay('')}>
      {user.rol == 'Clinica' && userDB && userDB.access == 'Solicitadora' ? 'Ya casi tienes tus productos, confirma tu Solicitud...' : 'Ya casi tienes tus productos, confirmar tu compra...'}
      <br />
      <br />
      <div className='w-full grid grid-cols-2 gap-[2px]'>
        <Button type="button" theme="TransparentW" click={()=>isLoading ? '':setPay('')}>
          Volver
        </Button>
        {isLoading ? <Button type="submit" theme="Loading" click={(e)=>e.stopPropagation()} /> : <Button type="button" theme="Warning"   click={handlerPay}>
        {user.rol == 'Clinica' && userDB && userDB.access == 'Solicitadora' ? 'Confirmar' : 'Confirmar'}
        </Button>}
      </div>
    </Modal>}

    {success == 'Complete' && <Msg>Complete el formulario</Msg>}
    <form >
      <Title>DATOS DEL PACIENTE</Title>
      

          

   
      {user.rol == 'Clinica' && userDB && userDB.access == 'Solicitadora'
        ? Object.values(cart).length > 0 && <div className="fixed w-screen px-5 lg:px-0  left-0 bottom-[70px] lg:w-[250px] lg:bottom-auto lg:top-[75px] lg:left-auto lg:right-5 z-50">
          {isLoading ? <Button type="submit" theme="Loading" /> : <Button theme="SuccessBuy" styled={pay ? 'bg-amber-400' : ''} click={handlerPay}> {pay ? 'Confirmar Solicitud' : 'Solicitar'}</Button>}
        </div>
        : Object.values(cart).length > 0 && <div className="fixed w-screen px-5 lg:px-0 left-0  bottom-[70px] lg:w-[250px] lg:bottom-auto lg:top-[75px] lg:left-auto lg:right-5 z-50">
          {isLoading ? <Button type="submit" theme="Loading" /> : <Button theme="SuccessBuy" styled={pay ? 'bg-amber-400' : ''} click={handlerPay}> {pay ? 'Confirmar Compra' : 'Pagar por QR'}</Button>}
        </div>
      }
    </form>


    <div className='relative border-t-4 border-t-gray-400 bg-white overflow-x-auto items-center justify-between w-full max-w-screen bg-transparent md:w-auto lg:max-w-auto transition-all	z-0' >
      <h3 className='text-center  border-[1px] border-gray-200  bg-gray-100 text-[16px] px-5 py-2  font-bold' >MIS COMPRAS</h3>

      <table className="w-full shadow-2xl lg:min-w-[800px] border-[1px] border-gray-200 lg:w-full lg:min-w-auto text-[12px] text-left text-gray-500">

        {Object.values(cart).length > 0 && <thead className="w-full text-[16px] text-gray-900 uppercase border-b bg-gray-100">
          <tr>
            <th scope="col-3" className="px-2 py-3 font-bold border-r">
              Producto
            </th>
            <th scope="col" className="px-0 py-3  w-[100px] text-center font-bold border-r">
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
            <td className="px-2 py-4 text-[16px] text-gray-900 border-r">
              TOTAL:
            </td>
            <td className="px-2 py-4 text-[16px] text-gray-900 border-r"></td>
            <td className="px-2 py-4 text-[16px] text-gray-900 text-center">
              {Object.values(cart).reduce((acc, i, index) => {
                const sum = i['costo'] * i['cantidad']
                return sum + acc
              }, 0)}  Bs.
            </td>
          </tr>
        </tbody>}

      </table>
    </div>
    <br />
    <br />

  </div>)
}

export default WithAuth(Comprar)