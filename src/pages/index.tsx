import type { GetServerSidePropsContext, NextPage } from "next";
import Wrapper from "../components/wrapper";
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["hello.helloTom", { text: "from tRPC" }]);
  
  return (
    <Wrapper>
      <div>
        Home
      </div>
    </ Wrapper>
  );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getServerAuthSession(ctx),
    },
  };
};