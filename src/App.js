import React, { Component } from 'react';

import './App.css';

const SIZE = Math.floor(window.innerHeight / 20);
const INITIAL_GRID = Array(...Array(SIZE)).map(() => Array(...Array(SIZE).fill(0)));

const isAlive = (val) => val === 1;

const countAliveCells = (i, j, grid) => {
  let count = 0;
  if (i > 0 && j > 0) {
    isAlive(grid[i - 1][j - 1]) && ++count;
  }
  if (i > 0) {
    isAlive(grid[i - 1][j]) && ++count;

    if (j < SIZE - 1) {
      isAlive(grid[i - 1][j + 1]) && ++count;
    }
  }

  if (j < SIZE - 1) {
    isAlive(grid[i][j + 1]) && ++count;

    if (i < SIZE - 1) {
      isAlive(grid[i + 1][j + 1]) && ++count;
    }
  }

  if (i < SIZE - 1) {
    isAlive(grid[i + 1][j]) && ++count;

    if (j > 0) {
      isAlive(grid[i + 1][j - 1]) && ++count;
    }
  }
  if (j > 0) {
    isAlive(grid[i][j - 1]) && ++count;
  }
  return count;
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      grid: INITIAL_GRID,
      isPlaying: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.intervalRef);
  }

  handleCellClick = (i, k) => {
    const newGrid = this.state.grid.map(row => row.slice());
    newGrid[i][k] = newGrid[i][k] === 1 ? 0 : 1;
    this.setState({ grid: newGrid });
  }

  playNext = () => {
    const grid = this.state.grid;
    const newGrid = grid.map(row => row.slice());

    //if there is no alive cell stop playing.
    if(JSON.stringify(INITIAL_GRID) === JSON.stringify(grid)) {
      clearInterval(this.intervalRef);
      return;
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const neighborsCount = countAliveCells(i, j, grid);
        if (grid[i][j] === 1 && neighborsCount < 2) {
          newGrid[i][j] = 0;
        }
        if (grid[i][j] === 1 && neighborsCount > 3) {
          newGrid[i][j] = 0;
        }
        if (grid[i][j] === 0 && neighborsCount === 3) {
          newGrid[i][j] = 1;
        }
      }
    }
    this.setState({
      grid: newGrid,
    });
  }
  
  onPlayClk = () => {
    this.setState({
      isPlaying: true,
    });
    this.playNext();
    this.intervalRef = setInterval(this.playNext, 500);
  };

  onClearClk = () => {
    this.setState({ 
      grid: INITIAL_GRID,
      isPlaying: false,
    });
    clearInterval(this.intervalRef);
  }

  render() {
    const grid = this.state.grid;

    return (
      <div className="game-container">
        <div className="control-section">
          <button type="button" onClick={this.onPlayClk} className="gameBtn playBtn">
            Play
      </button>
          <button type="button" onClick={this.onClearClk} className="gameBtn clearBtn">
            Clear
      </button>
        </div>
        {
          grid.map((row, i) => {
            return (
              <div className="row" key={i}>
                {
                  row.map((val, k) => {
                    return (
                      <button type="button"
                        style={{width: (window.innerWidth / SIZE)}}
                        key={i.toString() + k.toString()}
                        onClick={() => this.handleCellClick(i, k)}
                        className={"lifeBtn cell" + (val !== 0 ? ' alive' : '')}>

                      </button>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

const App = () => (
  <Game />
);

export default App;
