module.exports = {
	/**
	 * Tabs
	 * https://prettier.io/docs/en/options.html#tabs
	 *
	 * Indent lines with tabs instead of spaces.
	 *
	 * useTabs: <bool>
	 * default: false
	 */
	useTabs: true,

	/**
	 * Semicolons
	 * https://prettier.io/docs/en/options.html#semicolons
	 *
	 * Print semicolons at the ends of statements
	 *
	 * semi: <bool>
	 * default: true
	 */
	semi: true,

	/**
	 * Quotes
	 * https://prettier.io/docs/en/options.html#quotes
	 *
	 * Use single quotes instead of double quotes.
	 *
	 * singleQuote: <bool>
	 * default: false
	 */
	singleQuote: false,

	/**
	 * Trailing Commas
	 * https://prettier.io/docs/en/options.html#trailing-commas
	 *
	 * Print trailing commas wherever possible when multi-line. (A single-line array, for example, never gets trailing commas.)
	 *
	 * trailingComma: "<es5|none|all>"
	 * default: 'es5'
	 */
	trailingComma: "es5",

	/**
	 * Bracket Spacing
	 * https://prettier.io/docs/en/options.html#bracket-spacing
	 *
	 * Print spaces between brackets in object literals.
	 *
	 * bracketSpacing: <bool>
	 * default: true
	 */
	bracketSpacing: true,

	/**
	 * Arrow Function Parentheses
	 * https://prettier.io/docs/en/options.html#arrow-function-parentheses
	 *
	 * Include parentheses around a sole arrow function parameter.
	 *
	 * arrowParens: "<always|avoid>"
	 * default: "always"
	 */
	arrowParens: "always",

	/**
	 * End of Line
	 * https://prettier.io/docs/en/options.html#end-of-line
	 *
	 * For historical reasons, there exist two common flavors of line endings in text files. That is \n (or LF for Line Feed) and \r\n (or CRLF for Carriage Return + Line Feed). The former is common on Linux and macOS, while the latter is prevalent on Windows. Some details explaining why it is so can be found on Wikipedia.
	 *
	 * endOfLine: "<lf|crlf|cr|auto>"
	 * default: "lf"
	 */
	endOfLine: "auto",
};
