import { FigurineConfig } from "../../canvasChessBoard";

export function GetConfig(): FigurineConfig {
  return {
    fontFamily: "Problemiste",
    fontSize: 1.11,
    adjust: 0.08,
    white: {
      k: String.fromCharCode(192),
      q: String.fromCharCode(193),
      r: String.fromCharCode(194),
      b: String.fromCharCode(195),
      n: String.fromCharCode(196),
      p: String.fromCharCode(197),
      e: String.fromCharCode(204),
      t: String.fromCharCode(205),
      a: String.fromCharCode(206),
    },
    black: {
      k: String.fromCharCode(198),
      q: String.fromCharCode(199),
      r: String.fromCharCode(200),
      b: String.fromCharCode(201),
      n: String.fromCharCode(202),
      p: String.fromCharCode(203),
      e: String.fromCharCode(207),
      t: String.fromCharCode(208),
      a: String.fromCharCode(209),
    },
    neutral: {
      k: String.fromCharCode(192),
      q: String.fromCharCode(193),
      r: String.fromCharCode(194),
      b: String.fromCharCode(195),
      n: String.fromCharCode(196),
      p: String.fromCharCode(197),
      e: String.fromCharCode(204),
      t: String.fromCharCode(205),
      a: String.fromCharCode(206),
    },
    background: {
      k: String.fromCharCode(198),
      q: String.fromCharCode(199),
      r: String.fromCharCode(200),
      b: String.fromCharCode(201),
      n: String.fromCharCode(202),
      p: String.fromCharCode(203),
      e: String.fromCharCode(207),
      t: String.fromCharCode(208),
      a: String.fromCharCode(209),
    },
  };
}
