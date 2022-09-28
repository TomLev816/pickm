import Wrapper from '../components/wrapper';
import { NextPage } from 'next';
import WeekSelecter from '../components/weekselecter';
import WeekContainer from '../components/weekcontainer';
import { useState } from 'react';

const YourPicks: NextPage = () => {

  const [week, setWeek] = useState(4);
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
        <WeekContainer
          activeWeek={week}
        />
      </>
    </Wrapper>
  )
}

export default YourPicks