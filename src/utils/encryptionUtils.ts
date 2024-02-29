import forge from 'node-forge'

const ENCRYPTION_ALGORITHM = 'AES-CBC'

const stringToUint8Array = (s: string) => {
	const arr = []
	for (const char of s) {
		arr.push(char.charCodeAt(0))
	}
	return new Uint8Array(arr)
}

export const getCryptoKey = (key = 'symphony_of_babel_uuid_key'): Uint8Array => {
	if (!key) {
		// Generate random key
		const randomKey = forge.random.getBytesSync(32)
		return stringToUint8Array(randomKey)
	}

	const keyData = asciiStringToArrayBufferAndPad(key)
	return new Uint8Array(keyData)
}

const ZERO_IV = new Uint8Array(16)

export const encryptBuffer = (buffer: Uint8Array, key: Uint8Array) => {
	const keyBuffer = forge.util.createBuffer(key)
	const cipher = forge.cipher.createCipher('AES-CBC', keyBuffer)
	cipher.start({
		iv: forge.util.createBuffer(ZERO_IV),
	})
	cipher.update(forge.util.createBuffer(buffer))
	cipher.finish()

	return stringToUint8Array(forge.util.createBuffer(cipher.output).getBytes())
}

export const decryptBuffer = (encryptedData: Uint8Array, key: Uint8Array) => {
	const keyBuffer = forge.util.createBuffer(key)
	const decipher = forge.cipher.createDecipher('AES-CBC', keyBuffer)
	decipher.start({
		iv: forge.util.createBuffer(ZERO_IV),
	})
	decipher.update(forge.util.createBuffer(encryptedData))
	decipher.finish()

	return stringToUint8Array(forge.util.createBuffer(decipher.output).getBytes())
}

const asciiStringToArrayBufferAndPad = (str: string, numBytes = 32) => {
	const bytes = new Uint8Array(numBytes)
	for (let i = 0; i < str.length; i++) {
		bytes[i] = str.charCodeAt(i)
	}
	return bytes.buffer
}

export const getUUIDFromWAVData = (wavData: Uint8Array, key: Uint8Array) => {
	return decryptBuffer(wavData, key)
}

export const getWAVDataFromUUID = (uuid: Uint8Array, key: Uint8Array) => {
	return encryptBuffer(uuid, key)
}

export const getUUIDFromURL = (url: Uint8Array, key: Uint8Array) => {
	return decryptBuffer(url, key)
}

export const getURLFromUUID = (uuid: Uint8Array, key: Uint8Array) => {
	return encryptBuffer(uuid, key)
}
