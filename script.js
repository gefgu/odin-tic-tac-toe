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
    const getBoard = () => board;

    const _checkFullBoard = () => {
      const isFull = board.reduce(
        (accumulator, row) =>
          accumulator *
          row.reduce((previous, current) => previous * (current !== ""), 1),
        1
      );
      return isFull;
    };

    const _checkWinningCondition = (mark) => {
      for (let i = 0; i < 3; i++) {
        if (
          board[i][0] === board[i][1] &&
          board[i][1] === board[i][2] &&
          board[i][0] === mark
        ) {
          return _winMessage;
        } else if (
          board[0][i] === board[1][i] &&
          board[1][i] === board[2][i] &&
          board[0][i] === mark
        ) {
          return _winMessage;
        }
      }
      if (
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[0][0] === mark
      ) {
        return _winMessage;
      } else if (
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[1][1] === mark
      ) {
        return _winMessage;
      }
      if (_checkFullBoard()) {
        return _tieMessage;
      }
    };

    const updateBoard = (row, col, mark) => {
      board[row][col] = mark;
      return _checkWinningCondition(mark);
    };

    const restartBoard = () => {
      board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          board[rowIndex][colIndex] = "";
        });
      });
    };

    return { getBoard, updateBoard, restartBoard };
  })();

  const Player = (name, mark) => {
    let _name = name;
    const _mark = mark;
    const getName = () => _name;
    const getMark = () => _mark;
    const changeName = (newName) => (_name = newName);
    return { getName, getMark, changeName };
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
  };

  const _changeNameOfPlayer = function() {
    const newName = prompt("Set new name:");
    if (newName === "") {
      return;
    }
    const index = +this.dataset.index;
    _players[index].changeName(newName);
    const playerElement = doc.querySelector(`#player-${index + 1}`);
    playerElement.querySelector(".player-name").textContent =
      _players[index].getName();
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
    } else if (result === _tieMessage) {
      _displayMessage.textContent = "Tie!";
      _isPlaying = false;
    }

    if (_isPlaying) {
      _toggleEffectToPlayers();
    }
  };

  return { createBoard };
})(document);

displayController.createBoard();
