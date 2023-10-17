const express = require('express')
const {last, head, curry} = require('rambda')
const  mime = require('mime-types')
const {parseUrl, extractTransforms, fetchStream, makeBucketName, removeDblSlash} = require('./helpers')
const {getFileFormat, _transform, _transformWebp, _transformAvif} = require('./transformer')
//const {getStream,  put, bucket} = require('./streamer').init(process.env.IMAGE_BUCKET)
const {logger} = require('./logger')

//imaginary requires a json file mapping directories to remote resources. A sample can be found in __urlMap.json
const mapz = require('./urlMap.json');

const app = express()
const PORT = process.env.PORT || 8080;

app.get('/test', (req, res) => {
  res.send('ok')
})

app.get('/*', async (req, res) => {
  const info = parseUrl(mapz,req.url)
  if (!info) {
    logger.debug('failing  ' + req.url )
    return res.sendStatus(400);
  }
  logger.debug('handling  ' + last(last(info)))

  return handleFile(res, info)
})

const handleFile = async (res, parsedUrl) => {
  try {
    const domain = last(head(parsedUrl))
    const transforms = extractTransforms(head(last(parsedUrl)))
    console.log(transforms)
    const fileFormat = getFileFormat(transforms)
    const filename = removeDblSlash(last(last(parsedUrl)))
    const mimeType = fileFormat?mime.lookup(fileFormat):mime.lookup(filename);
    res.setHeader('content-type', mimeType);
    const inStream = await fetchStream(domain+filename)
    if(fileFormat==='avif')
      inStream.pipe(_transformAvif(transforms)).pipe(res)
    else if(fileFormat==='webp') {
      inStream.pipe(_transformWebp(transforms)).pipe(res)
    }
    else
      inStream.pipe(_transform(transforms)).pipe(res)
    //put(makeBucketName(parsedUrl), inStream.pipe(_transform(transforms)));

  } catch (e) {
    logger.warn(e)
    res.setHeader('imaginary-status', 'FAIL');
    return res.sendStatus(404)
  }
}


if ( process.env.NODE_ENV != 'test')
  app.listen(PORT, () => {
    console.log(`cheepenarylistening on ${PORT}`)
  })

module.exports = {app,
          logger}

