import Guild from '../../src/models/guild'

describe('Guild model', () => {
    it('Should throw validation errors', () => {
        const guild = new Guild()

        expect(guild.validate).toThrow()
    })
})
