import { GetConfig as GetScacchiPainterCfg } from "./scacchipainter";
import { GetConfig as GetProblemisteCfg } from "./problemiste";
// import { GetConfig as GetChessFigurine } from "../src/presets/chessfigurine";
const ScacchiPainter = GetScacchiPainterCfg();
const Problemiste = GetProblemisteCfg();
const CONFIG = {
    ScacchiPainter,
    Problemiste
} as const;
export default CONFIG;
