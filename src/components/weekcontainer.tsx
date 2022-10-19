import { useEffect, useState } from 'react';
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
  const [getNewGameData, setgetNewGameData] = useState(false)
  const { mutate } = trpc.useMutation(['games.finalizeGame']);

  const { data, isSuccess, error, isLoading } = trpc.useQuery(["games.getWeekOfGames", { activeWeekNum: activeWeek }], {
    onSuccess(data: GameList[]) {
      let mnf = data.at(-1)
      if (mnf?.date && new Date() > mnf.date && !mnf?.isFinal) {
        setgetNewGameData(true);
      } else {
        setgetNewGameData(false);
      }
    },
  });

  useEffect(() => {
    if (getNewGameData) {
      let weekUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${activeWeek}`
      fetch(weekUrl)
        .then(res => res.json())
        .then(data => {
          if (data) {
            data.events.map((gameInfo: any) => {
              const formattedGame = {
                'id': parseInt(gameInfo.id),
                'isFinal': gameInfo.status.type.completed,
                'homeIsWinner': gameInfo.competitions[0].competitors[0].winner,
                'homeScore': parseInt(gameInfo.competitions[0].competitors[0].score),
                'awayIsWinner': gameInfo.competitions[0].competitors[1].winner,
                'awayScore': parseInt(gameInfo.competitions[0].competitors[1].score),
              }

              mutate({
                gameId: formattedGame.id,
                isFinal: formattedGame.isFinal,
                homeIsWinner: formattedGame.homeIsWinner,
                homeScore: formattedGame.homeScore,
                awayIsWinner: formattedGame.awayIsWinner,
                awayScore: formattedGame.awayScore,
              });
            })
          }
        })
    }
  }, [getNewGameData])

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
