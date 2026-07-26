// Throwaway validator for the new Spanish data files. Delete after use.
const path = require("path");
const levels = ["a1", "a2", "b1", "b2", "c1", "c2"];
let total = 0;
let problems = 0;
for (const l of levels) {
  const file = path.resolve(__dirname, "..", "data", `words${l}es.js`);
  global.window = {};
  delete require.cache[require.resolve(file)];
  require(file);
  const key = Object.keys(global.window)[0];
  const arr = global.window[key];
  const badDef = arr.filter((w) => !w.definition || !w.definition.includes(" - "));
  const badEx = arr.filter((w) => !w.example || !w.example.includes(" - "));
  const badLevel = arr.filter((w) => w.level !== l.toUpperCase());
  const noCat = arr.filter((w) => !w.category);
  const dupes = arr.length - new Set(arr.map((w) => w.word)).size;
  const multiSep = arr.filter(
    (w) => w.definition.split(" - ").length !== 2 || w.example.split(" - ").length !== 2
  );
  total += arr.length;
  const issues =
    badDef.length + badEx.length + badLevel.length + noCat.length + dupes + multiSep.length;
  problems += issues;
  console.log(
    `${key.padEnd(14)} n=${String(arr.length).padStart(3)} badDef=${badDef.length} badEx=${badEx.length} badLevel=${badLevel.length} noCat=${noCat.length} dupes=${dupes} multiSep=${multiSep.length}`
  );
  if (multiSep.length) console.log("   multiSep sample:", multiSep.slice(0, 3).map((w) => w.word));
}
// cross-file duplicate check
const seen = new Map();
for (const l of levels) {
  const file = path.resolve(__dirname, "..", "data", `words${l}es.js`);
  global.window = {};
  delete require.cache[require.resolve(file)];
  require(file);
  const arr = global.window[Object.keys(global.window)[0]];
  for (const w of arr) {
    if (seen.has(w.word)) {
      console.log("CROSS-FILE DUPLICATE:", w.word, seen.get(w.word), "->", l);
      problems++;
    } else seen.set(w.word, l);
  }
}
console.log("TOTAL", total, "issues", problems);
