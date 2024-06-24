import { simplexPositive } from './simplex2.js';
import Tile from './entities/tile.js';
import Player from './entities/player.js';

class GameInstance {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.players = {}
    this.rgb = [50, 40, 40]
    this.grid = this.initializeGrid()
    this.noiseScale = 10
  }

  initializeGrid(){

    const grid = []
    for (let x = 0; x < this.rows; x++){
      const row = []
      for (let y = 0; y < this.cols; y++){
        let result = simplexPositive(x, y, 20)
        row.push(new Tile(result))
      }
      grid.push(row)
    }
    return grid
  }

  getGrid(){
    let tempGrid = []
    for (let x = 0; x < this.rows; x++){
      const row = []
      for (let y = 0; y < this.cols; y++){
        let tile = this.grid[x][y]
        row.push(tile.getPortableState())
      }
      tempGrid.push(row)
    }
    return tempGrid
  }

  findRandomSpot(){
    let counter = 0
    const limit = 100
    let x = Math.floor(Math.random() * this.rows)
    let y = Math.floor(Math.random() * this.cols)
    if (this.grid[x][y].spaceLayer){
      counter++
      if (counter < limit){
        throw new Error('Could not find a spot for the player')
      }
      return this.findRandomSpot()
    }
    return {x, y}
  }

  // TODO: For add and remove players, it may be a good idea to add some safety with the playermap / grid connection.
  // The most common problems with probably be trying to access grid positions that don't exist
  addPlayer(playerId){

    if (this.players[playerId]){
      console.log("PLayer already exists")
      this.players[playerId].online = true
      let { x, y } = this.players[playerId]
      let player = this.grid[x][y].spiritLayer
      this.grid[x][y].spiritLayer = null

      if (this.grid[x][y].spaceLayer){
        let { x : newX, y : newY } = this.findRandomSpot()
        this.grid[newX][newY].spaceLayer = player
        return
      }
      
      this.grid[x][y].spaceLayer = player
      return
    }

    try {
      let { x, y } = this.findRandomSpot()
      let newPlayer = new Player(playerId)
      this.grid[x][y].spaceLayer = newPlayer
      this.players[playerId] = { x, y, online: true}
    } catch (error) {
      console.log(error)
    }

    console.log("Players", this.players)
  }

  removePlayer(playerId){
    try {
      if (!this.players || this.players[playerId]){
        console.log(`Failed to remove player ${playerId}: they do not exist in the game`)
      }

      let { x, y } = this.players[playerId]
      console.log("Attempting to delete a player with the coords of", x, y)

      if (this.grid[x] && this.grid[x][y]){
        let player = this.grid[x][y].spaceLayer
        this.grid[x][y].spaceLayer = null
        this.grid[x][y].spiritLayer = player
        this.players[playerId].online = false
      } else {
        console.log(`Invalid coordinates (${x}, ${y}) for player with ID ${playerId}`);
      }

    } catch (error) {
      console.log(error)
    }
  }
}

export default GameInstance