import { useState } from 'react';
import { trpc } from '../utils/trpc';
import GameContainer from './gamecontainer';
import { GameList } from '../schema/game.schema'
import { CallerPage } from '../schema/global.schema';

// Odds
// https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401437748/competitions/401437748/odds

const MakePickContainer: React.FC<{ gamesList: GameList[], activeWeek: number, callerPage: CallerPage }> = ({ gamesList, activeWeek, callerPage }) => {
  return (
    <>
      <div className=" pb-2 text-4xl font-bold bold-text">
        Your Picks for Week {activeWeek}
      </div>
      {gamesList.map((game, i) => <GameContainer key={i} gameInfo={game} callerPage={callerPage} />)}
    </>
  )
}

const ViewVotesContainer: React.FC<{ gamesList: GameList[], activeWeek: number, callerPage: CallerPage }> = ({ gamesList, activeWeek, callerPage }) => {
  return (
    <>
      <div className=" pb-2 text-4xl font-bold bold-text">
        Votes for Week {activeWeek}
      </div>
      {gamesList.map((game, i) => <GameContainer key={i} gameInfo={game} callerPage={callerPage} />)}
    </>
  )
}



const WeekContainer: React.FC<{ activeWeek: number, callerPage: CallerPage }> = ({ activeWeek, callerPage }) => {
  const { data, isSuccess, error, isLoading } = trpc.useQuery(["games.getWeekOfGames", { activeWeekNum: activeWeek }], {
    onSuccess(data: GameList[]) {
      console.log(data);
    }
  });

  if (isLoading || !data) {
    return (
      <div>LOADING....</div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center">
        {callerPage === CallerPage.MakePicks ?
          <MakePickContainer gamesList={data} activeWeek={activeWeek} callerPage={callerPage} /> :
          <ViewVotesContainer gamesList={data} activeWeek={activeWeek} callerPage={callerPage} />
        }
      </div>
    )
  }

  return (
    <div>Error</div>
  )
}

export default WeekContainer
