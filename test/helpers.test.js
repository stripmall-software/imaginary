const {fetchStream, trySplit, parseUrl, extractTransforms, makeBucketName} = require('../helpers')
const  mime = require('mime-types')



describe('fetchStream', () => {
    it ('fetches me a stream', async () => {
        const res = await fetchStream('https://stripmall.software/img/home/stripmall-logo_512px.png')
        expect(res).toHaveProperty('on')
    })
    it ('Rejects for none', async () =>
        expect(fetchStream('https://picXXXXXsum.photos'))
        .rejects.toThrow("The user aborted a request.")
    )

})


describe('url splitting functions', () => {
    it ('splits me something',  () => {
        expect(trySplit('/one/foo/two/three', ['foo', 'html1'])).toEqual([['foo','html1'], ["/one/", "/two/three"]])
    })
    it('returns undefined for no split', ()=>{
        expect(trySplit('/one/foo/two/three', ['poop', 'http2'])).toBeUndefined()
    })

    it('handles a whole map', ()=>{
        f = parseUrl({poop:"url1", foo:"url2"})
        expect(f('/one/foo/two/three')).toEqual([['foo','url2'], ["/one/", "/two/three"]])
    })

    it('handles a whole map for the bad 2', ()=>{
        f = parseUrl({poop:"url1", foo:"url2"})
        expect(f('/one/hmm/two/three')).toBeUndefined()
    })

    it('extracts the transform params', ()=>{
        expect(extractTransforms("/w_200,h_100/")).toEqual(["w_200", "h_100"])

    })



})

describe('bucket Name functions', () => {

    it('preserve me the extension', ()=>{
        const res  = parseUrl({foo:"url2"})('/one/foo/two/three.png')
        expect(res).toEqual([['foo','url2'], ["/one/", "/two/three.png"]])
        expect(makeBucketName(res)).toEqual('foo/two/three.one.png')
        expect(mime.lookup(makeBucketName(res))).toEqual('image/png')
    })

    it('makes me a webp without', ()=>{
        const res  = parseUrl({foo:"url2"})('/one/foo/two/three')
        expect(res).toEqual([['foo','url2'], ["/one/", "/two/three"]])
        expect(makeBucketName(res)).toEqual('foo/two/three.one.jpg')
        expect(mime.lookup(makeBucketName(res))).toEqual('image/jpeg')
    })
})
