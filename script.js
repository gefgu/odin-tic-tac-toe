// gameBoard
// stores the board
// check for wins or ties

// displayController
// who can play
// where the mark can be placed
// sends to gameboard the marks
// display the board
// display the messages
// restart the game

// create two players
// add variable to hold the current player
// after each play - change player;
const displayController = ((doc) => {
  const _container = doc.querySelector(".container");

  const winMessage = "win";
  const tieMessage = "tie";

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
      // Check diagonals for equal marks
      // If board is full - return tie
      for (let i = 0; i < 3; i++) {
        if (
          board[i][0] === board[i][1] &&
          board[i][1] === board[i][2] &&
          board[i][0] === mark
        ) {
          return winMessage;
        } else if (
          board[0][i] === board[1][i] &&
          board[1][i] === board[2][i] &&
          board[0][i] === mark
        ) {
          return winMessage;
        }
      }
      if (
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[0][0] === mark
      ) {
        return winMessage;
      } else if (
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[1][1] === mark
      ) {
        return winMessage;
      }
      if (_checkFullBoard()) {
        return tieMessage;
      }
    };

    const updateBoard = (row, col, mark) => {
      board[row][col] = mark;
      console.log(_checkWinningCondition(mark));
    };

    return { getBoard, updateBoard };
  })();

  const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return { getName, getMark };
  };

  const _createPlayers = () => {
    return [Player("Player 1", "X"), Player("Player 2", "O")];
  };

  const _players = _createPlayers();
  let _currentPlayer = _players[0];

  const _addMark = function () {
    if (this.textContent === "") {
      gameBoard.updateBoard(
        this.dataset.row,
        this.dataset.col,
        _currentPlayer.getMark()
      );
      updateBoard();
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

  const createBoard = () => {
    const board = doc.createElement("div");
    board.classList.add("board");
    board.append(..._createThreeDivs());
    board.childNodes.forEach((div, rowIndex) => {
      _createThreeDivs().forEach((positionDiv, colIndex) => {
        positionDiv.dataset.row = rowIndex;
        positionDiv.dataset.col = colIndex;
        positionDiv.classList.add("spot");
        positionDiv.addEventListener("click", _addMark);
        div.appendChild(positionDiv);
      });
    });
    _container.appendChild(board);
  };

  const updateBoard = () => {
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
  };

  return { createBoard, updateBoard };
})(document);

displayController.createBoard();
displayController.updateBoard();
