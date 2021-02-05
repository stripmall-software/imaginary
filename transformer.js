const sharp = require('sharp');
const {breakOnTruthy, cleanObject} = require('./helpers')
const  mime = require('mime-types')
const {last, split, tryCatch, pipe, isNil, find, startsWith} = require('rambda')
const {logger} = require('./logger')

    const constructOptions = (parts) => {
        const width = extractParam('w', parts) 
        const height = extractParam('h', parts) 
        return cleanObject({width, height})
    }

    const extractParam = (_in, parts) => tryCatch(pipe(
        find(startsWith(`${_in}_`)),
        breakOnTruthy(isNil, 'nil'),
        split('_'),
        last,
        parseInt
    ), _ => null)(parts)

    const _transform = (transforms, res) =>sharp().resize(constructOptions(transforms))
    .on('error', err => console.log('error'));
 
    const _transformWebp = transforms => _transform(transforms).webp()

    const transform = (mimeType, transforms) => mimeType ==='image/webp'
    ?_transform(transforms): _transform(transforms)

    module.exports = {
        constructOptions,
        transform,
        _transform
    }