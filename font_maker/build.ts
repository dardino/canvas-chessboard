import fs, { copyFile } from "fs";
import chalk from "chalk";
import libxmljs from "libxmljs";
import path from "path";
import { exec } from "child_process";

export interface IGeneratorOptions {
  sourceDir?: string;
  outDir?: string;
  fontName?: string;
  startUnicode?: number;
  prototypeFontFile?: string;
  cssPrefix?: string;
}

function prepare_name(stringa: string, maxlen: number) {
  return ((stringa.charAt(0).toUpperCase() + stringa.slice(1)) + (new Array(maxlen)).fill(" ").join("")).substr(0, Math.max(maxlen, stringa.length));
}
export class FontGenerator {
  private options: Required<IGeneratorOptions>;

  constructor(options?: IGeneratorOptions) {
    if (!options) options = {};
    if (!options.outDir) options.outDir = ".";
    if (!options.startUnicode) options.startUnicode = 0x1f000;
    if (!options.sourceDir) options.sourceDir = "../src";
    if (!options.prototypeFontFile)
      options.prototypeFontFile = "font.prototype.svg";
    if (!options.cssPrefix) options.cssPrefix = "icon";
    if (!options.fontName) options.fontName = "iconFont";
    this.options = options as Required<IGeneratorOptions>;
  }
  private glifi: Array<{
    descr: string;
    code: number;
    elements: libxmljs.Element[];
  }> = [];

  private Enumerate(path: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(path, (n, files) => {
        if (n == null) {
          resolve(files);
        } else {
          reject(n);
        }
      });
    });
  }

  private ReadFileContent(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, (err, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString("utf8"));
        }
      });
    });
  }

  private WriteFileContent(filePath: string, content: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, content, { encoding: "utf8" }, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public async Emit(): Promise<void> {
    console.log(`analisi folder ...`);
    const svgDir = path.join(__dirname, this.options.sourceDir, "svg");
    let files = await this.Enumerate(svgDir);
    files = files.filter(f => f.indexOf("-") == -1);
    console.log(`trovati ${chalk.red(files.length.toString())} glifi`);
    let lastCode = this.options.startUnicode;
    var works = files.map(async (f, i, a) => {
      lastCode = this.options.startUnicode + i;
      console.log(`elaboro il glifo ---> [${lastCode.toString(16)}] ${f}`);
      try {
        let content = await this.ReadFileContent(path.join(svgDir, f));
        let xmlParsed = libxmljs.parseXml(content);
        let elements = xmlParsed.childNodes();
        this.glifi.push({ code: this.options.startUnicode + i, elements, descr: f.substr(0, f.length - 4) });
      } catch (err) {
        throw err;
      }
    });
    try {
      await Promise.all(works);
    } catch (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    console.log("Lettura glifi terminata.");
    console.log("Carico il font prototipo...");
    let { xmlFont, fontElement } = await this.LoadFontProto(this.options.startUnicode, lastCode);
    console.log("Aggiungo i glifi...");
    this.glifi
      .sort((a, b) => a.code - b.code)
      .forEach(g => {
        var glyph = new libxmljs.Element(xmlFont, "glyph");
        glyph.attr({
          unicode: `&#x${g.code.toString(16)};`,
          "glyph-name": g.descr
        });
        g.elements.forEach(e => {
          e.namespace(null as any);
          glyph.addChild(e);
        });

        fontElement[0].addChild(glyph);
      });
    console.log("Genero il font...");
    let outFile = path.join(
      __dirname,
      this.options.outDir,
      this.options.fontName + ".svg"
    );
    try {
      await this.EnsurePathExists(path.join(__dirname, this.options.outDir));
      await this.WriteFileContent(
        outFile,
        xmlFont.toString(false).replace(/unicode="&amp;#/g, 'unicode="&#')
      );
      console.log("Creo i vari formati...");
      await this.Convert(outFile);
      console.log("Creo il file icons.ts...");
      await this.CreateIconsTS();
      await this.CreateCSS();
      console.log(chalk.green("Done!"));
    } catch (err) {
      console.error(err);
      process.exit(1);
      return;
    }
  }
  private async LoadFontProto(unicodeMin: number, unicodeMax: number) {
    let range = `${unicodeMin.toString(16)}-${unicodeMax.toString(16)}`.toUpperCase();
    let fontProto = await this.ReadFileContent(
      __dirname + "/" + this.options.prototypeFontFile
    );
    fontProto = fontProto.replace(/\{FontName\}/g, this.options.fontName);
    fontProto = fontProto.replace(/\{unicodeRange\}/g, `U+${range}`);
		let xmlFont = libxmljs.parseXml(fontProto);
		let fontElement = xmlFont.find(`//*[name() = 'font']`);
    if (!fontElement || fontElement.length != 1) {
      console.error(
        "Font prototipo non valido, deve esistere il tag <font> e deve essere unico all'interno del file per poter creare i glifi"
      );
      process.exit(1);
      throw new Error(
        "Font prototipo non valido, deve esistere il tag <font> e deve essere unico all'interno del file per poter creare i glifi"
      );
    }
    return { xmlFont, fontElement };
  }
  private async CreateIconsTS() {
    let maxlen = this.glifi.reduce((max, f) => Math.max(max, f.descr.length), 0);
    var parts: string[] = ([] as string[])
			.concat([`module FontGliphs {`])
			.concat(
				this.glifi.map(g =>
					[
						`\texport const char_${prepare_name(g.descr, maxlen)} = '&#${g.code}';`,
						`\texport const code_${prepare_name(g.descr, maxlen)} = ${g.code};`
					].join("\t")
				)
			)
			.concat([`}`])
			.concat([`export default FontGliphs;`]);
    await this.WriteAllRows(path.join(__dirname, this.options.outDir, "fonts.ts"), parts);
  }

  private async CreateCSS() {
    const fontName = this.options.fontName;
    var parts: string[] = [
      `@font-face {`,
      ` font-family: '${fontName}';`,
      ` font-style: normal;`,
      ` font-weight: 400;`,
      ` src: url('./${fontName}.woff') format('woff'),`,
      `      url('./${fontName}.ttf') format('truetype'),`,
      `      url('./${fontName}.svg') format('svg'),`,
      `      url('./${fontName}.woff2') format('woff2');`,
      `}`,
      `.${this.options.cssPrefix} {`,
      `  font-family: ${fontName};`,
      `}`
    ];

    let outfile = path.join(__dirname, this.options.outDir, fontName + ".css");
    await this.WriteAllRows(outfile, parts);
  }

  private WriteAllRows(fileName: string, rows: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let stream = fs.createWriteStream(fileName);
      rows.forEach(row => {
        stream.write(row + "\n");
      });
      stream.end(() => {
        resolve();
      });
    });
  }

  private EnsurePathExists(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(path, err => {
        if (err && err.code != "EEXIST") {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  private Convert(outFile: string) {
    return new Promise<void>((resolve, reject) => {
      exec(
        `fontforge -script ${path.join(
          __dirname,
          "convert.pe"
        )} ${outFile}`,
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

new FontGenerator({
  outDir: "../src/font",
  startUnicode: 0x265A,
  sourceDir: "../src/assets",
  prototypeFontFile: "./font.prototype.svg",
  cssPrefix: "chess-icon",
  fontName: "chess-figurine"
}).Emit();
