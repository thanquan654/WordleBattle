export function randomChars(length = 8) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let result = ''
	const array = new Uint8Array(length)
	crypto.getRandomValues(array)
	array.forEach((num) => (result += chars[num % chars.length]))
	return result
}

export const getRandomAvatar = () => {
	const avatars = [
		'https://cdn-icons-png.flaticon.com/256/5772/5772500.png',
		'https://images.vexels.com/media/users/3/291689/isolated/lists/5f356a483152bef4495c176e38c89441-cute-cat-ninja-animal.png',
		'https://cdn.iconscout.com/icon/free/png-256/free-deer-icon-download-in-svg-png-gif-file-formats--roe-herbivore-fauna-animal-flat-colors-pack-icons-1358178.png',
		'https://cdn-icons-png.flaticon.com/512/3469/3469075.png',
		'https://images.freeimages.com/image/thumbs/846/oceanic-fish-jumping-logo-design-5696271.png',
	]
	return avatars[Math.floor(Math.random() * avatars.length)]
}
