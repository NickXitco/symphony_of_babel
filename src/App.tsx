import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Howl } from 'howler'
import {
	base64ToUint8array,
	decrementBase64,
	getEntropy,
	incrementBase64,
	maxBuffer,
	minBuffer,
	uint8arrayToBase64,
} from './utils/bufferUtils'
import {
	audioBufferToMono,
	calculateRMS,
	convertAudioBufferToWavefile,
	create10SecondClip,
	createWAVFromSamples,
	generateRandomWAVData,
	getRandomWAVB64,
	getWavData,
	readFileAsArrayBuffer,
	scaleVolumeToRMS,
} from './utils/wavUtils'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectURL,
	selectUUID,
	selectVolume,
	selectWavData,
	setUUID,
	setVolume,
	setWavData,
} from './reducers/audio/audioSlice'
import { AppDispatch, RootState } from './reducers'
import styles from './App.module.scss'
import { i } from 'vitest/dist/reporters-1evA5lom'
import { calculateSpectrogram } from './utils/fftUtils'
import { drawVisualization } from './utils/visualizationUtils'
import { getName } from './utils/nameUtils'
import { getRandomColorPalette } from './utils/colorUtils'

const App = () => {
	const dispatch = useDispatch<AppDispatch>()
	const wavB64 = useSelector(selectWavData)
	const uuid = useSelector(selectUUID)
	const url = useSelector(selectURL)
	const volume = useSelector(selectVolume)

	const [playing, setPlaying] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const canvasContainerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const processAudio = async (): Promise<void> => {
		const file = fileInputRef.current?.files?.[0]
		if (!file) return

		try {
			const audioContext = new AudioContext()
			const arrayBuffer: ArrayBuffer = await readFileAsArrayBuffer(file)
			const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer)

			const clippedAudioBuffer = create10SecondClip(audioContext, audioBuffer)
			const monoAudioBuffer = audioBufferToMono(audioContext, clippedAudioBuffer)
			const wavefile = convertAudioBufferToWavefile(monoAudioBuffer)

			const payload = uint8arrayToBase64(getWavData(wavefile))

			dispatch(setWavData(payload))
		} catch (error) {
			console.error('Error processing audio:', error)
		}
	}

	const sound = useMemo(() => {
		const wavFile = createWAVFromSamples(base64ToUint8array(wavB64))

		const sound = new Howl({
			src: ['data:audio/wav;base64,' + uint8arrayToBase64(wavFile)],
			format: ['wav'],
			volume: scaleVolumeToRMS(volume, calculateRMS(base64ToUint8array(wavB64))),
		})

		sound.on('end', () => {
			setPlaying(false)
		})
		return sound
	}, [wavB64])

	const handleResize = () => {
		drawVisualization('spectrogram', base64ToUint8array(wavB64), canvasRef.current, canvasContainerRef.current)
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		sound.volume(scaleVolumeToRMS(volume, calculateRMS(base64ToUint8array(wavB64))))
	}, [volume])

	useEffect(() => {
		if (!canvasRef.current) return

		drawVisualization('spectrogram', base64ToUint8array(wavB64), canvasRef.current, canvasContainerRef.current)
	}, [wavB64])

	const colorPalette = getRandomColorPalette(url)

	return (
		<div
			className={styles.container}
			style={
				{
					'--color1': colorPalette.color1,
					'--color2': colorPalette.color2,
					'--color3': colorPalette.color3,
					'--color4': colorPalette.color4,
				} as any
			}
		>
			<div className={styles.top_container}>
				<header className={styles.header}>
					<h2>{getName(url)}</h2>
					<p>{uuid.slice(0, 20)}...</p>
					<p>Entropy: {getEntropy(base64ToUint8array(wavB64)).toFixed(4)} (~8 is Random)</p>
				</header>
				<input
					type={'range'}
					min={0}
					max={0.25}
					step={0.01}
					value={volume}
					onChange={(e) => {
						dispatch(setVolume(parseFloat(e.target.value)))
					}}
				/>
			</div>

			<div className={styles.visualization} ref={canvasContainerRef}>
				<canvas ref={canvasRef} />
			</div>

			<div className={styles.controls}>
				<div className={styles.top_shelf}>
					<button
						onClick={() => {
							dispatch(setUUID(decrementBase64(uuid)))
						}}
					>
						{'<'}
					</button>
					<button
						onClick={() => {
							if (playing) {
								sound.stop()
								setPlaying(false)
							} else {
								sound.play()
								setPlaying(true)
							}
						}}
					>
						{playing ? '▨' : '▷'}
					</button>
					<button
						onClick={() => {
							dispatch(setUUID(incrementBase64(uuid)))
						}}
					>
						{'>'}
					</button>
				</div>
				<div className={styles.bottom_shelf}>
					<input
						type="file"
						ref={fileInputRef}
						accept="audio/*"
						onChange={processAudio}
						className={'vh'}
						id={'fileInput'}
					/>
					<label htmlFor={'fileInput'}>find recording</label>

					<button
						onClick={async () => {
							dispatch(setWavData(uint8arrayToBase64(generateRandomWAVData())))
						}}
					>
						random recording
					</button>

					<button
						onClick={async () => {
							const wavDataBuffer = base64ToUint8array(wavB64)
							const wavFile = createWAVFromSamples(wavDataBuffer)

							const wavBlob = new Blob([wavFile], { type: 'audio/wav' })
							const wavURL = window.URL.createObjectURL(wavBlob)
							const link = document.createElement('a')
							link.href = wavURL
							link.download = 'recording.wav'
							link.click()
						}}
					>
						download recording
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
