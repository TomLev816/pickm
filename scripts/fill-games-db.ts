// import { any, boolean, object } from 'zod';
import { prisma } from "../src/server/db/client";

interface WeekData {
  events : {
    id: string;
    date: string;
    status: { 
      type: {completed: boolean}
    };
    competitions: {
      homeAway: "home"|"away";
      score: string;
      winner: boolean;
      team: {id: string};
    }[];
  }[];
}

const doBackfill = async () => {

    const fetch = require('node-fetch');
    let count = 0
    let gamesArray :any = []
    let WEEK_NUM = 0


    const fill_db = (data: any) => {
      
      const events = data.events
      events.map((game: any) => {

        const formattedGame = {
          'id': parseInt(game.id),
          'weekNum': WEEK_NUM,
          'date': new Date(game.date),
          'isFinal': game.status.type.completed,
          'homeId': 0,
          'homeIsWinner': false,
          'homeScore': 0,
          'awayId': 0,
          'awayIsWinner': false,
          'awayScore': 0,
        }

        const teams = game.competitions[0].competitors
        teams.map((team : any) => {
          const isHome = team.homeAway === 'home'
          if (isHome){
            formattedGame.homeId = parseInt(team.team.id)
            formattedGame.homeScore = parseInt(team.score)
            formattedGame.homeIsWinner = team.winner
          } else {
            formattedGame.awayId = parseInt(team.team.id)
            formattedGame.awayIsWinner = team.winner
            formattedGame.awayScore = parseInt(team.score)
          }
        })
        // count += 1
        gamesArray.push(formattedGame)
      });

    }

  async function fetchWeekData<T>(weekUrl: String):Promise<T> {
      return fetch(weekUrl as string).then((res:any) => res.json())
  }

  for (let i =1; i <= 18; i++) {
    let weekUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${i}`
    WEEK_NUM = i
    const weekData = await fetchWeekData<WeekData>(weekUrl)
    fill_db(weekData)
  }
  
  console.log('gamesArray', gamesArray);
  const nflgames = await prisma.game.createMany({
      data: gamesArray,
    })
  console.log('nflteams', nflgames);
};
  
  doBackfill();
