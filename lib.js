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
  const result = new Array(5);
  const counts = {};

  for (let i = 0; i < 5; i++) {
    result[i] = {
      letter: guess[i],
      match: "none",
    };

    if (counts[answer[i]] === undefined) {
      counts[answer[i]] = 0;
    }
    counts[answer[i]]++;
  }

  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (guess[i] === answer[i] && counts[letter]) {
      counts[letter]--;
      result[i].match = "exact";
    }
  }

  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (guess[i] !== answer[i] && counts[letter]) {
      counts[letter]--;
      result[i].match = "partial";
    }
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
