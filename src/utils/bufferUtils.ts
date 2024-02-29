import * as buffer from 'node:buffer'
import { i } from 'vitest/dist/reporters-1evA5lom'

export const uint8arrayToBase64 = (bytes: Uint8Array) => {
	let binary = ''
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return btoa(binary)
}

export const base64ToUint8array = (b64: string) => {
	return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

export const incrementBase64 = (b64: string) => {
	return uint8arrayToBase64(incrementBuffer(base64ToUint8array(b64)))
}

export const decrementBase64 = (b64: string) => {
	return uint8arrayToBase64(decrementBuffer(base64ToUint8array(b64)))
}

/**
 * Increments a buffer from the front to amplify avalanche effects
 * @param buffer
 */
export const incrementBuffer = (buffer: Uint8Array) => {
	const binaryData = new Uint8Array(buffer)
	const len = binaryData.length

	for (let i = 0; i < len; i++) {
		if (binaryData[i] < 255) {
			binaryData[i]++
			break
		} else {
			binaryData[i] = 0
		}
	}

	return binaryData
}

export const decrementBuffer = (buffer: Uint8Array) => {
	const binaryData = new Uint8Array(buffer)
	const len = binaryData.length

	for (let i = 0; i < len; i++) {
		if (binaryData[i] > 0) {
			binaryData[i]--
			break
		} else {
			binaryData[i] = 255
		}
	}

	return binaryData
}

export const getBase64Preview = (b64: string) => {
	const first20characters = b64.slice(0, 20)
	const last20characters = b64.slice(-20)
	return `${first20characters}...${last20characters}`
}

/**
 * Calculates the entropy of a given Uint8Array data. With our 8bit data, this entropy will usually be 7.99-8, or log2(256)
 *
 * @param {Uint8Array} data - The data to calculate the entropy for.
 * @returns {number} The entropy value.
 */
export const getEntropy = (data: Uint8Array): number => {
	const dataSize = data.length
	if (dataSize === 0) {
		return 0
	}

	const frequencyMap = new Map<number, number>()

	// Count the frequency of each byte
	data.forEach((byte) => {
		const count = frequencyMap.get(byte) || 0
		frequencyMap.set(byte, count + 1)
	})

	let entropy = 0
	frequencyMap.forEach((count) => {
		const probability = count / dataSize
		entropy -= probability * Math.log2(probability)
	})

	return entropy
}

export const maxBuffer = (data: Uint8Array) => {
	let max = 0
	for (let i = 0; i < data.length; i++) {
		max = Math.max(max, data[i])
	}

	return max
}

export const minBuffer = (data: Uint8Array) => {
	let min = 255
	for (let i = 0; i < data.length; i++) {
		min = Math.min(min, data[i])
	}

	return min
}
