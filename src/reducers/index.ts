import { configureStore } from '@reduxjs/toolkit'
import audioReducer from './audio/audioSlice'

export const store = configureStore({
	reducer: {
		audioReducer: audioReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
