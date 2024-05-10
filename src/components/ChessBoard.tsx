import "./ChessBoard.css";

const ChessBoard = () => {
  const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

  let board = [];

  for (let j = horizontalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < verticalAxis.length; i++) {
      let squareColor = (i + j) % 2 === 0 ? "white" : "black";
      board.push(
        <div
          key={`${horizontalAxis[i]}${verticalAxis[j]}`}
          className={`square ${squareColor}`}
        >
          {horizontalAxis[i]}
          {verticalAxis[j]}
        </div>
      );
    }
  }

  return <div id="chessboard">{board}</div>;
};

export default ChessBoard;
