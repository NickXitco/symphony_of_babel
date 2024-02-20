import { Action, createSlice, Dispatch } from '@reduxjs/toolkit'
import { decryptBuffer, encryptBuffer, getCryptoKey } from '@/utils/encryptionUtils'
import { base64ToUint8array, uint8arrayToBase64 } from '@/utils/bufferUtils'
import { getURL } from '@/utils/idUtils'
import { createWAVFromSamples } from '@/utils/wavUtils'

export const setWavData = (payload: string) => async (dispatch: Dispatch<Action>) => {
	dispatch({ type: 'audio/setWavDataStart' })

	try {
		const cryptoKey = await getCryptoKey()
		const encrypted = await encryptBuffer(base64ToUint8array(payload), cryptoKey)
		const uuid = uint8arrayToBase64(encrypted)
		const url = await getURL(encrypted)

		dispatch({
			type: 'audio/setWavDataSuccess',
			payload: {
				wavB64: payload,
				uuid,
				url,
			},
		})
	} catch (e) {
		dispatch({ type: 'audio/setWavDataFailure', payload: e })
	}
}

export const setUUID = (payload: string) => async (dispatch: Dispatch<Action>) => {
	dispatch({ type: 'audio/setUUIDStart' })

	try {
		const cryptoKey = await getCryptoKey()
		const decrypted = await decryptBuffer(base64ToUint8array(payload), cryptoKey)

		const wav = createWAVFromSamples(decrypted)
		const wavB64 = uint8arrayToBase64(wav)
		const url = await getURL(base64ToUint8array(payload))

		dispatch({
			type: 'audio/setUUIDSuccess',
			payload: {
				wavB64,
				uuid: payload,
				url,
			},
		})
	} catch (e) {
		dispatch({ type: 'audio/setUUIDFailure', payload: e })
	}
}

const audioSlice = createSlice({
	name: 'audio',
	initialState: {
		wavB64: '',
		uuid: '',
		url: '',
		volume: 0.1,
		processing: false,
		error: null,
	},
	reducers: {
		setWavDataStart: (state) => {
			state.processing = true
			state.error = null
		},
		setWavDataSuccess: (state, action) => {
			return {
				...state,
				...action.payload,
				processing: false,
			}
		},
		setWavDataFailure: (state, action) => {
			state.processing = false
			state.error = action.payload
		},

		setUUIDStart: (state) => {
			state.processing = true
			state.error = null
		},
		setUUIDSuccess: (state, action) => {
			return {
				...state,
				...action.payload,
				processing: false,
			}
		},
		setUUIDFailure: (state, action) => {
			state.processing = false
			state.error = action.payload
		},
	},
})

export default audioSlice.reducer
