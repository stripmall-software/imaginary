const request = require('supertest')
const {app} = require('../index')
const {identity} = require('rambda')
const {bucket} = require('../streamer').init(process.env.IMAGE_BUCKET)


describe ('the actual app', ()=>{

    const filez = 'stripmall/img/home/spencer-imbrock-487035-unsplash.w_200+q_80.jpg'
    const pngFile = 'test/baboon.w_512.png'
    //beforeAll(() => bucket.file(filez).delete().catch(identity))
    beforeAll(() => bucket.file(pngFile).delete().catch(identity))
    //afterAll(() => bucket.file(filez).delete()) //Poor mans assertion that it actually happened
    afterAll(() => bucket.file(pngFile).delete()) //Poor mans assertion that it actually happened


    it('has a health check', ()=>request(app)
    .get('/test')
    .expect(200)
    .expect(res => expect(res.text).toEqual('ok')))

    it('returns a 400 for an empty argument', ()=>request(app)
    .get('/')
    .expect(400))

    it('returns a 404 for non-existent asset', ()=>request(app)
    .get('/w_200,q_60/stripmall/img/home/spencer-imbrock-487035-unsplashXXX.jpg')
    .expect(404)
    .expect('imaginary-status', 'FAIL')
    )

    it('returns a 400 for a domain that is not set up', ()=>request(app)
    .get('/w_200,q_60/foo/img/home/spencer-imbrock-487035-unsplashXXX.jpg')
    .expect(400)
    )

    it('fetches a cached item', ()=>request(app)
    .get('/w_200,q_60/stripmall/img/home/spencer-imbrock-487035-unsplash.jpg')
    .expect(200)
    .expect('imaginary-status', 'HIT')
    .expect('content-type', 'image/jpeg')
    )

    it('caches an item', ()=>request(app)
    .get('/w_200,q_80/stripmall/img/home/spencer-imbrock-487035-unsplash.jpg')
    .expect(200)
    .expect('imaginary-status', 'HIT')
    .expect('content-type', 'image/jpeg')
    )

    it('handles a png', async ()=>request(app)
    .get('/w_512/test/baboon.png')
    .expect(200)
    .expect('imaginary-status', 'MISSED')
    .expect('content-type', 'image/png')
    )

    it('makes me a jpeg when nothing is specified', ()=>request(app)
    .get('/w_240/listhub//WKYRMLS/110922/1')
    .expect(200)
    .expect('content-type', 'image/jpeg')
    )


} )



