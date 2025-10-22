function isPathRelative(pathValue){
    return pathValue === '.' || pathValue.startsWith('./') || pathValue.startsWith('../')
}

module.exports.isPathRelative = isPathRelative