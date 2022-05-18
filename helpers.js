const fetch = require('node-fetch');
const timeoutSignal = require("timeout-signal");
const {map, curry, split, replace, pipe, isNil, find, toPairs, reject, anyPass,
    isEmpty, equals, join, last, head} = require('rambda')


const parseUrl= curry((mapz, url) =>
    pipe(
        toPairs,
        map(trySplit(url)),
        find(_in=>!isNil(_in))
        )(mapz)
)

const trySplit = curry((url,[k, v]) => {
    const candidate = split(k, url)
    if (candidate.length === 2)
        return [[k, v], candidate]
})

const extractTransforms = pipe(
    replace(/\//g, ''),
    split(',')
)

const removeDblSlash = replace(/\/\//g, "/")

const makeBucketName = (_in) =>{
    const nameParts =  split('.', last(last(_in)))
    const rootDir = head(head(_in))
    const transforms = join('+', extractTransforms(head(last(_in))))
    if(nameParts.length===1)
    return `${rootDir}${head(nameParts)}.${transforms}.jpg`
    return `${rootDir}${head(nameParts)}.${transforms}.${removeDblSlash(last(nameParts))}`
}

const fetchStream = async url => {
    const response = await fetch(url,  { signal: timeoutSignal(5000) });
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    return await response.body
}



const breakOnTruthy =  (f, errorMessage) => {
    return _in => {
      if (f(_in)) throw new Error(errorMessage)
      return _in
    }
  }

const cleanObject = reject(anyPass([isEmpty, isNil,  equals(NaN)]));


module.exports = {
    fetchStream,
    parseUrl,
    trySplit,
    extractTransforms,
    breakOnTruthy,
    cleanObject,
    makeBucketName,
    removeDblSlash
}
