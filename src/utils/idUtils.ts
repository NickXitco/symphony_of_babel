import { getCryptoKey, getURLFromUUID } from './encryptionUtils'
import { uint8arrayToBase64 } from './bufferUtils'

export const getURLStub = (uuidBuffer: Uint8Array) => {
	const key = getCryptoKey('TODO_SECRET_SERVER_KEY')
	const urlFull = getURLFromUUID(uuidBuffer, key)
	return uint8arrayToBase64(urlFull).slice(0, 100)
}
