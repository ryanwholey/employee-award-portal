const _ = require('lodash')

const { DuplicateEntryError, NotFoundError } = require('../../services/errors')
const { createAwardType } = require('../testUtils/entityFactory')
const awardTypeService  = require('../../services/awardTypes')
const knex = require('../../db/knex')

describe('Award Type Service', () => {

    describe('getAwardTypeById', () => {

        it('should return an award type when found', async () => {
            const testAwardType = await createAwardType()

            const queriedAwardType = await awardTypeService.getAwardTypeById(testAwardType.id)

            expect(queriedAwardType.id).toEqual(testAwardType.id)
        })

        it('should throw a NotFoundError when an award type is not found', async () => {
            expect.assertions(1)
            try {
                await awardTypeService.getAwardTypeById('award type the first')
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError)
            }
        })
    })

    describe('getAwardTypes', () => {

        it('should get a full page of award types', async () => {
            await Promise.all(_.range(11).map(() => createAwardType()))

            const awardTypes = await awardTypeService.getAwardTypes()
            expect(awardTypes.data.length).toEqual(10)
            expect(awardTypes.pagination).toEqual({
                page: 1,
                page_size: 10,
                total_pages: 2,
            })
        })
    })

    describe('createAwardType', () => {

        it('should create an award type', async () => {
            const createdAwardType = await awardTypeService.createAwardType({ name: 'foo' })
            const queriedAwardType = await knex('award_types')
            .where({id: createdAwardType.id})
            .first()

            expect(queriedAwardType.id).toEqual(createdAwardType.id)
        })

        it('should throw a NotFoundError when an award type is not found', async () => {
            expect.assertions(1)
            try {
                const awardTypeName = 'The best award type ever'
                await awardTypeService.createAwardType({ name: awardTypeName })
                await awardTypeService.createAwardType({ name: awardTypeName })
            } catch (err) {
                expect(err).toBeInstanceOf(DuplicateEntryError)
            }
        })
    })

    describe('deleteAwardTypeById', () => {

        it('should delete an award', async () => {
            const testAwardType = await createAwardType()
            
            const awardTypeBeforeDelete = await knex('award_types')
            .where({ id: testAwardType.id })
            .first()

            expect(awardTypeBeforeDelete.dtime).toEqual(null)

            await awardTypeService.deleteAwardTypeById(testAwardType.id)

            const awardTypeAfterDelete = await knex('award_types')
            .where({ id: testAwardType.id })
            .first()

            expect(awardTypeAfterDelete.dtime).not.toEqual(null)
        })
    })

    describe('patchAwardTypeById', () => {

        it('should be able to patch an award type', async () => {
            const testAwardType = await createAwardType()

            await awardTypeService.patchAwardTypeById(testAwardType.id, { name: 'updated name 12345' })

            const updatedAwardType = await knex('award_types')
            .where({ id: testAwardType.id })
            .first()
            
            expect(updatedAwardType.name).toEqual('updated name 12345')
        })

        it('should throw a duplicate error if trying to patch an award to one that exists already', async () => {
            expect.assertions(1)
            const firstTestAwardType = await createAwardType()
            const secondTestAwardType = await createAwardType()

            try {
                await awardTypeService.patchAwardTypeById(secondTestAwardType.id, { name: firstTestAwardType.name })
            } catch (err) {
                expect(err).toBeInstanceOf(DuplicateEntryError)
            }
        })
    })
})
