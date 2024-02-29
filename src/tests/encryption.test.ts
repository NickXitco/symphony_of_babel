import { beforeEach, describe, expect, it } from 'vitest'

import { WaveFile } from 'wavefile'
import { generateRandomWAVData, generateWavHeader } from '../utils/wavUtils'
import {
	decryptBuffer,
	encryptBuffer,
	getCryptoKey,
	getUUIDFromWAVData,
	getWAVDataFromUUID,
} from '../utils/encryptionUtils'
import { incrementBuffer, uint8arrayToBase64 } from '../utils/bufferUtils'

describe('Encryption', () => {
	let buffer: Uint8Array
	let uuidKey: Uint8Array

	beforeEach(async () => {
		buffer = generateRandomWAVData()
		uuidKey = getCryptoKey('')
	})

	it('should encrypt to different data', async () => {
		const ciphertextBuffer = encryptBuffer(buffer, uuidKey)
		const ciphertext = uint8arrayToBase64(ciphertextBuffer)
		const bufferBase64 = uint8arrayToBase64(buffer)

		expect(ciphertext).not.toEqual(bufferBase64)
	})

	it('should decrypt to the original data', async () => {
		const ciphertextBuffer = encryptBuffer(buffer, uuidKey)
		const plaintextBuffer = decryptBuffer(ciphertextBuffer, uuidKey)

		expect(buffer).toEqual(plaintextBuffer)
	})

	it('should encrypt to substantially different data from two similar plain texts', async () => {
		const ciphertextA = encryptBuffer(buffer, uuidKey)
		const ciphertextB = encryptBuffer(incrementBuffer(buffer), uuidKey)

		expect(ciphertextA[0]).not.toEqual(ciphertextB[0])
	})

	it('should create a valid WAV file when incrementing ciphertext', async () => {
		const randomWAVData = generateRandomWAVData()
		const UUID = getUUIDFromWAVData(randomWAVData, uuidKey)
		const UUIDIncremented = incrementBuffer(UUID)

		const newWavData = getWAVDataFromUUID(UUIDIncremented, uuidKey)

		const header = generateWavHeader()
		const newWavDataWithHeader = new Uint8Array(newWavData.length + header.length)
		newWavDataWithHeader.set(header)
		newWavDataWithHeader.set(newWavData, header.length)

		const waveFile = new WaveFile(newWavDataWithHeader)

		expect(waveFile.format).toEqual('WAVE')
	})
})
