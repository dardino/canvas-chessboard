# canvas-chessboard

> This library is in pre-release, every help, collaborations and tips are welcome!
> you feel free to track anything

<!-- toc -->

## Use

### install

```bash

# if you use yarn:
yarn add canvas-chessboard

# if you use npm:
npm install canvas-chessboard --save

```

### import font

```css
/* add in your CSS file (check the correct path): */
@import "./node_modules/canvas-chessboard/src/font/chess-figurine.css";
```

### import js module

```typescript
/* typescript */
import { CanvasChessBoard, Piece, Colors, BoardRank, BoardFile } from "canvas-chessboard";
```

### render

```typescript
/* typescript */
const CELLCOLORS: [string, string] = ["#fff", "#C5CACA"];
const PIECECOLORS: [string, string] = ["#fff", "#333"];
var cb = new CanvasChessBoard(canvas, {
  CELLCOLORS,
  PIECECOLORS,
  BORDER_SIZE: 1
});
const pieces: Array<Piece> = [
  {
    figurine: Figurine.k,
    color: Colors.White,
    loc: { col: BoardFile.A, row: BoardRank.R1 }
  },
  {
    figurine: Figurine.k,
    color: Colors.Black,
    loc: { col: BoardFile.H, row: BoardRank.R8 }
  }
];
cb.SetPieces(pieces);
cb.Redraw();
```
