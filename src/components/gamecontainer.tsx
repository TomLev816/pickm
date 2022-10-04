import { useEffect, useState } from 'react';

const TeamInfoContainer: React.FC<{ teamInfo: any, isFinal: boolean, score: number }> = ({ teamInfo, isFinal, score }) => {
  // Game odds
  // https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401437748/competitions/401437748/odds

  return (
    <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm hover:bg-blue-300 w-full">
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        {teamInfo.city}  {teamInfo.name}
      </h5>
      <p className="text-gray-700 text-base mb-4">
        {isFinal ? score : null}
      </p>
    </div>
  )
}


const GameContainer: React.FC<{ gameInfo: any }> = ({ gameInfo }) => {
  console.log(gameInfo);

  const [gameSpread, setgameSpread] = useState(0)

  useEffect(() => {
    const oddUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameInfo.id}/competitions/${gameInfo.id}/odds`
    fetch(oddUrl)
      .then(res => res.json())
      .then(data => setgameSpread(data.items[0].spread))
  }, [gameInfo]);

  console.log(gameSpread);

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
        />
        <div className="p-8 "></div>
        <TeamInfoContainer
          teamInfo={gameInfo.away}
          isFinal={gameInfo.isFinal}
          score={gameInfo.awayScore}
        />
      </div>
      <div>Spread: {gameSpread ? gameSpread : "No Spread Yet"}</div>
    </div>
  )
}

export default GameContainer