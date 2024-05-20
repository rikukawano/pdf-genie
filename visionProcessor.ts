import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

function convertFileToGenerativePart(filePath: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

async function extractTextFromImages(imagePaths: string[]): Promise<string> {
  console.log(`Starting text extraction from images: ${imagePaths.join(", ")}`);

  // Get the generative model for vision processing
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  // Define the prompt for the AI model
  const prompt = `
    あなたは、熟練したドキュメント分析者です。与えられた画像は、SaaS製品に関するPDFドキュメントから変換されたものです。
    あなたの役割は、画像に含まれるすべての重要な情報を読み取り、SaaS製品について正確かつ詳細に説明することです。
    画像内のテキスト、図、グラフ、表などすべての要素を注意深く分析し、それらが伝える情報を的確に理解してください。
    製品の機能、特徴、利点、ターゲットユーザー、価格設定など、SaaS製品に関するあらゆる重要な情報を抽出してください。
    抽出した情報を論理的に整理し、SaaS製品の全体像が明確に伝わるような構成で説明してください。
    製品の主要な機能や特徴から始め、詳細な説明を加えていきます。また、図やグラフから得られる洞察も適切に説明に組み込んでください。
    専門用語や固有名詞は正しく認識し、それらの意味や文脈を踏まえて説明してください。情報の正確性と完全性を確保することが重要です。
    最終的な出力は、SaaS製品に関する包括的な説明となるようにしてください。
    これにより、読者は画像を見なくても、製品の特徴や価値を深く理解することができるようになります。
    あなたの知識と理解力を最大限に活用し、高品質な説明を生成してください。画像の分析を開始します。
  `;

  // Convert each image file to a generative AI part
  console.log(`Converting image files to generative AI parts...`);
  const imageParts = imagePaths.map((path) =>
    convertFileToGenerativePart(path, "image/jpeg")
  );

  // Generate content using the AI model
  console.log(`Generating content using the AI model...`);
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const structuredText = await response.text();

  console.log(`Completed text extraction from images.`);
  return structuredText;
}

export default extractTextFromImages;
