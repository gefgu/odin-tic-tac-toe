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
  const _createThreeDivs = () => {
    return [
      doc.createElement("div"),
      doc.createElement("div"),
      doc.createElement("div"),
    ];
  };
  const createBoard = () => {
    const container = doc.querySelector(".container");
    const board = doc.createElement("div");
    board.classList.add("board")
    board.append(..._createThreeDivs());
    board.childNodes.forEach((div, rowIndex) => {
        _createThreeDivs().forEach((positionDiv, colIndex) => {
            positionDiv.dataset.position = (rowIndex * 3) + colIndex;
            positionDiv.classList.add("spot");
            div.appendChild(positionDiv);
        });
    });
    container.appendChild(board);
  };
  return {createBoard};
})(document);

// player
// stores the name
// stores the mark

displayController.createBoard();
