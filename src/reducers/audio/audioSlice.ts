import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generateRandomWAVData } from '../../utils/wavUtils'
import { getCryptoKey, getUUIDFromWAVData, getWAVDataFromUUID } from '../../utils/encryptionUtils'
import { base64ToUint8array, uint8arrayToBase64 } from '../../utils/bufferUtils'
import { getURLStub } from '../../utils/idUtils'
import { RootState } from '../index'

interface WavData {
	wavDataB64: string
	uuid: string
	url: string
}

interface VolumeData {
	volume: number
}

interface AudioState extends WavData {
	volume: number
	processing: boolean
	error: any
}

const wavData = generateRandomWAVData()
const uuidBuffer = getUUIDFromWAVData(wavData, getCryptoKey())
const urlStub = getURLStub(uuidBuffer)

const initialState: AudioState = {
	wavDataB64: uint8arrayToBase64(wavData),
	uuid: uint8arrayToBase64(uuidBuffer),
	url: urlStub,
	volume: 0.01,
	processing: false,
	error: null,
}

const audioSlice = createSlice({
	name: 'audio',
	initialState,
	reducers: {
		setWavData: (state, action: PayloadAction<WavData>) => {
			state.processing = false
			state.error = null
			state.wavDataB64 = action.payload.wavDataB64
			state.uuid = action.payload.uuid
			state.url = action.payload.url
		},
		setUUID: (state, action: PayloadAction<WavData>) => {
			state.processing = false
			state.error = null
			state.wavDataB64 = action.payload.wavDataB64
			state.uuid = action.payload.uuid
			state.url = action.payload.url
		},
		setVolume: (state, action: PayloadAction<VolumeData>) => {
			state.volume = action.payload.volume
		},
	},
})

export const setWavData = (wavB64: string): Action => {
	const uuid = getUUIDFromWAVData(base64ToUint8array(wavB64), getCryptoKey())
	const uuidB64 = uint8arrayToBase64(uuid)
	const url = getURLStub(uuid)
	return audioSlice.actions.setWavData({ wavDataB64: wavB64, uuid: uuidB64, url })
}

export const setUUID = (uuidB64: string): Action => {
	const uuidBuffer = base64ToUint8array(uuidB64)
	const wavData = getWAVDataFromUUID(uuidBuffer, getCryptoKey())
	const wavB64 = uint8arrayToBase64(wavData)
	const url = getURLStub(uuidBuffer)
	return audioSlice.actions.setUUID({ wavDataB64: wavB64, uuid: uuidB64, url })
}

export const setVolume = (volume: number) => {
	return audioSlice.actions.setVolume({ volume })
}

export const selectWavData = (state: RootState) => state.audioReducer.wavDataB64
export const selectUUID = (state: RootState) => state.audioReducer.uuid
export const selectURL = (state: RootState) => state.audioReducer.url
export const selectVolume = (state: RootState) => state.audioReducer.volume

export default audioSlice.reducer
