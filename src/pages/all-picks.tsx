import Wrapper from '../components/wrapper';
import { NextPage } from 'next';
import WeekSelecter from '../components/weekselecter';
import { useState } from 'react';
import VoteWeekContainer from '../components/voteWeekcontainer';

const AllPicks: NextPage = () => {
  const [week, setWeek] = useState(5);
  const onWeekChange = (weekNum: number) => {
    setWeek(weekNum);
  }

  return (
    <Wrapper >
      <>
        <div className='pt-10'></div>
        <WeekSelecter
          activeWeek={week}
          onWeekChange={onWeekChange}
        />
        <VoteWeekContainer
          activeWeek={week}
        />
      </>
    </Wrapper>
  )
}

export default AllPicks