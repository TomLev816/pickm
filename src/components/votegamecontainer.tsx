import { useEffect, useState } from 'react';
import { GameList } from '../schema/game.schema';
import { TeamSchema } from '../schema/team.schema';
import { trpc } from '../utils/trpc';

const TeamInfoVoteContainer: React.FC<{ teamInfo: TeamSchema, isFinal: boolean, score: number | null, voteForArray: [] }> = ({ teamInfo, isFinal, score, voteForArray }) => {
  let votesFor = 0
  voteForArray.map((team: { _count: number, teamId: number }) => {
    if (team && team?.teamId === teamInfo.id) {
      votesFor = team._count
    }
  })
  return (
    <div className={`block p-6 rounded-lg shadow-lg bg-white hover:bg-blue-300 max-w-sm  w-full`}>
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <p className="text-gray-700 text-base mb-4">
        {votesFor} Votes
      </p>
    </div>
  )
}


const VoteGameContainer: React.FC<{ gameInfo: GameList }> = ({ gameInfo }) => {
  const [gameSpread, setgameSpread] = useState(0)
  const [voteForArray, setvoteForArray] = useState<[]>([])

  const { data } = trpc.useQuery(["votes.get-game-vote-count", { gameId: gameInfo.id }], {
    onSuccess(data: any) {
      setvoteForArray(data);
    },
  });

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
  }, [gameInfo]);


  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-8 mb-8 rounded-lg shadow-lg bg-purple-400 w-2/5 ">
      <div >
        Date: {gameInfo.date.toLocaleString()}
      </div>
      <div className="flex justify-center w-4/5">
        <TeamInfoVoteContainer
          teamInfo={gameInfo.home}
          isFinal={gameInfo.isFinal}
          score={gameInfo.homeScore}
          voteForArray={voteForArray}
        />
        <div className="p-8 "></div>
        <TeamInfoVoteContainer
          teamInfo={gameInfo.away}
          isFinal={gameInfo.isFinal}
          score={gameInfo.awayScore}
          voteForArray={voteForArray}
        />
      </div>
      <div>Spread: {gameSpread ? `${gameInfo.home.name} ${gameSpread > 0 ? "+" + gameSpread : gameSpread} ` : "No Spread Yet"}</div>
    </div>
  )
}

export default VoteGameContainer