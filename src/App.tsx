import React from 'react'
import { Howl } from 'howler'
import { encryptB64, getRandomWAVB64 } from './utils'



const App = () => {
	return (
		<div className="App">
			<button onClick={async () => {
				const wavB64 = getRandomWAVB64() // TODO includes wav header



				// Encrypt the wav file

				const encryptedWavB64 = await encryptB64(wavB64)

				console.log(wavB64)

                // Create a Howler.js sound object and play it when the button is clicked
				const sound = new Howl({
					src: ['data:audio/wav;base64,' + wavB64],
					format: ['wav'],
				})


				sound.play()
			}}>
				Play random sound
			</button>
		</div>
	)
}



export default App
