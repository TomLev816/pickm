
const WeekSelecterCard: React.FC<{
  weekName: string,
  weekNum: number,
  activeWeek: number,
  onWeekChange: (weekNum: number) => void 
}> = ({weekName, weekNum, activeWeek, onWeekChange}) => {
  const active = weekNum === activeWeek
    
  return (
    <li className="page-item">
      <button
        className={active ? "relative block py-1.5 px-3 border-0 bg-blue-600 outline-none transition-all duration-300 rounded text-white hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md" : "relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 text-gray-800 hover:text-gray-800 hover:bg-gray-400 hover:bg-opacity-40"}
        name={weekName}
        onClick={() => onWeekChange(weekNum)}
        key={weekNum}
        >
        {weekName}
      </button>
    </li>
  )
}

const WeekSelecter: React.FC<{activeWeek: number, onWeekChange: (weekNum: number) => void}> = ({activeWeek, onWeekChange}) => {
  console.log(activeWeek);
  
  return (
    <div className="flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          {Array.from(Array(18).keys()).map(wkNum => 
            <WeekSelecterCard 
              weekName={`Week ${wkNum + 1}`}
              weekNum={wkNum + 1}
              activeWeek={activeWeek} 
              onWeekChange={onWeekChange}
            />
          )}
        </ul>
      </nav>
    </div>
  )
}

export default WeekSelecter


