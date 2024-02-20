import { expect, test, describe, it, beforeEach } from 'vitest'
import { WaveFile } from 'wavefile'
import { createRandomWAV } from '@/utils/wavUtils'

describe('Audio Creation', () => {
	let buffer: Uint8Array

	beforeEach(() => {
		buffer = createRandomWAV()
	})

	it('should create a buffer', () => {
		expect(buffer).toBeDefined()
	})

	it('should create a buffer with a length', () => {
		expect(buffer.length).toBeGreaterThan(0)
	})

	it('should create a buffer with a proper wav header', () => {
		const comparison = createRandomWAV()

		const baseHeader = buffer.slice(0, 0x0000002c)
		const comparisonHeader = comparison.slice(0, 0x0000002c)

		expect(baseHeader).toEqual(comparisonHeader)
	})

	it('should not create two buffers with similar data', () => {
		const comparison = createRandomWAV()

		// The chance of this test failing is 1 / (256 ^ 3)

		const baseSlice = buffer.slice(0, 0x0000002f)
		const comparisonSlice = comparison.slice(0, 0x0c00002f)

		expect(baseSlice).not.toEqual(comparisonSlice)
	})

	it('should create a valid wav file', () => {
		const wav = new WaveFile(buffer)
		expect(wav.toBuffer()).toEqual(buffer)
		expect(wav.format).toEqual('WAVE')
	})

	it('should be an invalid wav file if the data is malformed', () => {
		buffer[0] = 0x00
		expect(() => new WaveFile(buffer)).toThrowError('format')
	})
})
