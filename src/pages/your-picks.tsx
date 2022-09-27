import Wrapper from '../components/wrapper';
import { NextPage } from 'next';
import WeekSelecter from '../components/weekselecter';
import { useState } from 'react';

const PastPicks: NextPage = () => {

  const [week, setWeek] = useState(4); 
  const onWeekChange = (weekNum: number) => {
    setWeek(weekNum);
  }
  
  return (
    <Wrapper >
      <div className="flex flex-col items-center justify-center">
        <div className='pt-10'></div>
        <WeekSelecter 
          activeWeek={week} 
          onWeekChange={onWeekChange}
        /> 
        <div className=" pb-2 text-4xl font-bold bold-text">
          Week {week} Picks
        </div>
      </div>
    </Wrapper>
  )
}

export default PastPicks