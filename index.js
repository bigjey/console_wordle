const readline = require("readline");
const { pickRandomWord, LETTERS, w, g, y, processGuess } = require("./lib");

let currentWord = pickRandomWord();
let guessedLetters = new Map();

console.clear();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

const WORD_LENGTH = 5;

rl.on("line", (line) => {
  const word = line.trim().toLowerCase();

  if (!word.match(`\\w\{${WORD_LENGTH},${WORD_LENGTH}\}`)) {
    console.warn(`error: guess must have excatly ${WORD_LENGTH} letters`);
  } else {
    const guessResult = processGuess(word, currentWord);

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
      console.log("hell yeah! good job!\n");
      rl.close();
    }
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
