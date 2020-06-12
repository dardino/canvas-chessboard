# canvas-chessboard

> This library is in pre-release, every help, collaborations and tips are welcome!
> you feel free to track anything

<!-- toc -->

## version 0.0.16 Breaking changes

- [x] Figurine is no more an enum but a literal string type!
- [x] Colors is no more an enum but a literal string type!

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
/* add in your SCSS file (check the correct path): */
@import "./node_modules/canvas-chessboard/dist/fonts/ScacchiPainter.scss";
```

### import js module

```typescript
/* typescript */
import * as CB from "canvas-chessboard/modules/es2018/canvasChessBoard";
```

### render

```typescript
/* typescript */
const CELLCOLORS: [string, string] = ["#fff", "#C5CACA"];
const PIECECOLORS: [string, string] = ["#fff", "#333"];
var cb = new CB.CanvasChessBoard(canvas, {
  CELLCOLORS,
  PIECECOLORS,
  BORDER_SIZE: 1,
});

const pieces: Array<CB.Piece> = [
  {
    figurine: "k",
    color: "white",
    loc: { col: CB.BoardFile.A, row: CB.BoardRank.R1 },
  },
  {
    figurine: "k",
    color: "black",
    loc: { col: CB.BoardFile.H, row: CB.BoardRank.R8 },
  },
];
cb.SetPieces(pieces);
cb.Redraw();
```

### Changing aspect of pieces

```typescript
import Configs from "canvas-chessboard/modules/es2018/presets";
// in the setup of canvas:
const cfgKey = "Sample_ScacchiPainter";
cb.AddFontConfig(cfgKey, Configs.ScacchiPainter);

// somewhere else in the code
cb.SetFont(cfgKey);
cb.Redraw();
```
