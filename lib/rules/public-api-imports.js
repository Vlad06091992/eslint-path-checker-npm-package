const {isPathRelative} = require("../helpers");
const {checkingImportsLayers} = require("../constants");
const {isMatch} = require("micromatch");

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature importPathSlice relative path checker",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
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
        fixable: 'code', // Or `code` or `whitespace`
        messages: {
            [PUBLIC_ERROR]: 'Абсолютный импорт разрешен только из Public API (index.ts)',
            [TESTING_PUBLIC_ERROR]: 'Тестовые данные необходимо импортировать из publicApi/testing.ts',
        },
    },

    create(context) {
        const {alias = '', testFilesPatterns = []} = context?.options?.[0] || {}

        return {
            ImportDeclaration(node) {

                let importPath = node.source.value // example 'shared/lib/classnames'

                if (alias) importPath = importPath.replace(`${alias}/`, '');

                const importPathArray = importPath.split('/')
                const layer = importPathArray[0];
                const slice = importPathArray[1];
                const filePath = context.getFilename() // example C:\Users\Admin\Desktop\react_advanced\src\shared\ui\Input\Input.tsx

                const isValidImport = validateImport(filePath, importPathArray);
                const isValidTestingImport = validateTestingImport(filePath, importPathArray);
                const isTestFile = testFilesPatterns.some(testFilePattern => isMatch(filePath, testFilePattern));

                if (isTestFile && !isValidTestingImport) {
                    context.report({
                        node,
                        messageId: TESTING_PUBLIC_ERROR,

                    });
                }
                else if(!isTestFile && !isValidImport) {
                    context.report({
                        node,
                        messageId: PUBLIC_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
                        }
                    });
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
