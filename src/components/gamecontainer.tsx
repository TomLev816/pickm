import { useEffect, useState } from 'react';
import { GameList } from '../schema/game.schema';
import { TeamSchema } from '../schema/team.schema';
import { voteSchema, VoteSchema } from '../schema/vote.schema';
import { CallerPage } from '../schema/global.schema';
import { trpc } from '../utils/trpc';


const ShowSpread: React.FC<{ gameSpread: number, gameInfo: GameList }> = ({ gameSpread, gameInfo }) => {
  if (gameSpread) {
    return <div className='text-lg'> {`Spread: ${gameInfo.home.name} ${gameSpread > 0 ? "+" + gameSpread : gameSpread}`} </div>
  }
  return (
    <div className='text-lg'>No Spread Yet</div>
  )
}
const ShowVotesFor: React.FC<{ votesForTeam: VoteSchema[] }> = ({ votesForTeam }) => {
  return (
    <div className="text-gray-700">
      <h3>{votesForTeam.length} Votes</h3>
      {votesForTeam.map((vote: VoteSchema) => (
        <li key={vote.User.id}>{vote.User.name}</li>
      ))}
    </div>
  )
}

const ShowTeamScore: React.FC<{ gameSpread: number, isHome: boolean, score: number }> = ({ gameSpread, isHome, score }) => {
  return (
    <div>
      <div className='text-lg'>
        Score With Spread: {isHome ? score + gameSpread : score}
      </div>
      <div>
        Score: {score}
      </div>
    </div>
  )
}

const TeamInfoContainer: React.FC<{ hasMoreVotes: boolean, gameSpread: number, voteForArray: VoteSchema[], callerPage: CallerPage, isHome: boolean, handleOnClick: any, teamInfo: TeamSchema, isFinal: boolean, score: number | null, selectedTeamId: number | undefined }> = ({ gameSpread, callerPage, handleOnClick, teamInfo, isFinal, score, selectedTeamId, isHome, voteForArray, hasMoreVotes }) => {
  return (
    <div onClick={e => handleOnClick(teamInfo.id)} className={`block p-6 rounded-lg shadow-lg ${callerPage === CallerPage.ViewPicks ? hasMoreVotes ? "bg-selectedTeamInfo" : "bg-teamInfo" : callerPage === CallerPage.MakePicks && selectedTeamId && selectedTeamId === teamInfo.id ? "bg-selectedTeamInfo" : "bg-teamInfo hover:bg-hoverButtons"}  max-w-sm  w-full`}>
      <h5 className="text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <div className="mb-2">
        {isFinal && score ?
          <ShowTeamScore score={score} isHome={isHome} gameSpread={gameSpread} />
          : null
        }
      </div>
      {
        callerPage === CallerPage.ViewPicks ?
          <ShowVotesFor votesForTeam={voteForArray} />
          : null
      }
    </div >
  )
}

const GameContainer: React.FC<{ gameInfo: GameList, callerPage: CallerPage }> = ({ gameInfo, callerPage }) => {
  const [gameSpread, setgameSpread] = useState(0)
  const [pickedWinner, setpickedWinner] = useState<boolean>(false)
  const [selectedTeamId, setselectedTeamId] = useState<number | undefined>()
  const [voteForArray, setvoteForArray] = useState<[]>([])


  trpc.useQuery(["votes.get-game-vote-list", { gameId: gameInfo.id }], {
    onSuccess(data: []) {
      setvoteForArray(data);
    },
  });

  trpc.useQuery(["votes.get-game-user-vote", { gameId: gameInfo.id }], {
    onSuccess(data: VoteSchema) {
      setselectedTeamId(data?.teamId)
      checkIfPickedWinner(data?.teamId, gameInfo)
    },
  });

  const votesForHomeTeam: VoteSchema[] = voteForArray.filter((vote: VoteSchema) => vote.teamId === gameInfo.home.id)
  const votesForAwayTeam: VoteSchema[] = voteForArray.filter((vote: VoteSchema) => vote.teamId === gameInfo.away.id)
  const homeTeamMoreVotes = votesForHomeTeam.length > votesForAwayTeam.length
  const awayTeamMoreVotes = votesForHomeTeam.length < votesForAwayTeam.length

  const getWinnerId = (awayScore: number, homeScore: number) => {
    if (awayScore > homeScore + gameSpread) {
      return gameInfo.away.id
    }
    return gameInfo.home.id
  }

  const checkIfPickedWinner = (teamId: number, gameInfo: GameList) => {
    if (teamId && gameInfo.isFinal && gameInfo.awayScore && gameInfo.homeScore) {
      if (callerPage === CallerPage.MakePicks) {
        setpickedWinner(teamId === getWinnerId(gameInfo.awayScore, gameInfo.homeScore))
      } else if (callerPage === CallerPage.ViewPicks) {
        if (homeTeamMoreVotes) {
          setpickedWinner(gameInfo.home.id === getWinnerId(gameInfo.awayScore, gameInfo.homeScore))
        } else if (awayTeamMoreVotes) {
          setpickedWinner(gameInfo.away.id === getWinnerId(gameInfo.awayScore, gameInfo.homeScore))
        }

      }
    }
  }

  const { mutate } = trpc.useMutation(['votes.add-vote']);

  useEffect(() => {
    const oddUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameInfo.id}/competitions/${gameInfo.id}/odds`
    fetch(oddUrl)
      .then(res => res.json())
      .then(data => {
        if (data.items[0] && data.items[0].spread) {
          setgameSpread(data.items[0].spread)
          return
        } setgameSpread(0)
      })
  }, [gameInfo])

  const handleOnClick = (teamInfoId: number) => {
    const isAfterGame = gameInfo.date && new Date() > gameInfo.date;

    // Dont allow change in pick after game started
    if (isAfterGame || callerPage === CallerPage.ViewPicks || gameInfo.isFinal || teamInfoId === selectedTeamId) return

    setselectedTeamId(teamInfoId)
    mutate({ gameId: gameInfo.id, teamId: teamInfoId });
    // TODO: unSetSelected team if mutate fails
  }


  return (
    <div className={`flex flex-col items-center justify-center pt-4 pb-8 mb-8 rounded-lg shadow-lg w-2/5 ${gameInfo.isFinal ? pickedWinner ? "bg-winnerTeamInfo" : "bg-loserTeamInfo" : "bg-gameBg"}  `}>
      <div >
        Date: {gameInfo.date?.toLocaleString()}
      </div>
      <div className="flex justify-center w-4/5">
        <TeamInfoContainer
          teamInfo={gameInfo.home}
          gameSpread={gameSpread}
          isFinal={gameInfo.isFinal}
          isHome={true}
          score={gameInfo.homeScore}
          selectedTeamId={selectedTeamId}
          handleOnClick={handleOnClick}
          voteForArray={votesForHomeTeam}
          hasMoreVotes={homeTeamMoreVotes}
          callerPage={callerPage}
        />
        <div className="p-8 "></div>
        <TeamInfoContainer
          teamInfo={gameInfo.away}
          gameSpread={gameSpread}
          isFinal={gameInfo.isFinal}
          isHome={false}
          score={gameInfo.awayScore}
          selectedTeamId={selectedTeamId}
          handleOnClick={handleOnClick}
          voteForArray={votesForAwayTeam}
          hasMoreVotes={awayTeamMoreVotes}
          callerPage={callerPage}
        />
      </div>
      <ShowSpread gameSpread={gameSpread} gameInfo={gameInfo} />
    </div>
  )
}

export default GameContainer