/* eslint-disable no-underscore-dangle */
import fs from 'fs'
import path from 'path'
import traverse from '@babel/traverse'
import * as parser from '@babel/parser'

const jsome = require('jsome')

type ParserOptions = {
  sourceType: 'module'
  plugins: any[]
}
const option: ParserOptions = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
}

const endpointPath = path.resolve(process.argv[2])
const endpoint = fs.readFileSync(endpointPath).toString()
const ast = parser.parse(endpoint, option)

const retrieveDependencies = (ast: any) => {
  const dependsOn: any = []
  traverse(ast, {
    enter(nodePath: any) {
      if (nodePath.node.type === 'ImportDeclaration') {
        const fileName = `${path.dirname(endpointPath)}/${
          nodePath.node.source.value
        }.jsx`
        console.log(fileName)

        const content = fs.readFileSync(fileName).toString()
        console.log(content)

        const __ast = parser.parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        })
        dependsOn.push({
          objectName: nodePath.node.specifiers.map(
            (node: any) => node.local.name
          ),
          file: nodePath.node.source.value,
          dependOn: retrieveDependencies(__ast),
        })
      }
    },
  })
  return dependsOn
}

const tree = retrieveDependencies(ast)

console.log(jsome(tree))
