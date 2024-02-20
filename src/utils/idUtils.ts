import { encryptBuffer, getCryptoKey } from './encryptionUtils'
import { uint8arrayToBase64 } from './bufferUtils'

export const getURL = async (uuidBuffer: Uint8Array) => {
	const key = await getCryptoKey('TODO_SECRET_SERVER_KEY')
	const encryptedData = await encryptBuffer(uuidBuffer, key)
	return uint8arrayToBase64(new Uint8Array(encryptedData)).slice(0, 100)
}
