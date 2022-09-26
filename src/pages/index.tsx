import type { NextPage } from "next";
import { signIn, useSession } from 'next-auth/react';
import Head from "next/head";
import Wrapper from "../components/wrapper";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { data: session } = useSession()
  
  return (
    <Wrapper title='Pickm - Home'>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-400">
        {session && (
          <h3 className="self-start pb-2 text-4xl font-bold bold-text">
            Home
          </h3>
        )}
        {!session && (
          <div>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              onClick={() => signIn()}>Sign in</button>
        </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Home;

