const {fetchStream} = require('../helpers')
const {constructOptions,transform, getFileFormat} = require('../transformer')



describe('It pulls out the configs', () => {

    it ('constructs a hxw object', async ()=> {
        const res = constructOptions([ 'w_200', 'h_60' ])
        expect(res).toEqual( { width: 200, height: 60 })
    })
    it ('constructs a hxw from a non integer  value', async ()=> {
        const res = constructOptions([ 'w_foo', 'h_60' ])
        expect(res).toEqual( { height: 60 })
    })
    it ('constructs another broken variation', async ()=> {
        const res = constructOptions([ 'w_foo' ])
        expect(res).toEqual( {})
    })
    it ('handles one value', async ()=> {
        const res = constructOptions([ 'w_700' ])
        expect(res).toEqual({ width: 700 })
    })
    it ('handles the file 2', async ()=> {
        const res = getFileFormat([ 'w_700', 'f_webp' ])
        expect(res).toEqual('webp')
        expect(constructOptions([ 'w_700', 'f_webp'])).toEqual({ width: 700 })
    })

})

describe('it doing transformations', () => {
    it('do a basic height and with', async ()=> {
        const reader = await fetchStream('https://stripmall.software/img/home/stripmall-logo_512px.png')
        const res = reader.pipe(transform('stripmall-logo_512px.png', [ 'w_700' ]))
        expect(res).toBeDefined()
    })

    it('do a bad santa', async ()=> {
        const reader = await fetchStream('http://www.libraw.org/sites/libraw.org/files/P1010671.JPG')
        const res = reader.pipe(transform('P1010671.JPG', [ 'w_700' ]))
        expect(res).toBeDefined()
    })

})