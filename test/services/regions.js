const _ = require('lodash')
const regionsService = require('../../services/regions')
const { createRegion } = require('../testUtils/entityFactory')
const knex = require('../../db/knex')
const { DuplicateEntryError, NotFoundError } = require('../../services/errors')

describe('Region service', () => {

    describe('getRegionById', () => {
        it('should fetch a region with a real id', async () => {
            const testRegion = await createRegion()

            const queriedRegion = await regionsService.getRegionById(testRegion.id)
            expect(queriedRegion.id).toEqual(testRegion.id)
        })

        it('should throw a NotFoundError when region with given id is not found', async () => {
            expect.assertions(1)
            try {
                await regionsService.getRegionById('1289732132')
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError)
            }
        })
    })

    describe('getRegions', () => {

        it('should return a page when there is data', async () => {
            await createRegion()

            const queriedRegions = await regionsService.getRegions()

            expect(queriedRegions.data.length > 0).toEqual(true)
            expect(queriedRegions.pagination).toEqual({
                page: 1,
                page_size: 10,
                total_pages: 1,
            })
        })

        it('should return a limited page when there is over a page of data', async () => {
            await Promise.all(_.range(11).map(() => createRegion()))

            const queriedRegions = await regionsService.getRegions()

            expect(queriedRegions.data.length).toEqual(10)
            expect(queriedRegions.pagination).toEqual({
                page: 1,
                page_size: 10,
                total_pages: 2,
            })
        })

        it('should return the second page when the second page is requested', async () => {
            await Promise.all(_.range(11).map(() => createRegion()))

            const queriedRegionsPage1 = await regionsService.getRegions({ page: 1 })
            const queriedRegionsPage2 = await regionsService.getRegions({ page: 2 })

            expect(queriedRegionsPage1.data).not.toEqual(queriedRegionsPage2.data)
        })

        it('should return a smaller page when a smaller page size is passed', async () => {
            const queriedRegions = await regionsService.getRegions({ pageSize: 6 })
            
            expect(queriedRegions.data.length).toEqual(6)
        })

        it('should return the first page when page 0 is requested', async () => {
            const queriedRegions = await regionsService.getRegions({ page: 0 })

            expect(queriedRegions.data.length).toEqual(10)
            expect(queriedRegions.pagination.page).toEqual(1)
            expect(queriedRegions.pagination.page_size).toEqual(10)
        })
    })

    describe('createRegion', () => {
        it('should create a region', async () => {

            const testRegion = await regionsService.createRegion({
                description: 'sdf9u13owjieknsds'
            })

            const queriedRegion = await knex('regions')
            .where({ id: testRegion.id })
            .first()

            expect(queriedRegion.id).toEqual(testRegion.id)
        })

        it('should throw a DuplicateEntryError when a region of the same description is created', async () => {
            expect.assertions(1)

            const sameDescription = '12345-same'
            const testRegion = await createRegion({ description:  sameDescription })

            try {
                await regionsService.createRegion({
                    description: sameDescription
                })
            } catch (err) {
                expect(err).toBeInstanceOf(DuplicateEntryError)
            }
        })
    })

    describe('deleteRegionById', () => {

        it('should delete a region by id', async () => {
            const testRegion = await createRegion()

            await regionsService.deleteRegionById(testRegion.id)

            const queriedRegion = await knex('regions')
            .where({ id: testRegion.id })
            .whereNotNull('dtime')
            .first()

            expect(queriedRegion.id).toEqual(testRegion.id)
        })

        it('should not recreate dtime field when deleted twice', async () => {
            const testRegion = await createRegion()

            await regionsService.deleteRegionById(testRegion.id)

            const firstQueriedRegion = await knex('regions')
            .where({ id: testRegion.id })
            .whereNotNull('dtime')
            .first()

            await regionsService.deleteRegionById(testRegion.id)

            const secondQueriedRegion = await knex('regions')
            .where({ id: testRegion.id })
            .whereNotNull('dtime')
            .first()

            expect(firstQueriedRegion.dtime).toEqual(secondQueriedRegion.dtime)
        })
    })
})
