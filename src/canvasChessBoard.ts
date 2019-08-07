import './canvasChessBoard.less';
declare global {
  type SelectCellEvent = CustomEvent<{ prev: BoardLocation | null, current: BoardLocation | null }>;
  interface HTMLCanvasElement {
    addEventListener<T extends "selectcell">(type: "selectcell", listener: (this: HTMLCanvasElement, e: SelectCellEvent) => boolean | void): void;
  }
}

export type Piece = { figurine: Figurine, color: Colors, loc: BoardLocation, rot?: Rotations };
export type BoardLocation = { row: BoardRank, col: BoardFile };
export enum Colors {
  White = 0,
  Black = 1
}
export enum Figurine {
  k = 0x265A, // K = 0x2654,
  q = 0x265B, // Q = 0x2655,
  r = 0x265C, // R = 0x2656,
  b = 0x265D, // B = 0x2657,
  n = 0x265E, // N = 0x2658,
  p = 0x265F, // P = 0x2659
};
export enum BoardRank {
  R8 = 0,
  R7 = 1,
  R6 = 2,
  R5 = 3,
  R4 = 4,
  R3 = 5,
  R2 = 6,
  R1 = 7
}
export enum BoardFile {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5,
  G = 6,
  H = 7
}

export enum Rotations {
  NoRotation = 0,  //    ↑
  TopRight = 45, //      ↗
  Right = 90, //         →
  BottomRight = 215, //  ↘
  UpsideDown = 180, //   ↓
  BottomLeft = -215, //  ↙
  Left = -90, //         ←
  TopLeft = -45, //      ↖
}

export class CanvasChessBoard {
  private PIECESTROKECOLORS: [string, string];

  private static darkCells = [
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
  ];

  private cellSize: number = 0;
  private fontSize: number = 0;
  private offset: number = 0;
  private fontStroke: number = 0;
  private b_size: number = 0;
  private pieces: Array<Piece> = [];
  private currentCell: BoardLocation | null = null;

  private setSizes() {
    this.cellSize = this.canvas.getBoundingClientRect().width / 4;
    this.canvas.width = this.canvas.getBoundingClientRect().width * 2;
    this.canvas.height = this.canvas.getBoundingClientRect().width * 2;
    this.fontSize = this.cellSize * .75;
    this.offset = this.cellSize / 2;
    this.fontStroke = this.cellSize / 120;
    this.b_size = this.options.BORDER_SIZE * this.fontStroke;
  }

  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, private options: {
    CELLCOLORS: [string, string],
    PIECECOLORS: [string, string],
    FONT: string,
    BORDER_SIZE: number
  }) {
    this.PIECESTROKECOLORS = options.PIECECOLORS.slice().reverse() as [string, string];
    let ctx = canvas.getContext("2d");
    if (ctx==null) throw new Error("Context can not be null");
    this.ctx = ctx;
    this.canvas.classList.add("chessBoard");
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("click", this.onCanvasClick)
  }

  private onResize = () => this.Redraw();
  private onCanvasClick = (e: MouseEvent) => this.canvasClick(e);

  private canvasClick(e: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect();
    let border = (rect.width - this.canvas.clientWidth) / 2;
    let realsize = (this.canvas.clientWidth / 8);
    let col = Math.max(0, Math.min(7, Math.floor((e.x - border - rect.left) / realsize)));
    let row = Math.max(0, Math.min(7, Math.floor((e.y - border - rect.top) / realsize)));
    if (this.currentCell != null && this.currentCell.row == row && this.currentCell.col == col) this.setCurrentCell(null);
    else this.setCurrentCell({ col, row });
    this.Redraw();
  }

  private setCurrentCell(loc: BoardLocation | null): void {
    let prev = this.currentCell ? { col: this.currentCell.col, row: this.currentCell.row } : null;
    let ev = new CustomEvent<{ prev: BoardLocation | null, current: BoardLocation | null }>(
      "selectcell",
      {
        detail: {
          prev: prev,
          current: loc
        }
      });
    let result = this.canvas.dispatchEvent(ev);
    if (result) this.currentCell = loc;
  }

  public SetPieces(pieces: Array<Piece>) {
    this.pieces = pieces;
    this.Redraw();
  }

  public Redraw() {
    requestAnimationFrame(() => {
      this.setSizes();
      this.drawBoard();
    });
  }

  private drawCell(row: number, col: number) {
    this.ctx.save();
    this.ctx.fillStyle = this.options.CELLCOLORS[CanvasChessBoard.darkCells[(row * 8) + (col)]];
    this.ctx.fillRect(this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private highlightingCurrentCell() {
    if (!this.currentCell) return;
    this.ctx.save();
    this.ctx.strokeStyle = "#00FF00";
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = "rgba(0,255,0,.2)";
    this.ctx.fillRect(this.cellSize * this.currentCell.col, this.cellSize * this.currentCell.row, this.cellSize, this.cellSize);
    this.ctx.strokeRect(this.cellSize * this.currentCell.col, this.cellSize * this.currentCell.row, this.cellSize, this.cellSize);
    this.ctx.restore();
  }

  private drawEmptyBoard() {
    for (let col = 0; col < 8; col++)
      for (let row = 0; row < 8; row++)
        this.drawCell(row, col);
  }

  private drawBorder() {
    this.ctx.save();
    let w = this.canvas.width;
    let h = this.canvas.height;
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = this.b_size;
    this.ctx.strokeRect(
      this.b_size / 2,
      this.b_size / 2,
      w - this.b_size,
      h - this.b_size
    );
    this.ctx.restore();
  }

  private drawPieces(pieces: Array<Piece>) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    pieces.forEach(p => {
      this.drawPiece(p);
    });
  }

  private drawPiece(piece: Piece) {
    this.ctx.save();
    let adjust = this.fontStroke * 9;
    const fig = String.fromCharCode(piece.figurine);
    const _x = piece.loc.col * this.cellSize + this.offset;
    const _y = (piece.loc.row * this.cellSize + this.cellSize - this.offset);
    const shadowSize = this.fontStroke * 2;

    this.ctx.fillStyle = this.options.PIECECOLORS[piece.color];
    this.ctx.strokeStyle = this.PIECESTROKECOLORS[piece.color];
    this.ctx.lineWidth = this.fontStroke;
    this.ctx.font = `${this.fontSize}px Tahoma`;
    this.ctx.shadowColor = this.PIECESTROKECOLORS[piece.color];
    this.ctx.shadowBlur = shadowSize;

    // this only for better result
    if (piece.rot != null) {
      adjust = piece.rot == Rotations.UpsideDown ? -adjust : adjust;
      this.ctx.translate(_x, _y + adjust);
      this.ctx.rotate(piece.rot * (Math.PI / 180));
    } else {
      this.ctx.translate(_x, _y + adjust);
    }

    this.ctx.shadowOffsetX = shadowSize;
    this.ctx.shadowOffsetY = shadowSize;
    this.ctx.fillText(fig, 0, 0);
    this.ctx.shadowOffsetY = -shadowSize;
    this.ctx.fillText(fig, 0, 0);
    this.ctx.shadowOffsetX = -shadowSize;
    this.ctx.fillText(fig, 0, 0);
    this.ctx.shadowOffsetY = shadowSize;
    this.ctx.fillText(fig, 0, 0);
    if (piece.color === Colors.White) {
      this.ctx.shadowColor = "transparent";
      this.ctx.strokeText(fig, 0, 0);
    }
    this.ctx.restore();
  }

  private drawBoard() {
    this.drawEmptyBoard();
    this.drawBorder();
    this.highlightingCurrentCell();
    this.drawPieces(this.pieces);
    this.ctx.stroke(this.bishop);
  }

  private bishop = new Path2D("m50 5.1c-1 1.1e-4 -2 0.13-3 0.39-4 0.95-6.1 3.4-6.1 7.5-1e-4 2.5 0.95 4.9 2.8 7.2-2.2 0.26-5.9 2.5-11 6.7-5.6 4.6-8.4 9.8-8.4 15 0 4.9 2.6 11 7.9 17 0 0.52-0.22 1.5-0.65 2.8-1.4 4.1-2.1 6.3-2.1 6.6 0 3 3.1 4.8 9.2 5.3-4.4 1.7-8.6 2.6-13 2.6-5.1-0.26-7.6-0.39-7.6-0.39-1.1 0-2.2 0.17-3.1 0.52-2.7 0.86-5.2 3.4-7.5 7.7 1 1.3 1.9 2.6 2.7 4 2 3.4 4.1 5.5 6.3 6.5 0.086-0.34 0.21-0.65 0.39-0.9 1-1.3 4.7-2.2 11-2.7 2.5-0.34 4.5-0.6 6.1-0.78 6.9-0.52 12-2.5 15-6.1 3.7 3.7 11 6 21 6.8l3.1 0.26c5.2 0.43 7.9 1.6 8.3 3.4 1.5-0.52 3-1.6 4.4-3.4l4.6-7.1c-0.52-0.86-0.95-1.6-1.3-2.3-2.4-4-5.5-5.9-9.3-5.9-4.6 0.26-7.1 0.39-7.6 0.39-3.9 0-8-0.86-13-2.6 6.1-0.52 9.2-2.3 9.2-5.3l-2.6-9.9c5.2-5.9 7.7-11 7.7-16-1e-4 -6.6-4-13-12-18-3.3-2.2-5.7-3.6-7.4-4 1.9-2.4 2.8-4.8 2.8-7.2v-0.39l-0.65-2.7c-1.3-3.2-4.1-4.8-8.4-4.8zm0 5.3c2.2 0 3.2 1 3.2 3.1-1.1e-4 2.2-1.1 3.2-3.2 3.2-0.26 0-0.52-0.043-0.78-0.13-1.7-0.43-2.6-1.5-2.6-3.1l0.13-0.78c0.43-1.5 1.5-2.3 3.2-2.3zm-2.3 20h4.6v5.6h4.5v4.9h-4.5v5.9h-4.6v-5.9h-4.5v-4.9h4.5zm-4 23h13c4.4 0 6.6 0.69 6.6 2.1-1.2e-4 0.95-0.86 1.5-2.6 1.7-2.3 0.26-5.8 0.39-10 0.39-4.6 0-8-0.13-10-0.39-1.8-0.17-2.7-0.73-2.7-1.7-1.2e-4 -0.34 0.086-0.6 0.26-0.78 0.43-0.86 2.5-1.3 6.3-1.3zm0 8h13c4.4 0 6.6 0.69 6.6 2.1-1.2e-4 1.5-4.3 2.2-13 2.2h-7.1c-3.9-0.26-5.8-0.99-5.8-2.2-1.2e-4 -1.4 2.2-2.1 6.6-2.1z");

}

