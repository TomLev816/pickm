import { prisma } from "../src/server/db/client";

interface TeamEspn {
    id : string
    location : string
    name : string
    abbreviation : string
    displayName : string
    logos : {href:string}[]
}

interface TeamList {
    items : {$ref:string}[]
}

const doBackfill = async () => {
    const fetch = require('node-fetch');

    let count = 0
    let teamsArray = []
    async function fillDb(teamData: TeamEspn) {
        count += 1
        const formatedTeam = {
            'id': parseInt(teamData.id),
            'city': teamData.location,
            'name': teamData.name,
            'abbreviation': teamData.abbreviation,
            'displayName': teamData.displayName,
            'logo': teamData.logos[0]?.href
        }
        teamsArray.push(formatedTeam);
    }
    
    async function fetchTeamData<T>(teamUrl: String):Promise<T> {
        return fetch(teamUrl as string).then((res:any) => res.json())
    }

    async function fetchTeamList<T> (teamListUrl: String):Promise<T> {
        return fetch(teamListUrl as string).then((res:any) => res.json())
    }
    
    // Script Start
    let teamUrls = await fetchTeamList<TeamList>('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams?limit=32')
        .then((teamData) => {
            return teamData.items.map((teamUrl) => teamUrl.$ref)
        })

    for (const teamUrl of teamUrls) {
        const teamData = await fetchTeamData<TeamEspn>(teamUrl)
        fillDb(teamData)
    }

    // console.log('teamsArray', teamsArray);
    // const nflteams = await prisma.team.createMany({
    //     data: teamsArray,
    //   })

    // console.log('nflteams', nflteams);
  };

  doBackfill();