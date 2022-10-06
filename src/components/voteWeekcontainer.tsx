import { useState } from 'react';
import { trpc } from '../utils/trpc';
import GameContainer from './gamecontainer';
import { GameList } from '../schema/game.schema'
import VoteGameContainer from './votegamecontainer';


const VoteWeekContainer: React.FC<{ activeWeek: number }> = ({ activeWeek }) => {
  const [gamesList, setGamesList] = useState<GameList[]>([])
  const { isLoading } = trpc.useQuery(["games.getWeekOfGames", { activeWeekNum: activeWeek }], {
    onSuccess(data: GameList[]) {
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
        Votes for Week {activeWeek}
      </div>
      {gamesList.map((game, i) => <VoteGameContainer key={i} gameInfo={game} />)}
    </div>
  )
}

export default VoteWeekContainer
