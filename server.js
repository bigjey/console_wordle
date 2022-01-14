const http = require("http");

const {
  processGuess,
  pickRandomWord,
  formatGuess,
  formatGuessedLetters,
  g,
  y,
  w,
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

const WELCOME = `
Welcome to wordle game.

The goal is to guess a 5-letter word.

You can submit your guess like this:
curl https://curl-wordle.herokuapp.com/candy

Other commands: 
/rules           - game rules and examples
/new             - generate new word
/giveup          - get the answer and generate new word

Command usage example:
curl https://curl-wordle.herokuapp.com/rules
`;

const RULES = `
Rules:

Guess the 5-letter word.

Each guess must be a valid 5 letter word.

After each guess, the color of the tiles will change to show how close your guess was to the word.

Examples:
    
The letter W is in the word and in the correct spot.
${g("W")} E A R Y
    
The letter I is in the word but in the wrong spot.
 P ${y("P")} I L L S
    
The letter U is not in the word in any spot.
 V A G ${w("U")} E

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
      response.end(`${WELCOME}`);
      return;
    }

    if (guess === "rules") {
      response.writeHead(200);
      response.end(`${RULES}`);
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

    if (!guess.match(/^[a-zA-Z]{5,5}$/)) {
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
    if (guess !== answersByIp[addr] && guesses.length === 6) {
      finalMessage += `\nOut of guesses :( The word was "${answersByIp[addr]}"\nNew word was generated\n`;
      resetUserData(addr);
    } else if (guess === answersByIp[addr]) {
      finalMessage += "\nWell done!\n";
      resetUserData(addr);
    } else {
      finalMessage += `\nGuesses left: ${6 - guesses.length}\n`;
    }

    response.writeHead(200);
    response.end(finalMessage);
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
