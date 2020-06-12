declare global {
  type SelectCellEvent = CustomEvent<{
    prev: BoardLocation | null;
    current: BoardLocation | null;
  }>;
  interface HTMLCanvasElement {
    addEventListener<T extends "selectcell">(
      type: "selectcell",
      listener: (this: HTMLCanvasElement, e: SelectCellEvent) => boolean | void
    ): void;
  }
}

export type Piece = {
  figurine: keyof FigurineConfig["white"];
  color: Colors;
  loc: BoardLocation;
  rot?: Rotations;
};

export type BoardLocation = { row: BoardRank; col: BoardFile };
export type Colors = "white" | "black" | "neutral";
export type Figurine = "k" | "q" | "r" | "b" | "n" | "p" | "e" | "t" | "a";
type FigurineByColor = { [key in Figurine]: string };
export type FigurineConfig = { [key in Colors]: FigurineByColor } & {
  background?: FigurineByColor;
  fontFamily: string;
  fontSize?: number;
  adjust?: number;
};

type FigurineConfigs = { [key: string]: FigurineConfig };

const UNICODDE_FIGURINE: FigurineConfig = {
  fontFamily: "Arial, Roboto, Sans, 'sans serif'",
  adjust: 0.08,
  white: {
    k: String.fromCharCode(9812),
    q: String.fromCharCode(9813),
    r: String.fromCharCode(9814),
    b: String.fromCharCode(9815),
    n: String.fromCharCode(9816),
    p: String.fromCharCode(9817),
    e: String.fromCharCode(10023),
    t: String.fromCharCode(9671),
    a: String.fromCharCode(9734),
  },
  black: {
    k: String.fromCharCode(9818),
    q: String.fromCharCode(9819),
    r: String.fromCharCode(9820),
    b: String.fromCharCode(9821),
    n: String.fromCharCode(9822),
    p: String.fromCharCode(9823),
    e: String.fromCharCode(10022),
    t: String.fromCharCode(9670),
    a: String.fromCharCode(9733),
  },
  neutral: {
    k: String.fromCharCode(9812),
    q: String.fromCharCode(9813),
    r: String.fromCharCode(9814),
    b: String.fromCharCode(9815),
    n: String.fromCharCode(9816),
    p: String.fromCharCode(9817),
    e: String.fromCharCode(10023),
    t: String.fromCharCode(9671),
    a: String.fromCharCode(9734),
  },
  background: {
    k: String.fromCharCode(9818),
    q: String.fromCharCode(9819),
    r: String.fromCharCode(9820),
    b: String.fromCharCode(9821),
    n: String.fromCharCode(9822),
    p: String.fromCharCode(9823),
    e: String.fromCharCode(10022),
    t: String.fromCharCode(9670),
    a: String.fromCharCode(9733),
  },
};

export enum BoardRank {
  R8 = 0,
  R7 = 1,
  R6 = 2,
  R5 = 3,
  R4 = 4,
  R3 = 5,
  R2 = 6,
  R1 = 7,
}
export enum BoardFile {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5,
  G = 6,
  H = 7,
}

export enum Rotations {
  NoRotation = 0, //     ↑
  TopRight = 45, //      ↗
  Right = 90, //         →
  BottomRight = 215, //  ↘
  UpsideDown = 180, //   ↓
  BottomLeft = -215, //  ↙
  Left = -90, //         ←
  TopLeft = -45, //       ↖
}

export class CanvasChessBoard {
  private PIECESTROKECOLORS: [string, string];

  private cellSize: number = 0;
  private fontSize: number = 0;
  private offset: number = 0;
  private fontStroke: number = 0;
  private b_size: number = 0;
  private pieces: Array<Piece> = [];
  private currentCell: BoardLocation | null = null;

  private multipier: number = 2;

  private setSizes() {
    const brect = this.original.getBoundingClientRect();

    this.cellSize = (brect.width / 8) * this.multipier;
    this.canvas.width = brect.width * this.multipier;
    this.canvas.height = brect.width * this.multipier;

    this.original.height = this.canvas.height;
    this.original.width = this.canvas.width;

    this.fontSize =
      (this.cellSize / 1.44) * (this.currentFigurine.fontSize ?? 1);
    this.offset = this.cellSize / 2;
    this.fontStroke = this.cellSize / 120;
    this.b_size = this.options.BORDER_SIZE * this.fontStroke;
  }

  private ctx: CanvasRenderingContext2D;

  private canvas: HTMLCanvasElement;

  private figurineCfgs: FigurineConfigs = {
    Default: UNICODDE_FIGURINE,
  };
  private currentFigurine: FigurineConfig;

  constructor(
    private original: HTMLCanvasElement,
    private options: {
      CELLCOLORS: [string, string];
      PIECECOLORS: [string, string];
      BORDER_SIZE: number;
    }
  ) {
    this.currentFigurine = this.figurineCfgs.Default;
    this.original.style.display = "block";
    this.original.style.width = "100%";
    this.original.style.height = "100%";
    this.original.style.cursor = "pointer";
    this.original.style.boxSizing = "border-box";

    this.PIECESTROKECOLORS = options.PIECECOLORS.slice().reverse() as [
      string,
      string
    ];
    this.original.classList.add("chessBoard");
    window.addEventListener("resize", this.onResize);
    this.original.addEventListener("click", this.onCanvasClick);
    this.canvas = document.createElement("canvas");
    let ctx = this.canvas.getContext("2d");
    if (ctx == null) throw new Error("Context can not be null");
    this.ctx = ctx;

    this.setSizes();
  }

  private onResize = () => this.Redraw();
  private onCanvasClick = (e: MouseEvent) => this.canvasClick(e);

  private canvasClick(e: MouseEvent) {
    let rect = this.original.getBoundingClientRect();
    let border = (rect.width - this.original.clientWidth) / 2;
    let realsize = this.original.clientWidth / 8;
    let col = Math.max(
      0,
      Math.min(7, Math.floor((e.x - border - rect.left) / realsize))
    );
    let row = Math.max(
      0,
      Math.min(7, Math.floor((e.y - border - rect.top) / realsize))
    );
    if (
      this.currentCell != null &&
      this.currentCell.row == row &&
      this.currentCell.col == col
    )
      this.setCurrentCell(null);
    else this.setCurrentCell({ col, row });
    this.Redraw();
  }

  private setCurrentCell(loc: BoardLocation | null): void {
    let prev = this.currentCell
      ? { col: this.currentCell.col, row: this.currentCell.row }
      : null;
    let ev = new CustomEvent<{
      prev: BoardLocation | null;
      current: BoardLocation | null;
    }>("selectcell", {
      detail: {
        prev: prev,
        current: loc,
      },
    });
    let result = this.canvas.dispatchEvent(ev);
    if (result) this.currentCell = loc;
  }

  public SetPieces(pieces: Array<Piece>) {
    this.pieces = pieces;
  }

  public SetFont(value: string) {
    this.currentFigurine = this.figurineCfgs[value] ?? this.currentFigurine;
  }
  public AddFontConfig(arg0: string, cfgFigurine: FigurineConfig) {
    this.figurineCfgs[arg0] = cfgFigurine;
  }
  public Redraw() {
    requestAnimationFrame(() => {
      this.setSizes();
      this.drawBoard();
      this.applyToOriginal();
    });
  }

  private applyToOriginal() {
    const ctxo = this.original.getContext("2d");
    if (ctxo == null) return;
    ctxo.drawImage(
      this.canvas,
      0,
      0,
      this.original.width,
      this.original.height
    );
  }

  private drawCell(row: number, col: number) {
    this.ctx.save();
    this.ctx.fillStyle = this.options.CELLCOLORS[this.darkCells(row, col)];
    this.ctx.fillRect(
      this.cellSize * col,
      this.cellSize * row,
      this.cellSize,
      this.cellSize
    );
    this.ctx.stroke();
    this.ctx.restore();
  }

  private darkCells(row: number, col: number): number {
    return col % 2 ? (row + 1) % 2 : row % 2;
  }

  private highlightingCurrentCell() {
    if (!this.currentCell) return;
    this.ctx.save();
    this.ctx.strokeStyle = "#00FF00";
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = "rgba(0,255,0,.2)";
    this.ctx.fillRect(
      this.cellSize * this.currentCell.col,
      this.cellSize * this.currentCell.row,
      this.cellSize,
      this.cellSize
    );
    this.ctx.strokeRect(
      this.cellSize * this.currentCell.col,
      this.cellSize * this.currentCell.row,
      this.cellSize,
      this.cellSize
    );
    this.ctx.restore();
  }

  private drawEmptyBoard() {
    for (let col = 0; col < 8; col++)
      for (let row = 0; row < 8; row++) this.drawCell(row, col);
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
    pieces.forEach((p) => {
      if (p.loc) this.drawPiece(p);
    });
  }

  private drawPieceBg(piece: Piece) {
    const figBackground =
      this.currentFigurine.background?.[piece.figurine] ??
      this.currentFigurine.black[piece.figurine];
    this.drawPieceColor(
      figBackground,
      this.options.PIECECOLORS[0],
      this.PIECESTROKECOLORS[0]
    );
  }

  private drawPieceFg(piece: Piece) {
    const figBackground = this.currentFigurine[piece.color][piece.figurine];
    this.drawPieceColor(
      figBackground,
      this.options.PIECECOLORS[1],
      this.PIECESTROKECOLORS[1]
    );
  }

  private drawPieceColor(figurine: string, fill: string, stroke: string) {
    this.ctx.lineWidth = this.fontStroke * 3;
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
    this.ctx.strokeText(figurine, 0, 0);
    this.ctx.fillText(figurine, 0, 0);
  }

  private getPieceCoords(piece: Piece): { _x: number; _y: number } {
    let loc = piece.loc;
    if (!loc) loc = { col: BoardFile.A, row: BoardRank.R1 };
    const _x = loc.col * this.cellSize + this.offset;
    const _y = loc.row * this.cellSize + this.cellSize - this.offset;
    return { _x, _y };
  }

  private drawPiece(piece: Piece) {
    const { _x, _y } = this.getPieceCoords(piece);
    let adjust = this.fontSize * (this.currentFigurine.adjust ?? 0);

    this.ctx.save();

    this.ctx.font = `${this.fontSize}px "${this.currentFigurine.fontFamily}"`;
    if (piece.rot != null) {
      this.ctx.translate(_x, _y);
      this.ctx.rotate(piece.rot * (Math.PI / 180));
      this.ctx.translate(0, adjust);
    } else {
      this.ctx.translate(_x, _y + adjust);
    }
    this.drawPieceBg(piece);
    this.drawPieceFg(piece);
    this.ctx.restore();
  }

  private drawBoard() {
    this.drawEmptyBoard();
    this.drawBorder();
    this.highlightingCurrentCell();
    this.drawPieces(this.pieces);
  }
}

export default CanvasChessBoard;
