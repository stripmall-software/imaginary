const express = require('express')
const {last, head, curry} = require('rambda')
const  mime = require('mime-types')
const {parseUrl, extractTransforms, fetchStream, makeBucketName, removeDblSlash} = require('./helpers')
const {transform, _transform} = require('./transformer')
const {getStream,  put, bucket} = require('./streamer').init(process.env.IMAGE_BUCKET)
const {logger} = require('./logger')

const mapz = {
  'listhub_broker_logos':'http://brokerlogos.listhub.net',
  'listhub':'http://photos.listhub.net',
  'stripmall':'https://stripmall.software',
  'rvshare': 'https://d3adfz34ynqwkr.cloudfront.net/image/upload/rvs-images',
  'test': 'https://homepages.cae.wisc.edu/~ece533/images'
}


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
  const filename = makeBucketName(info)

  res.setHeader('content-type', mime.lookup(filename));
  res.setHeader('imaginary-status', 'HIT');
  return getStream(filename, res).then(_=> logger.debug('Cache hit ' +  filename)).catch(handleMissing(res, info))
})

const handleMissing = curry(async (res, parsedUrl, err) => {
  try {
    const domain = last(head(parsedUrl))
    const transforms = extractTransforms(head(last(parsedUrl)))
    const filename = removeDblSlash(last(last(parsedUrl)))
    const mimeType = mime.lookup(filename);
    logger.debug('Cache miss ' + domain+filename)
    res.setHeader('imaginary-status', 'MISSED');
    res.setHeader('content-type', mimeType);
    const inStream = await fetchStream(domain+filename)
    inStream.pipe(_transform(transforms)).pipe(res)
    put(makeBucketName(parsedUrl), inStream.pipe(_transform(transforms)));

  } catch {
    res.setHeader('imaginary-status', 'FAIL');
    return res.sendStatus(404)
  }
})


if ( process.env.NODE_ENV != 'test')
  app.listen(PORT, () => {
    console.log(`cheepenarylistening on ${PORT}`)
  })

module.exports = {app,
          logger}

