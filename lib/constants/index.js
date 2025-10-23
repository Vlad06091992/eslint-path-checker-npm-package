const layers = new Set(['entities','pages','features','widgets','pages','shared'])
const checkingImportsLayers = new Set([...layers].filter(layer => layer !== 'shared'));
module.exports = {layers, checkingImportsLayers};