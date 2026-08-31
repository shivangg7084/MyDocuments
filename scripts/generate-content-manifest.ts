/**
 * CLI entry point for the content manifest scan.
 *
 * Run automatically before `dev` and `build` (see package.json), or manually via
 * `npm run generate-content` after adding/removing files.
 */
import { generateContentManifest } from "./content-manifest";

generateContentManifest()
  .then((stats) => {
    console.log(
      `Generated content manifest: ${stats.folders} folders, ${stats.files} files ` +
        `(${stats.markdown} markdown, ${stats.videos} video, ${stats.pdfs} pdf, ${stats.images} image, ${stats.other} other)`,
    );
  })
  .catch((err) => {
    console.error("Failed to generate content manifest:", err);
    process.exitCode = 1;
  });
