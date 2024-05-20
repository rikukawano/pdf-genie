#!/usr/bin/env bun

import fs from "fs/promises";
import path from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import pdfToImages from "./pdfToImages";
import extractTextFromImages from "./visionProcessor";

// Function to process each file and convert it to images
async function processFiles(files: string[], outputDir: string) {
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    const imagePaths = await pdfToImages(file, outputDir);
    console.log(`Converted ${imagePaths.length} pages from ${file}`);
    console.log("Image paths:", imagePaths);

    // Process the images using the Gemini-Pro-Vision model
    const structuredText = await extractTextFromImages(imagePaths);
    console.log("Structured text:", structuredText);
  }
}

// Main function to handle command-line arguments and initiate processing
async function main() {
  // Parse command-line arguments using yargs
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: pdfgenie [options] <files...>")
    .option("output", {
      alias: "o",
      type: "string",
      description: "Output directory for converted images",
      default: "output",
    })
    .help("help")
    .alias("help", "h").argv;

  // Resolve the output directory path
  const outputDir = path.resolve(argv.output);
  // Ensure the output directory exists, create it if it doesn't
  await fs.mkdir(outputDir, { recursive: true });

  // Process the provided files
  await processFiles(argv._ as string[], outputDir);

  console.log("PDF to image conversion completed.");
}

// Execute the main function and handle any errors
main().catch((err) => {
  console.error("An error occurred:", err);
  process.exit(1);
});
