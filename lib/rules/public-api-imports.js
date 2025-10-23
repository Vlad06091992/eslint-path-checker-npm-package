/**
 * @fileoverview feature importPathSlice relative path checker
 * @author vlad_vs
 */
"use strict";

const path = require('path')
const {isPathRelative} = require("../helpers");
const {checkingImportsLayers} = require("../constants");
const {isMatch} = require("micromatch");

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
                    },
                    testFilesPatterns: {
                        type: 'array',
                    },
                }
            }
        ],// Add a schema if the rule has options
        messages: {}, // Add messageId and message
    },

    create(context) {
        const {alias = '', testFilesPatterns = []} = context?.options?.[0] || {}

        return {
            ImportDeclaration(node) {

                let importPath = node.source.value // example 'shared/lib/classnames'

                if (alias) importPath = importPath.replace(`${alias}/`, '');
                const importPathArray = importPath.split('/')

                const filePath = context.getFilename() // example C:\Users\Admin\Desktop\react_advanced\src\shared\ui\Input\Input.tsx

                const isValidImport = validateImport(filePath, importPathArray);
                const isValidTestingImport = validateTestingImport(filePath, importPathArray);
                const isTestFile = testFilesPatterns.some(testFilePattern => isMatch(filePath, testFilePattern));

                if (isTestFile && !isValidTestingImport) {
                    context.report(node, "Тестовые данные необходимо импортировать из publicApi/testing.ts")
                } else if(!isTestFile && !isValidImport) {
                    context.report(node, "Абсолютный импорт разрешен только из Public API (index.ts)")
                }


            }
        };
    },
};

/*в рамках одного модуля должны быть относительные пути!!!
к примеру - в файле по адресу  src/shared/ui/Input/Input.tsx не должно быть импорта shared/ui/...
 */


function validateImport(filePath, importPathArray) {
    if (isPathRelative(filePath)) return true;
    const layer = importPathArray[0];


    if (!checkingImportsLayers.has(layer)) return true;
    return importPathArray.length <= 2

}

function validateTestingImport(filePath, importPathArray) {
    return importPathArray[2] === 'testing' && importPathArray.length < 4;
}
