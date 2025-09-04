/**
 * @fileoverview feature importPathSlice relative path checker
 * @author vlad_vs
 */
"use strict";

const path = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature importPathSlice relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {}, // Add messageId and message
  },

  create(context) {

    return {
      ImportDeclaration(node){

        const importPath = node.source.value // example 'shared/lib/classnames'

        const filePath = context.getFilename() // example C:\Users\Admin\Desktop\react_advanced\src\shared\ui\Input\Input.tsx

        if(shouldBeRelative(filePath,importPath)){
          context.report(node, "В рамках одного слайса импорты должны быть относительными")
        }




      }
    };
  },
};

/*в рамках одного модуля должны быть относительные пути!!!
к примеру - в файле по адресу  src/shared/ui/Input/Input.tsx не должно быть импорта shared/ui/...
 */

const layers = new Set(['entities','pages','features','widgets','pages','shared'])

function isPathRelative(pathValue){
  return pathValue === '.' || pathValue.startsWith('./') || pathValue.startsWith('../')
}

function shouldBeRelative(filePath,importPath){
 if(isPathRelative(filePath)) return false;
debugger
 const importPathArray = importPath.split('/')

  const importPathLayer = importPathArray[0] //entities
  const importPathSlice = importPathArray[1] //Article

if(!importPathLayer || !importPathSlice || !(layers.has(importPathLayer))) return false

  const normalizedPath = path.toNamespacedPath(filePath)
  const filePathAfterSRC =  normalizedPath.split('src')[1].split('\\')
  const filePathLayer =  filePathAfterSRC[1]
  const filePathSlice =  filePathAfterSRC[2]
    if(!filePathLayer || !filePathSlice || !(layers.has(filePathLayer))) return false

    return importPathLayer === filePathLayer && importPathSlice === filePathSlice

}

shouldBeRelative('C:\\Users\\Admin\\Desktop\\react_advanced\\src\\shared\\ui\\Input\\Input.tsx','shared/lib/classnames')


