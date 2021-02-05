const MockRes = require('mock-res');
const {fetchStream} = require('../helpers')
const {identity} = require('rambda')
const {getStream, put, bucket} = require('../streamer').init(process.env.IMAGE_BUCKET)



describe('Streamer get tests from gcloud', () => {
    const filez = 'stripmall-logo_512px.png';
    beforeAll(() => bucket.file(filez).delete().catch(identity))
    afterAll(() => bucket.file(filez).delete()) //Poor mans assertion that it actually happened


    const res = new MockRes();
    it ('get fails for a no existent file', async ()=>expect(getStream('foo.jpg', res)).rejects.toThrow('No such object: images_test.agreatertown.com/foo.jpg'));
    it('puts a file in a bucket and retrieves it ', async ()=> {
        const reader = await fetchStream('https://stripmall.software/img/home/stripmall-logo_512px.png')
        await put(filez, reader)
        await getStream(filez, res).then(_ => expect(res.statusCode === 200))
    })

})