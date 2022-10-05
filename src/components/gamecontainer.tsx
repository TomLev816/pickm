import { useEffect, useState } from 'react';
import { GameList } from '../schema/game.schema';
import { TeamSchema } from '../schema/team.schema';
import { VoteSchema } from '../schema/vote.schema';
import { trpc } from '../utils/trpc';

const TeamInfoContainer: React.FC<{ handleOnClick: any, teamInfo: TeamSchema, isFinal: boolean, score: number | null, voteStatus: VoteSchema | undefined }> = ({ handleOnClick, teamInfo, isFinal, score, voteStatus }) => {
  return (
    <div onClick={e => handleOnClick(teamInfo)} className={`block p-6 rounded-lg shadow-lg ${voteStatus?.teamId === teamInfo.id ? "bg-green-600" : "bg-white"}  max-w-sm hover:bg-blue-300 w-full`}>
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <p className="text-gray-700 text-base mb-4">
        {isFinal ? score : null}
      </p>
    </div>
  )
}


const GameContainer: React.FC<{ gameInfo: GameList }> = ({ gameInfo }) => {
  console.log(gameInfo.id);

  const { mutate } = trpc.useMutation(['votes.add-vote']);
  const [gameSpread, setgameSpread] = useState(0)
  const [voteStatus, setvoteStatus] = useState<VoteSchema | undefined>()

  const { status, data, isLoading } = trpc.useQuery(["votes.get-game-user-vote", { gameId: gameInfo.id }], {
    onSuccess(data: VoteSchema) {
      setvoteStatus(data)
    },
  });

  useEffect(() => {
    const oddUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameInfo.id}/competitions/${gameInfo.id}/odds`
    fetch(oddUrl)
      .then(res => res.json())
      .then(data => setgameSpread(data.items[0].spread))
  }, [gameInfo]);

  const handleOnClick = (teamInfo: TeamSchema) => {
    if (gameInfo.isFinal) return
    mutate({ gameId: gameInfo.id, teamId: teamInfo.id, id: voteStatus?.id });
  }
  console.log(voteStatus);

  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-8 mb-8 rounded-lg shadow-lg bg-purple-400 w-2/5 ">
      <div >
        Date: {gameInfo.date.toLocaleString()}
      </div>
      <div className="flex justify-center w-4/5">
        <TeamInfoContainer
          teamInfo={gameInfo.home}
          isFinal={gameInfo.isFinal}
          score={gameInfo.homeScore}
          voteStatus={voteStatus}
          handleOnClick={handleOnClick}
        />
        <div className="p-8 "></div>
        <TeamInfoContainer
          teamInfo={gameInfo.away}
          isFinal={gameInfo.isFinal}
          score={gameInfo.awayScore}
          voteStatus={voteStatus}
          handleOnClick={handleOnClick}
        />
      </div>
      <div>Spread: {gameSpread ? `${gameInfo.home.name} ${gameSpread} ` : "No Spread Yet"}</div>
    </div>
  )
}

export default GameContainer