// app/api/identify/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    // Extract the base64 data from the image string
    const base64Image = image.split(",")[1];

    // Use the new model: gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      'Identify this plant and provide its name, scientific name, and a brief description. Format the response as: "Name: [plant name], Scientific Name: [scientific name], Description: [brief description]"';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // More flexible parsing of the response
    let name = "Unknown";
    let scientificName = "Unknown";
    let description = "No description available";

    const nameMatch = text.match(/Name:\s*(.*?)(?:,|\n|$)/);
    if (nameMatch) name = nameMatch[1].trim();

    const scientificNameMatch = text.match(
      /Scientific Name:\s*(.*?)(?:,|\n|$)/
    );
    if (scientificNameMatch) scientificName = scientificNameMatch[1].trim();

    const descriptionMatch = text.match(/Description:\s*(.*?)(?:\n|$)/);
    if (descriptionMatch) description = descriptionMatch[1].trim();

    return Response.json({ name, scientificName, description });
  } catch (error) {
    console.error("Error in /api/identify:", error);
    return Response.json(
      { error: `Failed to identify plant: ${error.message}` },
      { status: 500 }
    );
  }
}
