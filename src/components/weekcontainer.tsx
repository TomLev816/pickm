import { useState } from 'react';
import { trpc } from '../utils/trpc';
import GameContainer from './gamecontainer';
import { GameList } from '../schema/game.schema'
import VoteGameContainer from './votegamecontainer';

// Odds
// https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401437748/competitions/401437748/odds

const MakePickContainer: React.FC<{ gamesList: GameList[], activeWeek: number }> = ({ gamesList, activeWeek }) => {
  return (
    <>
      <div className=" pb-2 text-4xl font-bold bold-text">
        Your Picks for Week {activeWeek}
      </div>
      {gamesList.map((game, i) => <GameContainer key={i} gameInfo={game} />)}
    </>
  )
}

const ViewVotesContainer: React.FC<{ gamesList: GameList[], activeWeek: number }> = ({ gamesList, activeWeek }) => {
  return (
    <>
      <div className=" pb-2 text-4xl font-bold bold-text">
        Votes for Week {activeWeek}
      </div>
      {gamesList.map((game, i) => <VoteGameContainer key={i} gameInfo={game} />)}
    </>
  )
}



const WeekContainer: React.FC<{ activeWeek: number, callerPage: string }> = ({ activeWeek, callerPage }) => {
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
      {callerPage === 'your-picks' ?
        <MakePickContainer gamesList={gamesList} activeWeek={activeWeek} /> :
        <ViewVotesContainer gamesList={gamesList} activeWeek={activeWeek} />
      }
    </div>
  )
}

export default WeekContainer
