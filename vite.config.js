import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { defineConfig } from "vite";

const gen_variable_placeholder_key = (text) => `{{${text}}}`;
const gen_template_placeholder_key = (text) => `{{!${text}!}}`;

const find_all_template_placeholders = (text) => {
	const regex = /{{!(.*?)!}}/g;
	let matches = [];
	let match;
	while ((match = regex.exec(text)) !== null) {
		matches.push(match[1]);
	}
	return matches;
};

const replace_variables = (html, variables) => {
	for (const [key, value] of Object.entries(variables)) {
		html = html.replaceAll(gen_variable_placeholder_key(key), value);
	}
	return html;
};

const locale_urls = (html, lang) => {
	const regex = /href="!(.*?)"/g;

	let match;

	while ((match = regex.exec(html)) !== null) {
		const new_url =
			lang === "en" ? match[1] : `/${lang.replaceAll("/", "")}${match[1]}`;
		html = html.replaceAll(`href="!${match[1]}"`, `href="${new_url}"`);
	}

	return html;
};

const replace_templates = (html) => {
	const placeholders = find_all_template_placeholders(html);

	for (const placeholder of placeholders) {
		const template_path = path.resolve(
			__dirname,
			"templates",
			`${placeholder}.html`
		);

		if (!fs.existsSync(template_path)) {
			console.error(`Template file ${template_path} not found`);
			continue;
		}

		const template_content = fs.readFileSync(template_path, "utf-8");

		html = html.replaceAll(
			gen_template_placeholder_key(placeholder),
			template_content
		);
	}

	return html;
};

const set_assets_version = (html) => {
	const version = new Date().getTime();
	html = html.replaceAll("{{assets_version}}", version);
	return html;
}

export default defineConfig({
	base: "/",
	plugins: [
		{
			name: "templates-substitution",
			apply: "build",
			
			buildStart() {
				this.addWatchFile(path.resolve(__dirname, "lang"));
			},

			async closeBundle() {
				const lang_dir = path.resolve(__dirname, "lang");
				const lang_files = fs
					.readdirSync(lang_dir)
					.filter((file) => file.endsWith(".json"));

				const lang_data = lang_files.reduce((acc, file) => {
					const lang_name = path.basename(file, ".json");
					const file_path = path.join(lang_dir, file);
					acc[lang_name] = JSON.parse(fs.readFileSync(file_path, "utf-8"));
					return acc;
				}, {});

				let html_files = glob
					.sync("**/*.html", { cwd: path.resolve(__dirname, "./") })
					.filter(
						(file) =>
							!file.includes("node_modules") &&
							!file.includes("templates") &&
							!file.includes("dist")
					);

				for (const file of html_files) {
					const file_path = path.resolve(__dirname, "./", file);
					let content = fs.readFileSync(file_path, "utf-8");

					for (const [lang, variables] of Object.entries(lang_data)) {
						let modified_content = replace_templates(content);
						modified_content = replace_variables(modified_content, variables);
						modified_content = locale_urls(modified_content, lang);
						modified_content = set_assets_version(modified_content);

						let output_dir;

						if (lang === "en") {
							output_dir = path.resolve(__dirname, "dist", path.dirname(file));
						} else {
							output_dir = path.resolve(
								__dirname,
								"dist",
								lang,
								path.dirname(file)
							);
						}

						output_dir = output_dir.replace("/pages", "");

						if (lang === "en") {
							output_dir = output_dir.replace("/en", "");
						}

						fs.ensureDirSync(output_dir);
						fs.writeFileSync(
							path.join(output_dir, path.basename(file)),
							modified_content,
							"utf-8"
						);
					}
				}
			},
		},
	],
	build: {
        rollupOptions: {
            output: {
                dir: './dist/',
                entryFileNames: 'main.js',
                assetFileNames: 'main.css',
                chunkFileNames: "chunk.js",
                manualChunks: undefined,
            }
        }
    }
});
