const {Storage} = require('@google-cloud/storage');
const {curry} = require('rambda')
const storage = (_=> ( 'production' != process.env.NODE_ENV)? new Storage({keyFilename: process.env.GCP_CREDENTIALS}): new Storage())()

exports.init = ( bucketName) => {

    const bucket = storage.bucket(bucketName)

    const getStream = async (path, res)=>
        new Promise((resolve, reject) => 
        bucket.file(path).createReadStream()
        .on('error', reject)
        .on('end', resolve)
        .pipe(res))
    
    const put = curry(async (destination, stream) =>{
        const wStream = bucket.file(destination).createWriteStream()
        return new Promise((resolve, reject) => {
        stream
        .pipe(wStream)
        .on('error', reject)
        .on('finish', resolve) 
        })    
    })

    return {getStream, put, bucket}
}