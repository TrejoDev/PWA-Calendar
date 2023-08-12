module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,js,html,svg}'
	],
	swDest: 'dist/sw.js',
	swSrc: 'src/sw-template.js', //generateSW no funciona con esta propiedad
	// ignoreURLParametersMatching: [
	// 	/^utm_/,
	// 	/^fbclid$/
	// ]
};