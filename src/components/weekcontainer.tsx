import { trpc } from '../utils/trpc';
import GameContainer from './gamecontainer';

const WeekContainer: React.FC<{ activeWeek: number }> = ({ activeWeek }) => {
  console.log(activeWeek);
  // const { data, isLoading } = trpc.useQuery(["teams.helloTeams", { text: "from tRPC" }]);
  const { data, isLoading } = trpc.useQuery(["teams.getAllTeams"]);
  console.log(data)

  if (isLoading) {
    return (
      <div>LOADING....</div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className=" pb-2 text-4xl font-bold bold-text">
        Your Picks for Week {activeWeek}
      </div>
      <GameContainer />
      <GameContainer />
      <GameContainer />
      <GameContainer />
      <GameContainer />
    </div>
  )
}

export default WeekContainer
