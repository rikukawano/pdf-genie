import fs from "fs/promises";
import { fromPath } from "pdf2pic";
import { getDocument } from "pdfjs-dist";

async function pdfToImages(
  pdfPath: string,
  outputDir: string
): Promise<string[]> {
  console.log(`Starting conversion for: ${pdfPath}`);
  // Ensure the output directory exists, create it if it doesn't
  await fs.mkdir(outputDir, { recursive: true });

  const imageFilePaths: string[] = [];

  // Determine the number of pages
  const pageCount = await getPdfPageCount(pdfPath);
  console.log(`Number of pages in ${pdfPath}: ${pageCount}`);

  // Determine the orientation of the PDF
  console.log(`Determining orientation for: ${pdfPath}`);
  const orientation = await getPdfPageOrientation(pdfPath);
  const isLandscape = orientation === "landscape";

  // Initialize the pdf2pic converter with desired settings
  console.log(`Initializing converter for: ${pdfPath}`);
  const converter = fromPath(pdfPath, {
    density: 300, // Image quality (DPI)
    quality: 100, // Image compression level
    saveFilename: "page",
    savePath: outputDir,
    format: "jpeg",
    width: isLandscape ? 1754 : 1240,
    height: isLandscape ? 1240 : 1754,
  });

  // Perform the conversion for each page in parallel
  console.log(`Starting parallel conversion for: ${pdfPath}`);
  const pagePromises = [];
  for (let i = 1; i <= pageCount; i++) {
    pagePromises.push(converter(i, { responseType: "image" }));
  }
  const results = await Promise.all(pagePromises);

  // Collect the paths of the generated images
  results.forEach((result) => {
    if (result.path) {
      imageFilePaths.push(result.path);
    }
  });

  console.log(`Completed conversion for: ${pdfPath}`);
  return imageFilePaths;
}

async function getPdfPageCount(pdfPath: string): Promise<number> {
  const pdf = await getDocument(pdfPath).promise;
  return pdf.numPages;
}

async function getPdfPageOrientation(
  pdfPath: string
): Promise<"portrait" | "landscape"> {
  const pdf = await getDocument(pdfPath).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  return viewport.width > viewport.height ? "landscape" : "portrait";
}

export default pdfToImages;
