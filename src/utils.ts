import { WaveFile } from 'wavefile'

const wavHeader = [82, 73, 70, 70, 36, 125, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 0, 125, 0, 0, 0, 125, 0, 0, 1, 0, 8, 0, 100, 97, 116, 97, 0, 125, 0, 0]
const sampleRate = 32000 // 32 kHz
const bitDepth = '8' // 8-bit audio
const numChannels = 1 // Mono
const durationSeconds = 10
export const getRandomWAVB64 = () => {
	const numSamples = sampleRate * durationSeconds


	let samples = new Uint8Array(numSamples)

	for (let i = 0; i < numSamples; i++) {
		// Generate a random 8-bit sample (between 0 and 255)
		samples[i] = Math.floor(Math.random() * 256)
	}

	let wav = new WaveFile()


	wav.fromScratch(numChannels, sampleRate, bitDepth, samples)


	const wavBuffer = wav.toBuffer()

	const header = wavBuffer.slice(0, 0x0000002C)
	const data = wavBuffer.slice(0x0000002C)

	return uint8arrayToBase64(wavBuffer)
}


export const encryptB64 = async (b64: string) => {
	const key = await crypto.subtle.generateKey(
		{
			name: 'AES-GCM',
			length: 256, // Key length in bits
		},
		true, // Key can be used for encrypting
		['encrypt'], // Key can only be used for encryption
	)

	const encryptedData = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: new Uint8Array(12), // Initialization vector (IV) - should be nonces in practice
		},
		key,
		Uint8Array.from(atob(b64), c => c.charCodeAt(0)),
	)

	return uint8arrayToBase64(new Uint8Array(encryptedData))
}

const uint8arrayToBase64 = (bytes: Uint8Array) => {
	let binary = ''
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return window.btoa(binary)
}