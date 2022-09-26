import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import Wrapper from '../components/wrapper';

const AllPicks: FC<{
}> = ({}) => {

  return (
    <Wrapper title='Pickm - All Picks'>
      <div className="flex flex-col items-center justify-center">
        <h3 className="self-start pb-2 text-4xl font-bold bold-text">
          All Picks
        </h3>
      </div>
    </Wrapper>
  )
}

export default AllPicks