/**
 * @fileoverview feature importPathSlice relative path checker
 * @author vlad_vs
 */
"use strict";

const path = require('path')
const { isPathRelative } = require("../helpers");
const {layers} = require("../constants");

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
    fixable: 'code', // Or `code` or `whitespace`
      schema: [
          {
              type: 'object',
              properties: {
                  alias: {
                      type: 'string'
                  }
              }
          }
      ],// Add a schema if the rule has options
    messages: {}, // Add messageId and message
  },

  create(context) {

      const alias = context?.options[0]?.alias;

      return {
      ImportDeclaration(node){

        let importPath = node.source.value // example 'shared/lib/classnames'

          if(alias) importPath = importPath.replace(`${alias}/`, '');

        const filePath = context.getFilename() // example C:\Users\Admin\Desktop\react_advanced\src\shared\ui\Input\Input.tsx

        // if(shouldBeRelative(filePath,importPath)){
        //   context.report(node, "В рамках одного слайса все пути должны быть относительными")
        // }

          if(shouldBeRelative(filePath,importPath)){
              context.report({node,message: "В рамках одного слайса все пути должны быть относительными",
                  fix: (fixer) => {
                      const normalizedPath = getNormalizedCurrentFilePath(filePath) // /entities/Article/Article.tsx
                          .split('/')
                          .slice(0, -1)
                          .join('/');
                      let relativePath = path.relative(normalizedPath, `/${importPath}`)
                          .split('\\')
                          .join('/');

                      if(!relativePath.startsWith('.')) {
                          relativePath = './' + relativePath;
                      }

                      return fixer.replaceText(node.source, `'${relativePath}'`)
                  }
              })
          }
      }
    };
  },
};

/*в рамках одного модуля должны быть относительные пути!!!
к примеру - в файле по адресу  src/shared/ui/Input/Input.tsx не должно быть импорта shared/ui/...
 */

function getNormalizedCurrentFilePath(currentFilePath) {
    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectFrom = normalizedPath.split('src')[1];
    return projectFrom.split('\\').join('/')
}


function shouldBeRelative(filePath,importPath){
    if(isPathRelative(filePath)) return false;
 const importPathArray = importPath.split('/')
  const importPathLayer = importPathArray[0] //entities
  const importPathSlice = importPathArray[1] //Article
if(!importPathLayer || !importPathSlice || !(layers.has(importPathLayer))) return false
  const normalizedPath = path.toNamespacedPath(filePath)
  const filePathAfterSRC =  normalizedPath.split('src')[1].split('\\')
  const filePathLayer =  filePathAfterSRC[1]
  const filePathSlice =  filePathAfterSRC[2]
    if(!filePathLayer || !filePathSlice || !(layers.has(filePathLayer))) return false
    return importPathLayer === filePathLayer && importPathSlice === filePathSlice;

}
// console.log(
    // shouldBeRelative('C:\\Users\\Admin\\Desktop\\react_advanced\\src\\shared\\ui\\Input\\Input.tsx','shared/lib/classnames')
    // shouldBeRelative('C:\\Users\\Admin\\Desktop\\study_folder\\ulbi\\react_advanced\\src\\features\\AddCommentForm\\model\\services\\sendComment.tsx','@/features/AddCommentForm/model/slices/addCommentFormSlice')

// )


// console.log(shouldBeRelative('C:\\Users\\Admin\\Desktop\\study_folder\\ulbi\\react_advanced\\src\\features\\AddCommentForm\\model\\services\\sendComment.tsx','@/features/AddCommentForm/model/slices/addCommentFormSlice'))


