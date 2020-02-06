const babelParser = require('@babel/parser')
const jsome = require('jsome')

const ast = babelParser.parse(
  `
import AnotherComponent from "./AnotherComponent";
import { AnotherComponent2 } from "./AnotherComponent2";

const a = () => {
    return <p>1</p>;
};
`,
  {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  }
)

console.log(jsome(ast.program.body))
