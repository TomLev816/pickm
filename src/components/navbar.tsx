import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaCopy, FaGoogle, FaSignOutAlt } from 'react-icons/fa';

const NavBar: React.FC = () => {
  const { data: sesh } = useSession();

  if (sesh)
    return (
      <>
        <div className="flex items-center justify-between bg-gray-800 py-4 px-8 shadow">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {sesh.user?.image && (
              <img
                src={sesh.user?.image}
                alt="pro pic"
                className="w-16 rounded-full"
              />
            )}
            {sesh.user?.name}
          </h1>
          <div className="flex gap-2">
            <Link href='/'>
              <button
                className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
              >
                Home <FaCopy size={24} />
              </button>
            </Link>
            <Link href='/your-picks'>
              <button
                className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
              >
                Your Picks <FaCopy size={24} />
              </button>
            </Link>
            <Link href='/all-picks'>
              <button
                className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
              >
                Eveyones Picks <FaCopy size={24} />
              </button>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
            >
              Logout <FaSignOutAlt size={24} />
            </button>
          </div>
        </div>
      </>
    )

  return (
    <>
      <div className="flex items-center justify-between bg-gray-800 py-4 px-8 shadow">
        <button
          onClick={() => signIn("google")}
          className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
        >
          Sign In <FaGoogle />
        </button>
      </div>
    </>
  )
}

export default NavBar