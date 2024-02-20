import { expect, test, describe, it, beforeEach } from 'vitest'
import { getURL } from '@/utils/idUtils'
import { createRandomWAV } from '@/utils/wavUtils'
import { encryptBuffer, getCryptoKey } from '@/utils/encryptionUtils'
import { uint8arrayToBase64 } from '@/utils/bufferUtils'

describe('ID Generation', () => {
	let buffer: Uint8Array
	let uuidKey: CryptoKey
	let encryptedBuffer: Uint8Array

	beforeEach(async () => {
		buffer = createRandomWAV()
		uuidKey = await getCryptoKey()
		encryptedBuffer = await encryptBuffer(buffer, uuidKey)
	})

	it('should generate the same ID for the same data', async () => {
		const url1 = await getURL(encryptedBuffer)
		const url2 = await getURL(encryptedBuffer)

		expect(url1).toEqual(url2)
	})

	it('should generate a unique ID for different data', async () => {
		const url1 = await getURL(encryptedBuffer)
		const url2 = await getURL(createRandomWAV())

		expect(url1).not.toEqual(url2)
	})
})
