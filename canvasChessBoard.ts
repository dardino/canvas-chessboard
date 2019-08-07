import './canvasChessBoard.less';

declare module global {
  export type SelectCellEvent = CustomEvent<{ prev: BoardLocation | null, current: BoardLocation | null }>;
  export interface HTMLCanvasElement {
    addEventListener(type: "selectcell", listener: (e: SelectCellEvent) => boolean): void;
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
    this.ctx = canvas.getContext("2d");
    this.canvas.classList.add("chessBoard");
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("click", this.onCanvasClick)
  }

  private onResize = () => this.Redraw();
  private onCanvasClick = (e) => this.canvasClick(e);

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

  private setCurrentCell(loc: BoardLocation): void {
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
  }

}

