import { configureStore } from '@reduxjs/toolkit'
import audioReducer from './audio/audioSlice'

export const store = configureStore({
	reducer: {
		audioReducer: audioReducer,
	},
})
