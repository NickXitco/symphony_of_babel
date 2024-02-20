import { expect, test, describe, it, beforeEach } from 'vitest'
import { createRandomWAV, getWavHeader } from '@/utils/wavUtils'
import { decryptBuffer, encryptBuffer, getCryptoKey } from '@/utils/encryptionUtils'
import { base64ToUint8array, getEntropy, incrementBase64, uint8arrayToBase64 } from '@/utils/bufferUtils'
import { WaveFile } from 'wavefile'

describe('Encryption', () => {
	let buffer: Uint8Array
	let uuidKey: CryptoKey

	beforeEach(async () => {
		buffer = createRandomWAV()
		uuidKey = await getCryptoKey()
	})

	it('should encrypt to different data', async () => {
		const ciphertextBuffer = await encryptBuffer(buffer, uuidKey)
		const ciphertext = uint8arrayToBase64(ciphertextBuffer)
		const bufferBase64 = uint8arrayToBase64(buffer)

		expect(ciphertext).not.toEqual(bufferBase64)
	})

	it('should decrypt to the original data', async () => {
		const ciphertextBuffer = await encryptBuffer(buffer, uuidKey)
		const plaintextBuffer = await decryptBuffer(ciphertextBuffer, uuidKey)

		expect(buffer).toEqual(plaintextBuffer)
	})

	it('should create a valid WAV file when incrementing ciphertext', async () => {
		buffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
		const ciphertextBuffer = await encryptBuffer(buffer, uuidKey)
		const ciphertextBase64 = uint8arrayToBase64(ciphertextBuffer)
		const incremented = incrementBase64(ciphertextBase64)
		const incrementedBuffer = base64ToUint8array(incremented)

		const plaintextBuffer = await decryptBuffer(incrementedBuffer, uuidKey)

		const newWav = createRandomWAV()
		const header = getWavHeader(newWav)

		// append wav header onto plaintextBuffer
		const plaintextBufferWithHeader = new Uint8Array(plaintextBuffer.length + header.length)
		plaintextBufferWithHeader.set(header)
		plaintextBufferWithHeader.set(plaintextBuffer, header.length)

		const waveFile = new WaveFile(plaintextBufferWithHeader)

		expect(waveFile.format).toEqual('WAVE')
	})
})
