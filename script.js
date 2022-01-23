// gameBoard
// stores the board
// check for wins or ties
const gameBoard = (() => {
  const board = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["X", "O", "X"],
  ];
  const getBoard = () => board;
  return { getBoard };
})();

// displayController
// who can play
// where the mark can be placed
// sends to gameboard the marks
// display the board
// display the messages
// restart the game
const displayController = ((doc) => {
  const _container = doc.querySelector(".container");
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
        if (spot.textContent != boardArray[rowIndex][colIndex]) {
          spot.textContent = boardArray[rowIndex][colIndex];
        }
      });
    });
  };

  return { createBoard, updateBoard };
})(document);

// player
// stores the name
// stores the mark
const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

displayController.createBoard();
displayController.updateBoard();
