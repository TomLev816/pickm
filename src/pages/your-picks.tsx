import Wrapper from '../components/wrapper';
import { NextPage } from 'next';
import WeekSelecter from '../components/weekselecter';
import WeekContainer from '../components/weekcontainer';
import { useState } from 'react';
import { CallerPage } from '../schema/global.schema';

const YourPicks: NextPage = () => {
  const [week, setWeek] = useState(7);
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
          callerPage={CallerPage.MakePicks}
          activeWeek={week}
        />
      </>
    </Wrapper>
  )
}

export default YourPicks