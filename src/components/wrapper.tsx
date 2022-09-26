import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import Navbar from './navbar';

const Wrapper: FC<{
  children: ReactNode
  title: string
}> = ({title, children}) => {

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="follow, index" />
        <meta property="og:url"/>
      </Head>
      <div>
        <Navbar />
      </div>
      <main className='flex flex-col items-center justify-center min-h-screen bg-red-400'>
        {children}
      </main>
      {/* <Footer> */}
    </>
  )
}

export default Wrapper