export const map = (value: number, start1: number, end1: number, start2: number, end2: number) => {
	return ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
}