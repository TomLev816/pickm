import { useState } from 'react';
import { trpc } from '../utils/trpc';
import GameContainer from './gamecontainer';

const WeekContainer: React.FC<{ activeWeek: number }> = ({ activeWeek }) => {
  const [gamesList, setGamesList] = useState([])
  const { isLoading } = trpc.useQuery(["games.getWeekOfGames", { activeWeekNum: activeWeek }], {
    onSuccess(data) {
      setGamesList(data)
    },
  });

  if (isLoading) {
    return (
      <div>LOADING....</div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className=" pb-2 text-4xl font-bold bold-text">
        Your Picks for Week {activeWeek}
      </div>
      {gamesList.map(game => <GameContainer gameInfo={game} />)}

    </div>
  )
}

export default WeekContainer
