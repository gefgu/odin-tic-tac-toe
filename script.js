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


// player
// stores the name
// stores the mark
