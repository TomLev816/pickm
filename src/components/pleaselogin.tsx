import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'


const PleaseLogin = () => {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="text-2xl font-bold">Please log in below</div>
      <div className="p-4" />
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-2xl text-black"
      >
        <span>Sign in with Google</span>
        <FaGoogle />
      </button>
    </div>
  )
}

export default PleaseLogin