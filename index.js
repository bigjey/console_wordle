const readline = require("readline");

const WORDS = [
  "bitch",
  "hover",
  "ridge",
  "rugby",
  "toast",
  "handy",
  "claim",
  "waste",
  "sweep",
  "adopt",
  "graze",
  "slump",
  "bread",
  "siege",
  "piece",
  "agree",
  "climb",
  "snail",
  "rally",
  "glory",
  "grace",
  "heavy",
  "state",
  "steel",
  "sugar",
  "front",
  "seize",
  "clerk",
  "yearn",
  "reach",
  "print",
  "funny",
  "delay",
  "trail",
  "board",
  "child",
  "tease",
  "upset",
  "Bible",
  "press",
  "tread",
  "crack",
  "quota",
  "guest",
  "smash",
  "smile",
  "major",
  "block",
  "plain",
  "faint",
  "elect",
  "noise",
  "fence",
  "elbow",
  "rifle",
  "begin",
  "snail",
  "allow",
  "month",
  "think",
  "cable",
  "spray",
  "graze",
  "glare",
  "scene",
  "glass",
  "beach",
  "donor",
  "fleet",
  "party",
  "grave",
  "enter",
  "drive",
  "enfix",
  "chord",
  "arena",
  "table",
  "first",
  "lobby",
  "trace",
  "wrong",
  "Bible",
  "speed",
  "block",
  "utter",
  "ready",
  "trail",
  "storm",
  "budge",
  "medal",
  "novel",
  "leave",
  "gaffe",
  "agree",
  "bring",
  "gloom",
  "stamp",
  "slide",
  "basic",
  "chart",
  "debut",
  "terms",
  "ample",
  "chest",
  "enjoy",
  "state",
  "rugby",
  "forge",
  "opera",
  "alarm",
  "brick",
  "knife",
  "elbow",
  "siege",
  "ridge",
  "night",
  "house",
  "print",
  "carve",
  "sniff",
  "favor",
  "visit",
  "clean",
  "money",
  "outer",
  "rider",
  "toast",
  "layer",
  "learn",
  "kneel",
  "shaft",
  "solve",
  "elect",
  "limit",
  "dairy",
  "gloom",
  "youth",
  "waist",
  "bacon",
  "spite",
  "fairy",
  "brink",
  "chief",
  "laser",
  "image",
  "honor",
  "wreck",
  "brush",
  "aisle",
  "fraud",
  "spite",
  "cabin",
  "angel",
  "index",
  "shame",
  "track",
  "honor",
  "basin",
  "staff",
  "forum",
  "right",
  "exile",
  "voter",
  "coach",
  "crime",
  "image",
  "shock",
  "stick",
  "dance",
  "essay",
  "worth",
  "sense",
  "front",
  "false",
  "pitch",
  "donor",
  "guide",
  "quiet",
  "plant",
  "beach",
  "chair",
  "arena",
  "river",
  "white",
  "lunch",
  "cheek",
  "agree",
  "deter",
  "chief",
  "solve",
  "irony",
  "joint",
  "grant",
  "grind",
  "woman",
  "pupil",
  "lover",
  "wreck",
  "proud",
  "harsh",
];

// prettier-ignore
const LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u', 'v','w','x','y','z'];

let currentWord = pickRandomWord();
let guessedLetters = new Map();

function pickRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

console.clear();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "guess > ",
});

rl.prompt();

const WORD_LENGTH = 5;

rl.on("line", (line) => {
  const word = line.trim().toLowerCase();

  if (!word.match(`\\w\{${WORD_LENGTH},${WORD_LENGTH}\}`)) {
    console.warn(`error: guess must have excatly ${WORD_LENGTH} letters`);
  } else {
    const guessResult = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = word[i];

      guessedLetters.set(letter);
      let match = "none";

      if (word[i] === currentWord[i]) {
        match = "exact";
      } else if (currentWord.indexOf(word[i]) !== -1) {
        match = "partial";
      }

      const r = {
        letter: letter.toUpperCase(),
        match,
      };

      guessResult.push(r);

      guessedLetters.set(letter, r);
    }
    process.stdout.write("\n");

    for (const l of LETTERS) {
      const r = guessedLetters.get(l);
      if (r) {
        if (r.match === "exact") {
          process.stdout.write(g(l.toUpperCase()));
        } else if (r.match === "partial") {
          process.stdout.write(y(l.toUpperCase()));
        } else {
          process.stdout.write(w(l.toUpperCase()));
        }
      } else {
        process.stdout.write(l.toUpperCase());
      }

      process.stdout.write(" ");
    }

    process.stdout.write("\n");
    process.stdout.write("\n");

    for (const r of guessResult) {
      if (r.match === "exact") {
        process.stdout.write(g(r.letter));
      } else if (r.match === "partial") {
        process.stdout.write(y(r.letter));
      } else {
        process.stdout.write(w(r.letter));
      }
      process.stdout.write(" ");
    }

    process.stdout.write("\n");
    process.stdout.write("\n");
    if (word === currentWord) {
      console.log("fuck yeah! good job!\n");
      rl.close();
    }
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

const g = (s) => `\x1b[30m\x1b[42m ${s} \x1b[0m`;
const y = (s) => `\x1b[30m\x1b[43m ${s} \x1b[0m`;
const w = (s) => `\x1b[30m\x1b[47m ${s} \x1b[0m`;
