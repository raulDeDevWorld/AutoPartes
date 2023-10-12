



export default function layout({ children }) {
  return (
    <main className='relative h-screen min-h-[640px] bg-[#00E2FF] flex flex-col justify-center items-center ' style={{ background: 'linear-gradient(0deg, #ffffff 50%, #DC0000 50%)' }}>
      <div className='relative  w-full text-center flex justify-center bg-transparent py-5'>
        <img src="/logo.png" className='h-[80px]' alt="User" />
      </div>
      {children}
    </main>
  )
}