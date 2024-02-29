import { calculateSpectrogram, FFT_SIZE } from './fftUtils'

export const drawVisualization = (
	type: 'waveform' | 'spectrogram',
	wavData: Uint8Array,
	canvas: HTMLCanvasElement | null,
	canvasContainer: HTMLDivElement | null
) => {
	if (!canvas || !canvasContainer) return

	canvas.width = canvasContainer.clientWidth
	canvas.height = canvasContainer.clientHeight

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const canvasWidth = canvas.width
	const canvasHeight = canvas.height

	ctx.clearRect(0, 0, canvasWidth, canvasHeight)

	switch (type) {
		case 'waveform':
			return drawWaveform(wavData, ctx, canvasWidth, canvasHeight)
		case 'spectrogram':
			return drawSpectrogram(wavData, ctx, canvasWidth, canvasHeight)
	}
}

export const drawWaveform = (
	wavData: Uint8Array,
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number
) => {
	ctx.beginPath()

	const numSamples = wavData.length

	const sampleWidth = canvasWidth / numSamples
	const sampleHeight = canvasHeight / 256

	for (let i = 0; i < numSamples; i++) {
		const sampleValue = wavData[i]
		const x = i * sampleWidth
		const y = canvasHeight - sampleValue * sampleHeight
		ctx.lineTo(x, y)
	}

	ctx.strokeStyle = 'white'
	ctx.stroke()
}

export const drawSpectrogram = (
	wavData: Uint8Array,
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number
) => {
	const spectra = calculateSpectrogram(wavData)

	const numSegments = spectra.length
	const segmentWidth = canvasWidth / numSegments

	spectra.forEach((spectrum, segmentIndex) => {
		for (let i = 0; i < spectrum.length; i++) {
			const magnitude = spectrum[i]
			const intensity = Math.log1p(magnitude) / Math.log1p(FFT_SIZE) // Scale intensity logarithmically
			ctx.fillStyle = `hsla(0, 100%, 100%, ${100 * intensity}%)`
			const y = (i / spectrum.length) * canvasHeight
			ctx.fillRect(segmentIndex * segmentWidth, canvasHeight - y, segmentWidth, -canvasHeight / spectrum.length)
		}
	})
}
