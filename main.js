const fs = require('fs');

// Token Class
class Token {
  constructor(name) {
    this.name = name;
  }

  static left      = new Token('SHIFT LEFT');
  static right     = new Token('SHIFT RIGHT');
  static increment = new Token('INCREMENT');
  static decrement = new Token('DECREMENT');
  static loopStart = new Token('LOOP START');
  static loopEnd   = new Token('LOOP END');
  static print     = new Token('PRINT');
  static read      = new Token('READ');
}

const lex = (string) => {

  const tokens = [];

  const symbols = {
    '<': Token.left,
    '>': Token.right,
    '+': Token.increment,
    '-': Token.decrement,
    '[': Token.loopStart,
    ']': Token.loopEnd,
    '.': Token.print,
    ',': Token.read
  };

  for (let i = 0, l = string.length; i < l; i++) {
    const char = string[i];
    const newToken = symbols[char];

    if (newToken) tokens.push(newToken);
  }

  return tokens;
};

const parse = (tokens) => {
  //DECLARE FUNCTIONS
  const shiftL = () => {
    pointer = (pointer === 0 ? tape.length - 1 : pointer - 1);
  };

  const shiftR = () => {
    pointer = (pointer === tape.length - 1 ? 0 : pointer + 1);
  };

  const increment = () => {
    tape[pointer] = (tape[pointer] === 255 ? 0 : tape[pointer] + 1);
  };

  const decrement = () => {
    tape[pointer] = (tape[pointer] === 0 ? 255 : tape[pointer] - 1);
  };

  const loop = (instructions) => {
    while (tape[pointer] !== 0) {
      for (let i = 0, l = instructions.length; i < l; i++) {
        const op = instructions[i]
        op();
      }
    }
  };

  const print = () => {
    const char = String.fromCharCode(tape[pointer]);
    result += char;
  };

  const read = () => {
    //NYI
  };


  const program = [];
  
  //ITERATE OVER TOKENS
  for (let i = 0, l = tokens.length; i < l; i++) {
    const token = tokens[i];

    switch (token) {
      case Token.left:      program.push(shiftL);    break;
      case Token.right:     program.push(shiftR);    break;
      case Token.increment: program.push(increment); break;
      case Token.decrement: program.push(decrement); break;
      case Token.print:     program.push(print);     break;
      case Token.read:      program.push(read);      break;
      
      case Token.loopStart:
        const group = [];
        let j = i + 1;
        let depth = 1;
        while (depth) {
          const tkn = tokens[j];

          if (tkn === Token.loopStart) depth++;
          else if (tkn === Token.loopEnd) depth--;
          if (depth) group.push(tkn);
          j++;
          i = j - 1;
        }

        const subroutine = parse(group);
        program.push(() => loop(subroutine));

        break;

      case Token.loopEnd:
        throw new SyntaxError('Unexpected symbol "]"');
        break;
      
      default: break;
    }
  }
  return program;
};

let pointer = 0;
const tape = new Array(300).fill(0);
let result = '';

const execute = (prog) => {
  for (let i = 0, l = prog.length; i < l; i++) {
    const op = prog[i];

    if (Array.isArray(op)) {
      while (tape[pointer] !== 0) {
        execute(op);
      }
    } else {
      op();
    }
  }
  return result;
};

const brainfuck = (string, verbose = false) => {


  const tokens = lex(string);
  const program = parse(tokens);
  const result = execute(program);

  if (verbose) {
    console.log(`Source: ${string}\n`);
    console.log('\nTokens:');
    console.log(tokens);
    console.log('\nProgram:');
    console.log(program);
    console.log('\nFinal Tape:');
    console.log(tape);
  }
  return `\nOutput: "${result}"`;
};
// Export Object
const bf = {
  Token,
  lex,
  parse,
  execute,
  brainfuck
};

// const sampleProg = '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.';
const sampleProg = '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.';
// let sampleProg = '';

// for (let i = 0; i < 72; i++) sampleProg += '+';
// sampleProg += '.';
// for (let i = 0; i < 29; i++) sampleProg += '+';
// sampleProg += '.';
// for (let i = 0; i < 7; i++) sampleProg += '+';
// sampleProg += '..';
// for (let i = 0; i < 3; i++) sampleProg += '+';
// sampleProg += '.';

// const sampleProg = '+[-+[+-]+]';

// const sampleProg = '+++++>+++++++[-<+>].';

// const sampleProg = '++++++[>++++++++++<-]>+++++++.';

console.log(brainfuck(sampleProg));

module.exports = bf