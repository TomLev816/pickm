import { any, object } from 'zod';
import { prisma } from "../src/server/db/client";


const doBackfill = async () => {

    const fetch = require('node-fetch');
    const WEEK_NUM = 1


    const fill_db = (data: any) => {
      
      const games = data.events
      games.map((game: any) => {

        const gameObj = {
          'id': game.id,
          'weekNum': WEEK_NUM,
          'date': game.date,
          'isFinal': game.status.type.completed,
          'homeId': '',
          'homeIswinner': '',
          'HomeScore': '',
          'awayId': '',
          'awayIsWinner': '',
          'awayScore': '',
        }
        


        console.log("GAME");
        const teams = game.competitions[0].competitors
        teams.map((team : any) => {
          const isHome = team.homeAway === 'home'
          if (isHome){
            gameObj.homeId = team.team.id
            gameObj.HomeScore = team.score
            gameObj.homeIswinner = team.winner
          } else {
            gameObj.awayId = team.team.id
            gameObj.awayIsWinner = team.winner
            gameObj.awayScore = team.score
          }
        })
        console.log(gameObj)
      });

    }

    fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${WEEK_NUM}`)
        .then((res : any) => res.json())
        .then((data: any) => fill_db(data))
  };
  
  doBackfill();
