const TeamInfoContainer = () => {
  return (
    <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm hover:bg-blue-300 w-full">
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        Team Name
      </h5>
      <p className="text-gray-700 text-base mb-4">
        3 - 1
      </p>
    </div>
  )
}

const GameContainer: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-8 mb-8 rounded-lg shadow-lg bg-purple-400 w-2/5 ">
      <div >
        Game Date
      </div>
      <div className="flex justify-center w-4/5">
        <TeamInfoContainer />
        <div className="p-8 "></div>
        <TeamInfoContainer />
      </div>
    </div>
  )
}

export default GameContainer