import { beforeEach, describe, expect, it } from 'vitest'
import { createRandomWAV, generateRandomWAVData } from '../utils/wavUtils'
import { getCryptoKey, getUUIDFromWAVData } from '../utils/encryptionUtils'
import { getURLStub } from '../utils/idUtils'

describe('ID Generation', () => {
	let randomWavData: Uint8Array
	let cryptoKey: Uint8Array
	let UUID: Uint8Array

	beforeEach(async () => {
		randomWavData = generateRandomWAVData()
		cryptoKey = getCryptoKey()
		UUID = getUUIDFromWAVData(randomWavData, cryptoKey)
	})

	it('should generate the same ID for the same data', async () => {
		const url1 = getURLStub(UUID)
		const url2 = getURLStub(UUID)

		expect(url1).toEqual(url2)
	})

	it('should generate a unique ID for different data', async () => {
		const url1 = getURLStub(UUID)
		const url2 = getURLStub(createRandomWAV())

		expect(url1).not.toEqual(url2)
	})
})
