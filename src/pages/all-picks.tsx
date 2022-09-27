import Wrapper from '../components/wrapper';
import { NextPage } from 'next';

const AllPicks: NextPage = () => {

  return (
    <Wrapper >
      <div className="flex flex-col items-center justify-center">
        <h3 className="self-start pb-2 text-4xl font-bold bold-text">
          All Picks
        </h3>
      </div>
    </Wrapper>
  )
}

export default AllPicks