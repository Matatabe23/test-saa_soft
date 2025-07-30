const { ESLint } = require('eslint');

const eslintFilterIgnoredFiles = async (/** @type {string[]} */ files) => {
	const eslint = new ESLint();
	return (
		await Promise.all(
			files.map(async (file) => {
				return (await eslint.isPathIgnored(file)) ? '' : file;
			})
		)
	).filter((file) => !!file);
};

/** @type {Record<string, string | string[] | Function>} */
const config = {
	'**/*.{ts,js,cjs,json,vue}': async (files) => {
		const filesToLint = await eslintFilterIgnoredFiles(files);
		const cmd = `eslint --max-warnings=0 ${filesToLint.join(' ')}`;
		return filesToLint.length ? cmd : [];
	},
	'**/*.{ts,js,cjs,vue,json}': () => {
		return 'pnpm type-check';
	}
};

module.exports = config;
