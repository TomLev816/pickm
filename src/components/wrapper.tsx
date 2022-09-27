import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import Navbar from './navbar';
import { useSession } from 'next-auth/react';
import NavBar from './navbar';
import PleaseLogin from './pleaselogin';

const WrapperHeader = () => {
  return (
    <Head>
      <title>PickM</title>
      <meta name="robots" content="follow, index" />
      <meta property="og:url"/>
    </Head>
  )
}

const Wrapper: FC<{ children : ReactNode }> = ({ children }) => {
  const { data : sesh } = useSession()

  if (!sesh)
    return (
      <>
        <WrapperHeader />
        <div className="relative flex h-screen w-screen bg-red-400 flex-col justify-between">
          <div className="flex min-h-0 flex-1 flex-col">
            <NavBar />
            <PleaseLogin />
          </div>
        </div>
      </>
  )
  
  return (
    <> 
      <WrapperHeader />
      <div className="relative flex h-screen w-screen bg-red-400 flex-col justify-between">
        <div className="flex min-h-0 flex-1 flex-col">
          <NavBar />
          { children }
        </div>
      </div>
    </>
  )
}

export default Wrapper