import seed from 'seed-random'

export const getRandomColorPalette = (urlStub: string) => {
	const random = seed(urlStub)

	const hue = Math.floor(random() * 360)

	return {
		color1: `hsla(${hue}, 100%, 24%, 0.1)`,
		color2: `hsla(${hue}, 93%, 53%, 0.1)`,
		color3: `hsla(${(hue + 70) % 360}, 72%, 30%, 1)`,
		color4: `hsla(${(hue + 60) % 360}, 10%, 24%, 1)`,
	}
}
