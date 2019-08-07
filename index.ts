// Import stylesheets
import './style.less';
import { Rotations, CanvasChessBoard, Figurine, Colors, BoardRank, BoardFile } from "./canvasChessBoard";

const CELLCOLORS: [string, string] = ["#fff", "#C5CACA"];
const PIECECOLORS: [string, string] = ["#fff", "#999"];
const FONT = "Arial";


// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.classList.add("main");
const canvas: HTMLCanvasElement = document.createElement("canvas");
appDiv.innerHTML = "";
appDiv.appendChild(canvas);
var cb = new CanvasChessBoard(canvas, { CELLCOLORS, PIECECOLORS, FONT });
canvas.addEventListener("selectcell", (e: CustomEvent) => {
  console.log(e.detail);
});
cb.SetPieces([
  { figurine: Figurine.k, color: Colors.Black, loc: { row: BoardRank.R1, col: BoardFile.A } },
  { figurine: Figurine.q, color: Colors.Black, loc: { row: BoardRank.R2, col: BoardFile.A } },
  { figurine: Figurine.p, color: Colors.Black, loc: { row: BoardRank.R3, col: BoardFile.A } },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R4, col: BoardFile.A } },
  { figurine: Figurine.b, color: Colors.Black, loc: { row: BoardRank.R5, col: BoardFile.A } },
  { figurine: Figurine.r, color: Colors.Black, loc: { row: BoardRank.R6, col: BoardFile.A } },
  { figurine: Figurine.k, color: Colors.White, loc: { row: BoardRank.R1, col: BoardFile.B } },
  { figurine: Figurine.q, color: Colors.White, loc: { row: BoardRank.R2, col: BoardFile.B } },
  { figurine: Figurine.p, color: Colors.White, loc: { row: BoardRank.R3, col: BoardFile.B } },
  { figurine: Figurine.n, color: Colors.White, loc: { row: BoardRank.R4, col: BoardFile.B } },
  { figurine: Figurine.b, color: Colors.White, loc: { row: BoardRank.R5, col: BoardFile.B } },
  { figurine: Figurine.r, color: Colors.White, loc: { row: BoardRank.R6, col: BoardFile.B } },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R1, col: BoardFile.C }, rot: Rotations.NoRotation },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R2, col: BoardFile.C }, rot: Rotations.TopRight },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R3, col: BoardFile.C }, rot: Rotations.Right },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R4, col: BoardFile.C }, rot: Rotations.BottomRight },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R5, col: BoardFile.C }, rot: Rotations.UpsideDown },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R6, col: BoardFile.C }, rot: Rotations.BottomLeft },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R7, col: BoardFile.C }, rot: Rotations.Left },
  { figurine: Figurine.n, color: Colors.Black, loc: { row: BoardRank.R8, col: BoardFile.C }, rot: Rotations.TopLeft }
]);


