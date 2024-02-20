import React, { useEffect } from 'react'
import { Howl } from 'howler'
import { base64ToUint8array, getBase64Preview, incrementBase64, uint8arrayToBase64 } from './utils/bufferUtils'
import { encryptBuffer, getCryptoKey } from './utils/encryptionUtils'
import { getURL } from './utils/idUtils'
import {
	BIT_DEPTH,
	DURATION_SECONDS,
	getRandomWAVB64,
	getWavData,
	audioBufferToMono,
	readFileAsArrayBuffer,
	SAMPLE_RATE,
	create10SecondClip,
	convertAudioBufferToWavefile,
} from './utils/wavUtils'
import { WaveFile } from 'wavefile'

const App = () => {
	const [wavB64, setWavB64] = React.useState('')
	const [encryptedWavB64, setEncryptedWavB64] = React.useState('')
	const [url, setURL] = React.useState('')
	const [volume, setVolume] = React.useState(0.1)

	const fileInputRef = React.useRef<HTMLInputElement>(null)

	useEffect(() => {
		const wavData = getWavData(base64ToUint8array(wavB64))

		getCryptoKey().then((key) => {
			encryptBuffer(wavData, key).then((res) => {
				setEncryptedWavB64(uint8arrayToBase64(res))
			})
		})
	}, [wavB64])

	useEffect(() => {
		const encryptedBuffer = base64ToUint8array(encryptedWavB64)
		getURL(encryptedBuffer).then((res) => {
			setURL(res)
		})
	}, [encryptedWavB64])

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

			setWavB64(uint8arrayToBase64(wavefile))
		} catch (error) {
			console.error('Error processing audio:', error)
		}
	}

	return (
		<div className="App">
			<button
				onClick={async () => {
					setWavB64(getRandomWAVB64())
				}}
			>
				Generate Sound
			</button>

			<button
				onClick={() => {
					setEncryptedWavB64(incrementBase64(encryptedWavB64))
				}}
			>
				Increment UUID
			</button>

			<p>WAV: {getBase64Preview(wavB64)}</p>
			<p>UUID: {getBase64Preview(encryptedWavB64)}</p>
			<p>URL: {url}</p>

			<button
				onClick={() => {
					// Play the generated sound
					const sound = new Howl({
						src: ['data:audio/wav;base64,' + wavB64],
						format: ['wav'],
						volume: volume,
					})

					sound.play()
				}}
			>
				Play Generated Sound
			</button>

			<input
				type={'range'}
				min={0}
				max={1}
				step={0.01}
				value={volume}
				onChange={(e) => {
					setVolume(parseFloat(e.target.value))
				}}
			/>

			<div>
				<input type="file" ref={fileInputRef} accept="audio/*" />
				<button onClick={processAudio}>Upload and Process</button>
			</div>

			<p>Bit rate: {BIT_DEPTH}</p>
			<p>Sample rate: {SAMPLE_RATE}</p>
		</div>
	)
}

export default App
