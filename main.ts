import {Editor, MarkdownView, Notice, Plugin} from 'obsidian';

const prettier = require("prettier");
const plugins = [
	require("prettier/parser-babel"),
	require("prettier/parser-html"),
	require("prettier/parser-yaml"),
	require("prettier/parser-graphql"),
	require("prettier/parser-typescript")
];

type FormatterFn = (name: string) => string;

interface Formatter {
	name: string;
	parser: FormatterFn;
}

export default class FormatCodePlugin extends Plugin {
	async onload() {
		let supportedFormats: Formatter[] = [
			{
				name: "JSON",
				parser: function (raw: string):string {
					let obj = JSON.parse(raw)
					return JSON.stringify(obj, null, 4)
				}
			},
			// {
			// 	name: "YAML",
			// 	parser: "yaml"
			// },
			// {
			// 	name: "HTML",
			// 	parser: "html"
			// },
			// {
			// 	name: "GraphQL",
			// 	parser: "graphql"
			// },
			// {
			// 	name: "TypeScript",
			// 	parser: "typescript"
			// }
		];

		supportedFormats.forEach(x => {
			this.addCommand({
				id: 'format-prettier-' + x.name,
				name: x.name,
				editorCallback: (editor: Editor, view: MarkdownView) => {
					try {
						const formatted = x.parser(editor.getSelection())

						// const formatted = prettier.format(editor.getSelection(), {
						// 	semi: false,
						// 	parser: x.parser,
						// 	plugins: plugins
						// });
						console.log('try: ', formatted)
						editor.replaceSelection(formatted);
					} catch (e) {
						console.log(e);
						new Notice("Format: " + e);
					}
				}
			});
		});
	}
}
