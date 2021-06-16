import { parseMessage } from '../message'

describe('Message Utils', () => {
    describe('parseMessage', () => {
        it('parses command and arguments', () => {
            const message: any = {
                content: '!help I need somebody',
            }

            const { command, args } = parseMessage(message)

            expect(command).toStrictEqual('help')
            expect(args).toStrictEqual(['I', 'need', 'somebody'])
        })
    })
})
