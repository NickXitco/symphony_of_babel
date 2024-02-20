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
	let binaryData = base64ToUint8array(b64)

	for (let i = binaryData.length - 1; i >= 0; i--) {
		if (binaryData[i] < 255) {
			binaryData[i]++
			break
		} else {
			binaryData[i] = 0
		}
	}

	return uint8arrayToBase64(binaryData)
}

export const getBase64Preview = (b64: string) => {
	const first20characters = b64.slice(0, 20)
	const last20characters = b64.slice(-20)
	return `${first20characters}...${last20characters}`
}

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
