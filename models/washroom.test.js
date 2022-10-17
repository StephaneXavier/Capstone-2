const db = require('../db');
const ExpressError = require('../helpers/expressErrors')
const Washroom = require('./washroom');
const {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    commonBeforeEach,
    testWashroomIds
} = require('./_testCommon');


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('getAll', () => {
    test('it works', async () => {
        const washrooms = await Washroom.getAll();
        const expectedObj = {
            id: testWashroomIds[0],
            washroom_type: 'porta-potty',
            user_id: 'u1',
            x_coordinate: "45.01",
            y_coordinate: "55.12",
            opens_at: '1200',
            closes_at: '1500'
        }

        expect(washrooms.length != 0);
        expect(washrooms[0]).toEqual(expectedObj)

    })
})

describe('getSpecificWashroom', () => {
    test('gets washroom when it exists', async () => {

        const washroomInfo = await Washroom.getSpecificWashroom(testWashroomIds[0])
        expect(washroomInfo.washroom_type).toBe('porta-potty')
        expect(washroomInfo.user_id).toBe('u1')
        expect(washroomInfo.x_coordinate).toBe('45.01')
        expect(washroomInfo.y_coordinate).toBe('55.12')
        expect(washroomInfo.opens_at).toBe('1200')
        expect(washroomInfo.closes_at).toBe('1500')
    })
})


describe('submitNewWashroom', () => {
    test('submits new bathroom', async () => {
        const washroomInfo = {
            washroomType: 'test-type',
            xCoordinate: 44,
            yCoordinate: 55,
            opensAt: '1200',
            closesAt: '1500'
        }
        const submittedWashroomId = await Washroom.submitNewWahsroom({ washroomInfo, username: 'u3' })
        const newWashroomInfo = await Washroom.getSpecificWashroom(submittedWashroomId)

        expect(submittedWashroomId).toEqual(expect.any(Number))
        expect(newWashroomInfo).toEqual({
            user_id: 'u3',
            washroom_type: 'test-type',
            x_coordinate: '44',
            y_coordinate: '55',
            opens_at: '1200',
            closes_at: '1500',
            total_votes: '1'
        })
    })
})

describe('getSpecificWashroom', () => {
    test('fetches washroom based off of id', async () => {
        const washroom = await Washroom.getSpecificWashroom(testWashroomIds[0])
        expect(washroom).toEqual({
            user_id: 'u1',
            washroom_type: 'porta-potty',
            x_coordinate: '45.01',
            y_coordinate: '55.12',
            opens_at: '1200',
            closes_at: '1500',
            total_votes: '2'
        })
    })
    test('throw error if washroom does not exist', async () => {
        try {
            const washroom = await Washroom.getSpecificWashroom(0)
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toBe('No washroom matching id')
        }
    })
})

describe('getFilteredWashroom', () => {
    test('it throw error if partial coordinates are entered', async () => {
        try {
            const searchParams = { type: 'porta-potty', minX: '45.05', maxX: '50', maxY: '56' };
            const washrooms = await Washroom.getFilteredWashrooms(searchParams)
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toBe('Either put min / max for x and y axis, or omit coordinates')
        }
    })

    test('it works with only coordinates put in', async () => {
        const searchParams = { minX: 45.05, maxX: 50, maxY: 56, minY: -56 }
        const washrooms = await Washroom.getFilteredWashrooms(searchParams)

        expect(washrooms.length).toBe(2)
    })

    test('it works with no coordinates', async () => {
        const searchParams = { washroomType: 'porta-potty' }
        const washrooms = await Washroom.getFilteredWashrooms(searchParams)

        expect(washrooms.length).toBe(2)
        expect(washrooms[0].washroom_type).toBe('porta-potty')
        expect(washrooms[1].washroom_type).toBe('porta-potty')
    })

    test('throws error when no searchParams provided', async () => {
        try {
            const searchParams = {}
            const washrooms = await Washroom.getFilteredWashrooms(searchParams)
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toBe('must provide search params')
        }
    })
})

describe('deleteWashroom', () => {
    test('it should delete existing washroom', async () => {
        await Washroom.deleteWashroom(testWashroomIds[0])
        
        try{
            await Washroom.getSpecificWashroom(testWashroomIds[0])
        }catch(e){
            expect(e).toBeInstanceOf(ExpressError)
        }
    })
    test('it should throw an error if washroom does not exist', async () => {
        try{
            await Washroom.deleteWashroom(0)
        }catch(e){
            expect(e).toBeInstanceOf(ExpressError)
        }
    })
})

describe('modifyWashroom', () => {
    test('should modify washroom', async () => {
        const washroomInfo = {opensAt:'0000', closesAt:'0000', washroomType:'test-type'}
        await Washroom.modifyWashroom({washroomInfo, washroomId:testWashroomIds[0]})

        const modifiedWashroom = await Washroom.getSpecificWashroom(testWashroomIds[0])

        expect(modifiedWashroom.washroom_type).toBe('test-type')
        expect(modifiedWashroom.closes_at).toBe('0000')
        expect(modifiedWashroom.opens_at).toBe('0000')
    })
    test('should throw error if washroom you are trying to modify does not exist', async ()=> {
        try{
            const washroomInfo = {opensAt:'0000', closesAt:'0000', washroomType:'test-type'}
            await Washroom.modifyWashroom({washroomInfo, washroomId:0})
        }catch(e){
            expect(e).toBeInstanceOf(ExpressError)
        }
    })
})