import { useEffect, useState } from 'react';
import { GameList } from '../schema/game.schema';
import { TeamSchema } from '../schema/team.schema';
import { VoteSchema } from '../schema/vote.schema';
import { CallerPage } from '../schema/global.schema';
import { trpc } from '../utils/trpc';

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

const TeamInfoContainer: React.FC<{ voteForArray: [], callerPage: CallerPage, isWinner: boolean, handleOnClick: any, teamInfo: TeamSchema, isFinal: boolean, score: number | null, selectedTeamId: number | undefined }> = ({ callerPage, handleOnClick, teamInfo, isFinal, score, selectedTeamId, isWinner, voteForArray }) => {
  const checkVotedFor = (vote: VoteSchema) => {
    return vote.teamId === teamInfo.id;
  }

  console.log('voteForArray', voteForArray);
  const votesForTeam = voteForArray?.filter(checkVotedFor)
  console.log('votesForTeam', votesForTeam);


  return (
    <div onClick={e => handleOnClick(teamInfo.id)} className={`block p-6 rounded-lg shadow-lg ${callerPage === CallerPage.MakePicks && selectedTeamId && selectedTeamId === teamInfo.id ? "bg-green-600" : "bg-white hover:bg-blue-300"}  max-w-sm  w-full`}>
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <div className="text-gray-700 text-base mb-4">
        {isFinal ? score : null}
      </div>
      {callerPage === CallerPage.ViewPicks ?
        <ShowVotesFor votesForTeam={votesForTeam} />
        : null}
    </div>
  )
}

const GameContainer: React.FC<{ gameInfo: GameList, callerPage: CallerPage }> = ({ gameInfo, callerPage }) => {
  const [gameSpread, setgameSpread] = useState(0)
  const [selectedTeamId, setselectedTeamId] = useState<number | undefined>()
  const [voteForArray, setvoteForArray] = useState<[]>([])

  trpc.useQuery(["votes.get-game-vote-list", { gameId: gameInfo.id }], {
    onSuccess(data: []) {
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

  const handleOnClick = (teamInfoId: number) => {
    const isAfterGame = gameInfo.date && new Date() > gameInfo.date;

    // Dont allow change in pick after game started
    if (isAfterGame || callerPage === CallerPage.ViewPicks || gameInfo.isFinal || teamInfoId === selectedTeamId) return

    setselectedTeamId(teamInfoId)
    mutate({ gameId: gameInfo.id, teamId: teamInfoId });
    // TODO: unSetSelected team if mutate fails
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