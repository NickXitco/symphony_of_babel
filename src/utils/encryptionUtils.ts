const ENCRYPTION_ALGORITHM = 'AES-CTR'

export const getCryptoKey = async (key = 'symphony_of_babel_uuid_key') => {
	if (!key) {
		// Generate random key
		return crypto.subtle.generateKey({ name: ENCRYPTION_ALGORITHM, length: 256 }, true, ['encrypt', 'decrypt'])
	}

	const keyData = asciiStringToArrayBufferAndPad(key)
	return crypto.subtle.importKey(
		'raw',
		keyData,
		{
			name: ENCRYPTION_ALGORITHM,
			length: 256,
		},
		true,
		['encrypt', 'decrypt']
	)
}

const ZERO_IV = new Uint8Array(16)

export const encryptBuffer = async (buffer: Uint8Array, key: CryptoKey) => {
	const encryptedData = await crypto.subtle.encrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			counter: ZERO_IV,
			length: 64,
		},
		key,
		buffer
	)

	return new Uint8Array(encryptedData)
}

export const decryptBuffer = async (encryptedData: Uint8Array, key: CryptoKey) => {
	const decryptedData = await crypto.subtle.decrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			counter: ZERO_IV,
			length: 64,
		},
		key,
		encryptedData
	)

	return new Uint8Array(decryptedData)
}

const asciiStringToArrayBufferAndPad = (str: string, numBytes = 32) => {
	const bytes = new Uint8Array(numBytes)
	for (let i = 0; i < str.length; i++) {
		bytes[i] = str.charCodeAt(i)
	}
	return bytes.buffer
}
