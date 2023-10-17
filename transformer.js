const sharp = require('sharp');
const {breakOnTruthy, cleanObject} = require('./helpers')
const  mime = require('mime-types')
const {last, split, tryCatch, pipe, isNil, find, startsWith} = require('rambda')
const {logger} = require('./logger')

    const constructResizeOptions = (parts) => {
        const width = parseInt(extractParam('w', parts))
        const height = parseInt(extractParam('h', parts))
        return cleanObject({width, height})
    }

const getFileFormat = (parts) => {
    return extractParam('f', parts)

}

    const extractParam = (_in, parts) => tryCatch(pipe(
        find(startsWith(`${_in}_`)),
        breakOnTruthy(isNil, 'nil'),
        split('_'),
        last
    ), _ => null)(parts)



    const _transform = (transforms, res) =>sharp().resize(constructResizeOptions(transforms))
    .on('error', err => console.log('error'));

    const _transformWebp = transforms => _transform(transforms).webp()
    const _transformAvif = transforms => _transform(transforms).avif()

    const transform = (mimeType, transforms) => mimeType ==='image/webp'
    ?_transform(transforms): _transform(transforms)

    module.exports = {
        constructOptions: constructResizeOptions,
        transform,
        _transform,
        _transformWebp,
        _transformAvif,
        getFileFormat
    }
