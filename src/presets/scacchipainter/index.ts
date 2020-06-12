import { FigurineConfig } from "../../canvasChessBoard";
export function GetConfig(): FigurineConfig {
  return {
    fontFamily: "ScacchiPainter",
    fontSize: 0.9,
    white: {
      a: "w_a",
      b: "w_b",
      e: "w_e",
      k: "w_k",
      n: "w_n",
      p: "w_p",
      q: "w_q",
      r: "w_r",
      t: "w_t",
    },
    black: {
      a: "b_a",
      b: "b_b",
      e: "b_e",
      k: "b_k",
      n: "b_n",
      p: "b_p",
      q: "b_q",
      r: "b_r",
      t: "b_t",
    },
    neutral: {
      a: "n_a",
      b: "n_b",
      e: "n_e",
      k: "n_k",
      n: "n_n",
      p: "n_p",
      q: "n_q",
      r: "n_r",
      t: "n_t",
    },
    background: {
      a: "__a",
      b: "__b",
      e: "__e",
      k: "__k",
      n: "__n",
      p: "__p",
      q: "__q",
      r: "__r",
      t: "__t",
    },
  };
}
