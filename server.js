const http = require("http");

const {
  processGuess,
  pickRandomWord,
  formatGuess,
  formatGuessedLetters,
} = require("./lib");

const PORT = process.env.PORT || 4321;

const answersByIp = {};
const guessedByIp = {};
const guessesByIp = {};

function resetUserData(addr) {
  guessedByIp[addr] = new Map();
  guessesByIp[addr] = [];
  answersByIp[addr] = pickRandomWord();
}

const RULES = `
Welcome to wordle game.

Commands:
/giveup - get the answer and generate new word
/new - generate new word
/<your 5 letter guess> - guess the answer

If you guess correctly, new word will be generated automatically
`;

http
  .createServer(function (request, response) {
    let addr =
      request.headers["x-forwarded-for"] || request.socket.remoteAddress;
    if (!addr) {
      response.writeHead(500);
      response.end("can't identify session\n");
      return;
    }
    if (guessedByIp[addr] === undefined) {
      guessedByIp[addr] = new Map();
    }
    if (guessesByIp[addr] === undefined) {
      guessesByIp[addr] = [];
    }
    if (answersByIp[addr] === undefined) {
      answersByIp[addr] = pickRandomWord();
    }
    const guessed = addr ? guessedByIp[addr] : null;
    const guesses = addr ? guessesByIp[addr] : [];

    const guess = request.url.slice(1).trim().toLowerCase();

    if (guess === "") {
      response.writeHead(200);
      response.end(`${RULES}\n`);
      return;
    }

    if (guess === "new") {
      resetUserData(addr);
      response.writeHead(200);
      response.end("\nnew word was generated\n");
      return;
    }

    if (guess === "giveup") {
      resetUserData(addr);
      response.writeHead(200);
      response.end(`\nthe word was "${answersByIp[addr]}"\n`);

      return;
    }

    if (!guess.match(/[a-zA-Z]{5}/)) {
      response.writeHead(400);
      response.end("must be a 5 letters word");
      return;
    }

    const result = processGuess(guess, answersByIp[addr]);
    guesses.push(result);
    for (const r of result) {
      if (!guessed.has(r.letter) || r.match === "exact") {
        guessed.set(r.letter, r);
      }
    }

    let finalMessage = "";

    const formattedLetters = formatGuessedLetters(guessed);

    finalMessage += `\n`;
    finalMessage += formattedLetters;
    for (const g of guesses) {
      finalMessage += `\n`;
      finalMessage += formatGuess(g);
    }
    if (guess === answersByIp[addr]) {
      resetUserData(addr);
      finalMessage += "\nWell done!\n";
    }

    response.writeHead(200);
    response.end(finalMessage);
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
