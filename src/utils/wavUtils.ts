import { WaveFile } from 'wavefile'
import { uint8arrayToBase64 } from './bufferUtils'
import { map } from './mathUtils'

export const SAMPLE_RATE = 32000
export const BIT_DEPTH = '8'
export const NUM_CHANNELS = 1
export const DURATION_SECONDS = 10

export const createRandomWAV = (
	sampleRate = SAMPLE_RATE,
	bitDepth = BIT_DEPTH,
	numChannels = NUM_CHANNELS,
	durationSeconds = DURATION_SECONDS
) => {
	return createWAVFromSamples(generateRandomWAVData(sampleRate, durationSeconds), sampleRate, bitDepth, numChannels)
}

export const createWAVFromSamples = (
	samples: Uint8Array,
	sampleRate = SAMPLE_RATE,
	bitDepth = BIT_DEPTH,
	numChannels = NUM_CHANNELS
) => {
	const wav = new WaveFile()
	wav.fromScratch(numChannels, sampleRate, bitDepth, samples)

	return wav.toBuffer()
}

export const getRandomWAVB64 = () => {
	const wavBuffer = createRandomWAV()
	return uint8arrayToBase64(wavBuffer)
}

export const generateWavHeader = (
	sampleRate = SAMPLE_RATE,
	bitDepth = BIT_DEPTH,
	numChannels = NUM_CHANNELS,
	durationSeconds = DURATION_SECONDS
) => {
	const numSamples = sampleRate * durationSeconds
	const samples = new Uint8Array(numSamples)
	const wav = createWAVFromSamples(samples, sampleRate, bitDepth, numChannels)
	return getWavHeader(wav)
}

export const generateRandomWAVData = (sampleRate = SAMPLE_RATE, durationSeconds = DURATION_SECONDS) => {
	const numSamples = sampleRate * durationSeconds
	const samples = new Uint8Array(numSamples)

	for (let i = 0; i < numSamples; i++) {
		samples[i] = Math.floor(Math.random() * 256)
	}

	return samples
}

// This makes an assumption that a WAV's header is always 44 bytes.
const WAV_HEADER_SIZE = 0x0000002c

export const getWavData = (wavBuffer: Uint8Array) => {
	return wavBuffer.slice(WAV_HEADER_SIZE)
}

export const getWavHeader = (wavBuffer: Uint8Array) => {
	return wavBuffer.slice(0, WAV_HEADER_SIZE)
}

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (): void => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(reader.result)
			} else {
				reject(new Error('Read result is not an ArrayBuffer'))
			}
		}

		reader.onerror = (error): void => {
			reject(error)
		}

		reader.readAsArrayBuffer(file)
	})
}

export const audioBufferToMono = (audioContext: AudioContext, audioBuffer: AudioBuffer) => {
	const channels = []

	for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
		channels.push(audioBuffer.getChannelData(i))
	}

	const monoAudioBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate)
	const monoChannel = monoAudioBuffer.getChannelData(0)

	for (let i = 0; i < audioBuffer.length; i++) {
		let sum = 0
		for (let j = 0; j < audioBuffer.numberOfChannels; j++) {
			sum += channels[j][i]
		}
		monoChannel[i] = sum / audioBuffer.numberOfChannels
	}

	return monoAudioBuffer
}

export const create10SecondClip = (audioContext: AudioContext, audioBuffer: AudioBuffer) => {
	const sampleRate = audioContext.sampleRate
	const clipLength = sampleRate * 10 // 10 seconds * sample rate

	// Create a new AudioBuffer for the 10-second clip, initialized with silence
	const clipBuffer = audioContext.createBuffer(1, clipLength, sampleRate)

	// Get the channel data for the original and new clip buffer
	const originalChannelData = audioBuffer.getChannelData(0)
	const clipChannelData = clipBuffer.getChannelData(0)

	// Copy the original audio data into the clip buffer, filling with silence if necessary
	for (let i = 0; i < clipLength; i++) {
		clipChannelData[i] = originalChannelData[i]
	}

	return clipBuffer
}

// TODO might be worth refactoring this so that it does the mono and clipping in here, but cest la vie
export const convertAudioBufferToWavefile = (audioBuffer: AudioBuffer) => {
	const wav = new WaveFile()
	wav.fromScratch(audioBuffer.numberOfChannels, audioBuffer.sampleRate, '32f', audioBuffer.getChannelData(0))

	wav.toSampleRate(SAMPLE_RATE)
	wav.toBitDepth(BIT_DEPTH)

	return wav.toBuffer()
}

export const calculateRMS = (buffer: Uint8Array) => {
	const squaredSum = buffer.reduce((sum, sample) => sum + sample * sample, 0)
	const meanSquare = squaredSum / buffer.length
	return Math.sqrt(meanSquare)
}

const PEAK_RMS = 148
const MIN_RMS = 100
export const scaleVolumeToRMS = (volume: number, rms: number) => {
	return volume / map(rms, MIN_RMS, PEAK_RMS, 0, 1)
}
