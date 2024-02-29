import seed from 'seed-random'

const PREFIXES: string[] = []
const GENRES: string[] = []
const SUFFIXES: string[] = []

const generateStrings = () => {
	PREFIXES.push(
		'',
		'Autumn',
		'Spring',
		'Winter',
		'Summer',
		'Forest',
		'Sunny',
		'Blue',
		'Red',
		'Periwinkle',
		'Violet',
		'Green',
		'Danube'
	)

	GENRES.push(
		'Allemande',
		'Arabesque',
		'Aria',
		'Art song',
		'Aubade',
		'Bacchanale',
		'Bagatelle',
		'Ballade',
		'Ballet',
		'Barcarolle',
		'Berceuse',
		'Bolero',
		'Bourrée',
		'Branle',
		'Burlesque',
		'Can-can',
		'Canary',
		'Cantata',
		'Caprice',
		'Carol',
		'Cassation',
		'Chorale',
		'Concerto',
		'Contradanse',
		'Courante',
		'Csárdás',
		'Divertimento',
		'Duet',
		'Dumka',
		'Ecossaise',
		'Etude',
		'Fandango',
		'Fanfare',
		'Fantasia',
		'Fugue',
		'Funeral march',
		'Furiant',
		'Furlana',
		'Galliard',
		'Galop',
		'Gavotte',
		'Gigue',
		'Habanera',
		'Harmonic Labyrinth',
		'Humoresque',
		'Impromptu',
		'Intermezzo',
		'Kolo',
		'Krakowiak',
		'Lied',
		'Loure',
		'Ländler',
		'March',
		'Mass',
		'Mazurka',
		'Minuet',
		'Missa brevis',
		'Missa solemnis',
		'Musette',
		'Mélodie',
		'Nocturne',
		'Nonet',
		'Octet',
		'Odzemek',
		'Opera',
		'Oratorio',
		'Partita',
		'Passacaglia',
		'Passepied',
		'Pasticcio',
		'Pastorella',
		'Pavane',
		'Polka',
		'Polonaise',
		'Prelude',
		'Quartet',
		'Quintet',
		'Requiem',
		'Rhapsody',
		'Rigaudon',
		'Rondo',
		'Saltarello',
		'Sarabande',
		'Scherzo',
		'Seguidilla',
		'Septet',
		'Serenade',
		'Sextet',
		'Sinfonia',
		'Singspiel',
		'Skočná',
		'Sonata',
		'Song cycle',
		'Sousedská',
		'Spacirka',
		'Suite',
		'Tambourin',
		'Tango',
		'Threnody',
		'Toccata',
		'Tourdion',
		'Trio',
		'Waltz',
		'Zarzuela',
		'Zortziko'
	)

	SUFFIXES.push('', 'For a Dream')

	for (let i = 0; i < 100; i++) {
		SUFFIXES.push(`No. ${i}`)
		SUFFIXES.push(`Op. ${i}`)
	}

	const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
	const accidentals = ['', '#', 'b']
	const modes = ['', 'Major', 'Minor', 'Lydian', 'Locrian', 'Phyrgian', 'Aeloian', 'Mixolydian', 'Dorian']

	for (const key of keys) {
		for (const accidental of accidentals) {
			for (const mode of modes) {
				SUFFIXES.push([`in ${key}${accidental}`, mode].join(' '))
			}
		}
	}
}

generateStrings()

export const getName = (urlStub: string) => {
	const randomPrefix: string = PREFIXES[Math.floor(seed(urlStub)() * PREFIXES.length)]
	const randomGenre: string = GENRES[Math.floor(seed(urlStub + 'genre')() * GENRES.length)]
	const randomSuffix: string = SUFFIXES[Math.floor(seed(urlStub + 'suffix')() * SUFFIXES.length)]

	return [randomPrefix, randomGenre, randomSuffix].join(' ')
}
