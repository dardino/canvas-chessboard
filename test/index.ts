// Import stylesheets
import "./style.less";
import {
  Rotations,
  CanvasChessBoard,
  BoardRank,
  BoardFile,
} from "../src/canvasChessBoard";

import { GetConfig as GetScacchiPainterCfg } from "../src/presets/scacchipainter";
import { GetConfig as GetProblemisteCfg } from "../src/presets/problemiste";
import { GetConfig as GetChessFigurine } from "../src/presets/chessfigurine";

const CELLCOLORS: [string, string] = ["#fff", "#C5CACA"];
const PIECECOLORS: [string, string] = ["#fff", "#333"];

// Write TypeScript code!
const appDiv = document.createElement("div");
document.body.appendChild(appDiv);
appDiv.classList.add("main");
const wrapper: HTMLDivElement = document.createElement("div");
wrapper.classList.add("wrapper");
const canvas: HTMLCanvasElement = document.createElement("canvas");
appDiv.innerHTML = "";
appDiv.appendChild(wrapper);
wrapper.appendChild(canvas);

var cb = new CanvasChessBoard(canvas, {
  CELLCOLORS,
  PIECECOLORS,
  BORDER_SIZE: 1,
});

cb.AddFontConfig("ScacchiPainter", GetScacchiPainterCfg());
cb.AddFontConfig("Problemiste", GetProblemisteCfg());
cb.AddFontConfig("ChessFigurine", GetChessFigurine());

canvas.addEventListener<"selectcell">("selectcell", (e) => {
  console.log(e.detail);
});
document.addEventListener("readystatechange", (r) => {
  if (document.readyState === "complete") {
    cb.SetPieces([
      {
        figurine: "k",
        color: "black",
        loc: { row: BoardRank.R1, col: BoardFile.A },
      },
      {
        figurine: "q",
        color: "black",
        loc: { row: BoardRank.R2, col: BoardFile.A },
      },
      {
        figurine: "p",
        color: "black",
        loc: { row: BoardRank.R3, col: BoardFile.A },
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R4, col: BoardFile.A },
      },
      {
        figurine: "b",
        color: "black",
        loc: { row: BoardRank.R5, col: BoardFile.A },
      },
      {
        figurine: "r",
        color: "black",
        loc: { row: BoardRank.R6, col: BoardFile.A },
      },
      {
        figurine: "k",
        color: "white",
        loc: { row: BoardRank.R1, col: BoardFile.B },
      },
      {
        figurine: "q",
        color: "white",
        loc: { row: BoardRank.R2, col: BoardFile.B },
      },
      {
        figurine: "p",
        color: "white",
        loc: { row: BoardRank.R3, col: BoardFile.B },
      },
      {
        figurine: "n",
        color: "white",
        loc: { row: BoardRank.R4, col: BoardFile.B },
      },
      {
        figurine: "b",
        color: "white",
        loc: { row: BoardRank.R5, col: BoardFile.B },
      },
      {
        figurine: "r",
        color: "white",
        loc: { row: BoardRank.R6, col: BoardFile.B },
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R1, col: BoardFile.C },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R2, col: BoardFile.C },
        rot: Rotations.TopRight,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R3, col: BoardFile.C },
        rot: Rotations.Right,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R4, col: BoardFile.C },
        rot: Rotations.BottomRight,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R5, col: BoardFile.C },
        rot: Rotations.UpsideDown,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R6, col: BoardFile.C },
        rot: Rotations.BottomLeft,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R7, col: BoardFile.C },
        rot: Rotations.Left,
      },
      {
        figurine: "n",
        color: "black",
        loc: { row: BoardRank.R8, col: BoardFile.C },
        rot: Rotations.TopLeft,
      },
      {
        figurine: "e",
        color: "white",
        loc: { row: BoardRank.R8, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "t",
        color: "white",
        loc: { row: BoardRank.R7, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "a",
        color: "white",
        loc: { row: BoardRank.R6, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "e",
        color: "black",
        loc: { row: BoardRank.R5, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "t",
        color: "black",
        loc: { row: BoardRank.R4, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
      {
        figurine: "a",
        color: "black",
        loc: { row: BoardRank.R3, col: BoardFile.D },
        rot: Rotations.NoRotation,
      },
    ]);
    cb.Redraw();
  }
});

const selector = document.getElementById("font-selector") as HTMLSelectElement;
if (selector != null) {
  selector.addEventListener("change", (e) => {
    cb.SetFont(selector.value);
    cb.Redraw();
  });
}
