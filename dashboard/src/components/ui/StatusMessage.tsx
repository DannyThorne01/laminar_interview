
export default function StatusMessage({children}: {children:React.ReactNode}){
  return(
    <div className="mx-auto mt-8 w-fit px-4 py-2 text-lg font-semibold text-gray-600 bg-white rounded-md border border-gray-300"> {children} </div>
  )
}