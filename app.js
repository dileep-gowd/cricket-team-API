const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
     *
    FROM
        cricket_team;`;
  const playersArr = await db.all(getPlayersQuery);
  response.send(playersArr);
});

//API 2
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const addPlayerQuery = `
    INSERT INTO
        cricket_team (player_name, jersey_number, role)
    VALUES
        (
            ${playerName},
            ${jerseyNumber},
            ${role}
        );`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerInfo = `
    SELECT 
        *
    FROM 
        cricket_table
    WHERE 
        player_id = ${playerId};`;
  const dbPlayerInfo = await db.get(playerInfo);
  response.send(dbPlayerInfo);
});

//API 4
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateQuery = `
    UPDATE 
        cricket_table
    SET
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE 
        player_id = ${playerId};`;
  const dbQuery = await db.run(updateQuery);
  response.send("Player Details Updated");
});

//API 5
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_table
    WHERE 
        player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
