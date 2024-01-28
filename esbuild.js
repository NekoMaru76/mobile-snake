(async () => {
    const esbuild = await import("esbuild");
    const { default: htmlPlugin } = await import("@chialab/esbuild-plugin-html");

    await esbuild.build({
        minify: true,
        outfile: "dist/index.html",
        entryPoints: ["src/index.html"],
        plugins: [
            htmlPlugin(),
        ],
    });
})();