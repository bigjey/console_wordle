const WORDS = require("./words");

// prettier-ignore
const LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u', 'v','w','x','y','z'];

function pickRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

const g = (s) => `\x1b[30m\x1b[42m ${s} \x1b[0m`;
const y = (s) => `\x1b[30m\x1b[43m ${s} \x1b[0m`;
const w = (s) => `\x1b[30m\x1b[47m ${s} \x1b[0m`;

function processGuess(guess, answer) {
  const result = [];

  for (let i = 0; i < 5; i++) {
    const letter = guess[i];

    let match = "none";

    if (guess[i] === answer[i]) {
      match = "exact";
    } else if (answer.indexOf(guess[i]) !== -1) {
      match = "partial";
    }

    const r = {
      letter,
      match,
    };

    result.push(r);
  }

  return result;
}

function formatGuess(guessResult) {
  let result = "";

  for (const r of guessResult) {
    const l = r.letter.toUpperCase();
    let f;
    if (r.match === "exact") {
      f = g(l);
    } else if (r.match === "partial") {
      f = y(l);
    } else {
      f = w(l);
    }
    result += f;
    result += " ";
  }

  result += "\n";

  return result;
}

function formatGuessedLetters(guesses) {
  let result = "";

  for (const l of LETTERS) {
    const r = guesses.get(l);
    let f = w;
    if (r) {
      if (r.match === "exact") {
        f = g;
      } else if (r.match === "partial") {
        f = y;
      }
      result += `${f(l.toUpperCase())}`;
    } else {
      result += `${l.toUpperCase()}`;
    }
    result += " ";
  }

  result += "\n";

  return result;
}

module.exports = {
  g,
  y,
  w,
  pickRandomWord,
  processGuess,
  formatGuess,
  formatGuessedLetters,
  LETTERS,
};
