import Link from 'next/link'
import Image from 'next/image'

export default function NavBar(){
  return (
    <div className="flex flex-col gap-2 p-2 text-gray-800 border border-gray-100 rounded-xl bg-gray-100 shadow-sm">
    <nav className="flex items-center gap-5">
        <Image src='/Laminar_Logo.png' alt='Laminar' width='100' height='100' className="object-contain"/>
        <span className="font-semibold text-lg"> Tank Efficiency Dashboard</span>
    </nav>
    </div>
  )
}