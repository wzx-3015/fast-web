#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const types = require('@babel/types')

const getFilePath = file => path.resolve(__dirname, file)

const loginArrayAST = types.objectExpression([
    types.objectProperty(types.Identifier('path'), types.StringLiteral('/login')),
    types.objectProperty(types.Identifier('name'), types.StringLiteral('Login')),
    types.objectProperty(types.Identifier('component'), types.Identifier('Login'))
  ]
)

const loginImportStr = `
// 登录模块
const Login = () => import('../views/Login/index.vue')
`

const loginImportAST = parser.parse(loginImportStr, {sourceType: 'module'})

// 是否接入权限平台
const permissionPlatform = true

if (permissionPlatform) {
  const code = fs.readFileSync(getFilePath('src/router/constRoutes.js'))
  
  const AST = parser.parse(code.toString(), {sourceType: 'module'})
  
  traverse(AST, {
    enter(path) {
      // 查询变量为Login的
      if (path.node.name === 'Login') {
        // 父级属性为变量声明的
        const parent = path.parent
  
        if (types.isVariableDeclarator(parent) && types.isArrowFunctionExpression(parent.init)) {
          path.parentPath.remove()
        } else if (types.isObjectProperty(parent)) {
          path.parentPath.parentPath.remove()
        }
      }
    }
  })
  
  fs.writeFileSync(getFilePath('src/router/demo.js'), generator(AST).code)
} else {
  const code = fs.readFileSync(getFilePath('src/router/demo.js'))
  const AST = parser.parse(code.toString(), {sourceType: 'module'})

  traverse(AST, {
    Program: {
      exit (path) {
        path.node.body.splice(1, 0, loginImportAST)
      }
    },
    ExportDefaultDeclaration: {
      enter(path) {
        exportName = path.node.declaration.name

        traverse(AST, {
          ArrayExpression: {
            enter(path) {
              if (path.parent.id.name === this.exportName) {
                path.node.elements.splice(1, 0,loginArrayAST)
              }
            }
          }
        }, { exportName })
      }
    },
  })

  fs.writeFileSync(getFilePath('src/router/demo01.js'), generator(AST).code)
}
