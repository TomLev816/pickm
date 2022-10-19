import { useEffect, useState } from 'react';
import { GameList } from '../schema/game.schema';
import { TeamSchema } from '../schema/team.schema';
import { VoteSchema } from '../schema/vote.schema';
import { CallerPage } from '../schema/global.schema';
import { trpc } from '../utils/trpc';

const TeamInfoContainer: React.FC<{ voteForArray: [], callerPage: CallerPage, isWinner: boolean, handleOnClick: any, teamInfo: TeamSchema, isFinal: boolean, score: number | null, selectedTeamId: number | undefined }> = ({ callerPage, handleOnClick, teamInfo, isFinal, score, selectedTeamId, isWinner, voteForArray }) => {
  let votesFor = 0
  voteForArray.map((team: { _count: number, teamId: number }) => {
    if (team && team?.teamId === teamInfo.id) {
      votesFor = team._count
    }
  })

  return (
    <div onClick={e => handleOnClick(teamInfo.id)} className={`block p-6 rounded-lg shadow-lg ${callerPage === CallerPage.MakePicks && selectedTeamId && selectedTeamId === teamInfo.id ? "bg-green-600" : "bg-white hover:bg-blue-300"}  max-w-sm  w-full`}>
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <p className="text-gray-700 text-base mb-4">
        {isFinal ? score : null}
      </p>
      {callerPage === CallerPage.ViewPicks ? <p className="text-gray-700 text-base mb-4">
        {votesFor} Votes
      </p> : null}
    </div>
  )
}

const GameContainer: React.FC<{ gameInfo: GameList, callerPage: CallerPage }> = ({ gameInfo, callerPage }) => {
  const [gameSpread, setgameSpread] = useState(0)
  const [selectedTeamId, setselectedTeamId] = useState<number | undefined>()
  const [voteForArray, setvoteForArray] = useState<[]>([])

  trpc.useQuery(["votes.get-game-vote-count", { gameId: gameInfo.id }], {
    onSuccess(data: any) {
      setvoteForArray(data);
    },
  });

  trpc.useQuery(["votes.get-game-user-vote", { gameId: gameInfo.id }], {
    onSuccess(data: VoteSchema) {
      if (data) setselectedTeamId(data.teamId)
    },
  });

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


  useEffect(() => {
    if (selectedTeamId) {
      mutate({ gameId: gameInfo.id, teamId: selectedTeamId });
    }
  }, [selectedTeamId])

  const handleOnClick = (teamInfoId: number) => {
    const isAfterGame = gameInfo.date && new Date() > gameInfo.date;

    if (isAfterGame || callerPage === CallerPage.ViewPicks || gameInfo.isFinal || teamInfoId === selectedTeamId) return
    setselectedTeamId(teamInfoId)
  }


  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-8 mb-8 rounded-lg shadow-lg bg-purple-400 w-2/5 ">
      <div >
        Date: {gameInfo.date?.toLocaleString()}
      </div>
      <div className="flex justify-center w-4/5">
        <TeamInfoContainer
          teamInfo={gameInfo.home}
          isFinal={gameInfo.isFinal}
          isWinner={gameInfo.homeIsWinner ? true : false}
          score={gameInfo.homeScore}
          selectedTeamId={selectedTeamId}
          handleOnClick={handleOnClick}
          voteForArray={voteForArray}
          callerPage={callerPage}
        />
        <div className="p-8 "></div>
        <TeamInfoContainer
          teamInfo={gameInfo.away}
          isFinal={gameInfo.isFinal}
          isWinner={gameInfo.awayIsWinner ? true : false}
          score={gameInfo.awayScore}
          selectedTeamId={selectedTeamId}
          handleOnClick={handleOnClick}
          voteForArray={voteForArray}
          callerPage={callerPage}
        />
      </div>
      <div>Spread: {gameSpread ? `${gameInfo.home.name} ${gameSpread > 0 ? "+" + gameSpread : gameSpread} ` : "No Spread Yet"}</div>
    </div>
  )
}

export default GameContainer