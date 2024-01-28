(async () => {
    const esbuild = await import("esbuild");
    const { html } = await import("@esbuilder/html");

    await esbuild.build({
        minify: true,
        outdir: "dist/",
        entryPoints: ["src/index.html"],
        bundle: true,
        plugins: [
            html(),
        ],
    });
})();