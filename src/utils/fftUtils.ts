import { SAMPLE_RATE } from './wavUtils'
import { FFT } from 'dsp.js'

export const FFT_SIZE = 2 ** 9
const HOP_SIZE = FFT_SIZE / 2 // 50% overlap

export const calculateSpectrogram = (wavData: Uint8Array, sampleRate = SAMPLE_RATE) => {
	const float32 = convert8BitAudioToFloat32(wavData)
	const segments = segmentWavData(wavData, float32)
	return calculateFFTSpectra(segments, sampleRate)
}

const calculateFFTSpectra = (segments: Float32Array[], sampleRate: number) => {
	const spectra: Float64Array[] = []
	const fft = new FFT(FFT_SIZE, sampleRate)

	segments.forEach((segment) => {
		fft.forward(segment)

		const spectrum = new Float64Array(FFT_SIZE / 2)
		for (let i = 0; i < spectrum.length; i++) {
			spectrum[i] = Math.sqrt(fft.real[i] ** 2 + fft.imag[i] ** 2)
		}
		spectra.push(spectrum)
	})

	return spectra
}

/**
 * Converts 8-bit audio data to Float32 format.
 *
 * @param {Uint8Array} wavData - The 8-bit audio data to convert.
 * @returns {Float32Array} - The converted audio data in Float32 format.
 */
const convert8BitAudioToFloat32 = (wavData: Uint8Array): Float32Array => {
	const float32Array = new Float32Array(wavData.length)
	for (let i = 0; i < wavData.length; i++) {
		// Convert from [0, 255] to [-1.0, 1.0]
		float32Array[i] = (wavData[i] - 128) / 128
	}

	return float32Array
}

/**
 * Split the input wavData into segments of length fftSize using a hop size of hopSize.
 *
 * @param {Uint8Array} wavData - The input waveform data as an array of bytes.
 * @param {Float32Array} float32 - The input waveform data converted to floating-point numbers.
 * @returns {Float32Array[]} - An array of Float32Array segments of length fftSize.
 */
const segmentWavData = (wavData: Uint8Array, float32: Float32Array): Float32Array[] => {
	const segments: Float32Array[] = []

	for (let i = 0; i + FFT_SIZE <= wavData.length; i += HOP_SIZE) {
		segments.push(float32.subarray(i, i + FFT_SIZE))
	}

	return segments
}
