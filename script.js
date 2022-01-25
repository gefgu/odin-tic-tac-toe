const displayController = ((doc) => {
  const _container = doc.querySelector(".container");
  const _displayMessage = doc.querySelector(".display-message");

  const _winMessage = "win";
  const _tieMessage = "tie";
  let _isPlaying = true;

  const gameBoard = (() => {
    const board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    let _lastPlay = "O";

    const getBoard = () => board;

    const _checkFullBoard = (boardToCheck) => {
      const isFull = boardToCheck.reduce(
        (accumulator, row) =>
          accumulator *
          row.reduce((previous, current) => previous * (current !== ""), 1),
        1
      );
      return isFull;
    };

    const _getResultOfBoard = (boardToCheck, mark) => {
      for (let i = 0; i < 3; i++) {
        if (
          boardToCheck[i][0] === boardToCheck[i][1] &&
          boardToCheck[i][1] === boardToCheck[i][2] &&
          boardToCheck[i][0] === mark
        ) {
          return _winMessage;
        } else if (
          boardToCheck[0][i] === boardToCheck[1][i] &&
          boardToCheck[1][i] === boardToCheck[2][i] &&
          boardToCheck[0][i] === mark
        ) {
          return _winMessage;
        }
      }
      if (
        boardToCheck[0][0] === boardToCheck[1][1] &&
        boardToCheck[1][1] === boardToCheck[2][2] &&
        boardToCheck[0][0] === mark
      ) {
        return _winMessage;
      } else if (
        boardToCheck[0][2] === boardToCheck[1][1] &&
        boardToCheck[1][1] === boardToCheck[2][0] &&
        boardToCheck[1][1] === mark
      ) {
        return _winMessage;
      }
      if (_checkFullBoard(boardToCheck)) {
        return _tieMessage;
      }
    };

    const _checkForWinOfMark = (mark) => {
      return _getResultOfBoard(getBoard(), mark);
    };

    const updateBoard = (row, col, mark) => {
      board[row][col] = mark;
      _lastPlay = mark;
      return _checkForWinOfMark(mark);
    };

    const restartBoard = () => {
      board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          board[rowIndex][colIndex] = "";
        });
      });
      _lastPlay = "O";
    };

    const _locateEmptySpotsOfBoard = (boardToCheck) => {
      const locations = [];
      boardToCheck.forEach((row, rowIndex) =>
        row.forEach((value, colIndex) => {
          if (value === "") {
            locations.push({ rowIndex, colIndex });
          }
        })
      );
      return locations;
    };

    const locateEmptySpots = () => {
      return _locateEmptySpotsOfBoard(getBoard());
    };

    const getBestMove = () => {
      const maxPlayerMark = _lastPlay === "X" ? "O" : "X";
      const minPlayerMark = _lastPlay;
      const startingDepth = locateEmptySpots().length;
      if (startingDepth === 9) {
        return { rowIndex: 1, colIndex: 1 };
      }
      let bestPositionIndex = null;
      let foundBestPosition = false;

      const evaluateBoard = (boardToCheck) => {
        const resultOfMax = _getResultOfBoard(boardToCheck, maxPlayerMark);
        if (resultOfMax === _winMessage) {
          return 1;
        } else if (resultOfMax === _tieMessage) {
          return 0;
        } else {
          const resultOfMin = _getResultOfBoard(boardToCheck, minPlayerMark);
          if (resultOfMin === _winMessage) {
            return -1;
          }
        }
        return null;
      };

      const minimax = function (
        position,
        depth,
        alpha,
        beta,
        maximizingPlayer
      ) {
        const evalPosition = evaluateBoard(position);
        if (depth === 0 || evalPosition !== null) {
          return evalPosition;
        }

        if (maximizingPlayer) {
          let maxEval = -Infinity;
          const emptySpots = _locateEmptySpotsOfBoard(position);
          emptySpots.forEach((emptySpot, index) => {
            if (beta <= alpha) {
              return -Infinity;
            }
            const child = JSON.parse(JSON.stringify(position));
            child[emptySpot.rowIndex][emptySpot.colIndex] = maxPlayerMark;
            const eval = minimax(child, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (depth === startingDepth && maxEval > -1 && !foundBestPosition) {
              if (maxEval == 0) {
                bestPositionIndex = index;
              } else if (maxEval == 1) {
                foundBestPosition = true;
                bestPositionIndex = index;
              }
            }
          });
          if (depth === startingDepth) {
            if (bestPositionIndex !== null) {
              return emptySpots[bestPositionIndex];
            } else {
              return emptySpots[Math.floor(Math.random() * emptySpots.length)];
            }
          } else {
            return maxEval;
          }
        } else {
          let minEval = +Infinity;
          _locateEmptySpotsOfBoard(position).forEach((emptySpot) => {
            if (beta <= alpha) {
              return +Infinity;
            }
            const child = JSON.parse(JSON.stringify(position));
            child[emptySpot.rowIndex][emptySpot.colIndex] = minPlayerMark;
            const eval = minimax(child, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
          });
          return minEval;
        }
      };

      return minimax(getBoard(), startingDepth, -Infinity, +Infinity, true);
    };

    return {
      getBoard,
      updateBoard,
      restartBoard,
      locateEmptySpots,
      getBestMove,
    };
  })();

  const Player = (name, mark) => {
    let _name = name;
    const _mark = mark;
    let _score = 0;
    let _isBot = false;
    const getName = () => _name;
    const getMark = () => _mark;
    const getScore = () => _score;
    const isBot = () => _isBot;
    const changeName = (newName) => (_name = newName);
    const changeToBot = () => (_isBot = true);
    const changeToHuman = () => (_isBot = false);
    const incrementScore = () => _score++;
    const play = () => {
      const bestMove = gameBoard.getBestMove();
      _clickSpot(bestMove.rowIndex, bestMove.colIndex);
    };
    return {
      getName,
      getMark,
      getScore,
      isBot,
      changeName,
      incrementScore,
      changeToBot,
      changeToHuman,
      play,
    };
  };

  const _createPlayers = () => {
    return [Player("Player 1", "X"), Player("Player 2", "O")];
  };

  const _players = _createPlayers();
  let _currentPlayer = _players[0];

  const _play = function () {
    if (!_isPlaying) {
      return;
    }
    if (this.textContent === "") {
      const result = gameBoard.updateBoard(
        this.dataset.row,
        this.dataset.col,
        _currentPlayer.getMark()
      );
      _updateBoard(result);
      if (_currentPlayer.getMark() === _players[0].getMark()) {
        _currentPlayer = _players[1];
      } else {
        _currentPlayer = _players[0];
      }
    }
    if (_currentPlayer.isBot() && _isPlaying) {
      _currentPlayer.play();
    }
  };

  const _clickSpot = (rowIndex, colIndex) => {
    _container
      .querySelector(
        `.spot[data-row='${rowIndex}'].spot[data-col='${colIndex}']`
      )
      .click();
  };

  const _createThreeDivs = () => {
    return [
      doc.createElement("div"),
      doc.createElement("div"),
      doc.createElement("div"),
    ];
  };

  let _restartButton = null;

  const _restartBoard = () => {
    gameBoard.restartBoard();
    _currentPlayer = _players[0];
    _isPlaying = true;
    _displayMessage.textContent = "";
    _updateBoard();
    _setInitialEffectToPlayer();
    if (_currentPlayer.isBot()) {
      _currentPlayer.play();
    }
  };

  const _setPlayerName = (playerIndex, newName) => {
    _players[playerIndex].changeName(newName);
    const playerElement = doc.querySelector(`#player-${playerIndex + 1}`);
    playerElement.querySelector(".player-name").textContent =
      _players[playerIndex].getName();
  };

  const _changeNameOfPlayer = function () {
    const newName = prompt("Set new name:");
    if (newName === "") {
      return;
    }
    const index = +this.dataset.index;
    _setPlayerName(index, newName);
  };

  const _changePlayerToBot = function () {
    const index = +this.dataset.index;
    if (_players[index].isBot()) {
      _players[index].changeToHuman();
      _setPlayerName(index, `Human ${index + 1}`);
    } else {
      _players[index].changeToBot();
      _setPlayerName(index, `Bot ${index + 1}`);
      if (_players[index] === _currentPlayer) {
        _currentPlayer.play();
      }
    }
  };

  const createBoard = () => {
    const board = doc.createElement("div");
    board.classList.add("board");
    board.append(..._createThreeDivs());
    board.childNodes.forEach((div, rowIndex) => {
      _createThreeDivs().forEach((positionDiv, colIndex) => {
        positionDiv.dataset.row = rowIndex;
        positionDiv.dataset.col = colIndex;
        positionDiv.classList.add("spot");
        positionDiv.addEventListener("click", _play);
        div.appendChild(positionDiv);
      });
    });

    _container.appendChild(board);
    _restartButton = doc.createElement("button");
    _restartButton.classList.add("restart-button");
    _restartButton.textContent = "RESTART";
    _restartButton.addEventListener("click", _restartBoard);
    _container.appendChild(_restartButton);

    _players.forEach((player, index) => {
      const nameTitle = doc.createElement("h3");
      const playerElement = doc.querySelector(`#player-${index + 1}`);
      nameTitle.textContent = player.getName();
      nameTitle.classList.add("player-name");
      playerElement.prepend(nameTitle);

      const changeNameButton = doc.createElement("button");
      changeNameButton.classList.add("change-button");
      changeNameButton.textContent = "Change Name";
      changeNameButton.dataset.index = index;
      changeNameButton.addEventListener("click", _changeNameOfPlayer);
      playerElement.appendChild(changeNameButton);

      const changeToBotButton = doc.createElement("button");
      changeToBotButton.classList.add("bot-button");
      changeToBotButton.textContent = "Toggle Bot";
      changeToBotButton.dataset.index = index;
      changeToBotButton.addEventListener("click", _changePlayerToBot);
      playerElement.appendChild(changeToBotButton);

      const scoreTitle = doc.createElement("h4");
      scoreTitle.textContent = "Score";
      scoreTitle.classList.add("score-title");
      playerElement.appendChild(scoreTitle);

      const score = doc.createElement("p");
      score.textContent = "0";
      score.classList.add("score");
      playerElement.appendChild(score);
    });

    _setInitialEffectToPlayer();
  };

  const _setInitialEffectToPlayer = () => {
    doc.querySelector("#player-1").classList.add("active");
    doc.querySelector("#player-2").classList.remove("active");
  };

  const _toggleEffectToPlayers = () => {
    const playerElements = doc.querySelectorAll(".player");
    playerElements.forEach((elem) => elem.classList.toggle("active"));
  };

  const _updateBoard = (result) => {
    const boardArray = gameBoard.getBoard();
    boardArray.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const spot = _container.querySelector(
          `.spot[data-row='${rowIndex}'].spot[data-col='${colIndex}']`
        );
        if (spot.textContent != value) {
          spot.textContent = value;
        }
      });
    });
    if (result === _winMessage) {
      _displayMessage.textContent = `${_currentPlayer.getName()} Won!`;
      _isPlaying = false;
      _updateScore();
    } else if (result === _tieMessage) {
      _displayMessage.textContent = "Tie!";
      _isPlaying = false;
    }

    if (_isPlaying) {
      _toggleEffectToPlayers();
    }
  };

  const _updateScore = () => {
    _currentPlayer.incrementScore();
    let scoreElement = null;
    if (_currentPlayer === _players[0]) {
      scoreElement = doc.querySelector("#player-1 .score");
    } else {
      scoreElement = doc.querySelector("#player-2 .score");
    }
    scoreElement.textContent = _currentPlayer.getScore();
  };

  return { createBoard };
})(document);

displayController.createBoard();
