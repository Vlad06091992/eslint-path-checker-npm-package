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
        fixable: null, // Or `code` or `whitespace`
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

        console.log('ALIAS', alias);


        return {
            ImportDeclaration(node){

                let importPath = node.source.value // example 'shared/lib/classnames'

                if(alias) importPath = importPath.replace(`${alias}/`, '');

                const filePath = context.getFilename() // example C:\Users\Admin\Desktop\react_advanced\src\shared\ui\Input\Input.tsx

                if(!validateImport(filePath,importPath)){
                    context.report(node, "Абсолютный импорт разрешен только из Public API (index.ts)")
                }
            }
        };
    },
};

/*в рамках одного модуля должны быть относительные пути!!!
к примеру - в файле по адресу  src/shared/ui/Input/Input.tsx не должно быть импорта shared/ui/...
 */



function validateImport(filePath,importPath){
    if(isPathRelative(filePath)) return true;
    const importPathArray = importPath.split('/')
    const layer = importPathArray[0];

    if(!layers.has(layer))  return true;
    return importPathArray.length <= 2 || importPathArray.length === 3 && importPathArray[2] === 'testing' ;

}
// console.log(
// shouldBeRelative('C:\\Users\\Admin\\Desktop\\react_advanced\\src\\shared\\ui\\Input\\Input.tsx','shared/lib/classnames')
// shouldBeRelative('C:\\Users\\Admin\\Desktop\\study_folder\\ulbi\\react_advanced\\src\\features\\AddCommentForm\\model\\services\\sendComment.tsx','@/features/AddCommentForm/model/slices/addCommentFormSlice')

// )


// console.log(shouldBeRelative('C:\\Users\\Admin\\Desktop\\study_folder\\ulbi\\react_advanced\\src\\features\\AddCommentForm\\model\\services\\sendComment.tsx','@/features/AddCommentForm/model/slices/addCommentFormSlice'))


