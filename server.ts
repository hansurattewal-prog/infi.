import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", atelier: "Infi Formalwear" });
});

// AI Fashion Concierge & Bespoke Tailoring Stylist endpoint
app.post("/api/stylist", async (req, res) => {
  try {
    const { prompt, mode, measurements, dressContext } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback with expert luxury fashion rules
      const fallbackResponse = generateStylistFallback(mode, prompt, measurements, dressContext);
      return res.json({ response: fallbackResponse });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let systemInstruction = `You are "Infi Atelier Private Concierge & Master Couturier", a high-end luxury formalwear stylist and fit specialist for Infi (a couture maison specializing in evening gowns, cocktail dresses, and bespoke made-to-measure tailoring).
Your tone is sophisticated, reassuring, refined, and warmly attentive (akin to Christian Dior, Jimmy Choo, or Chanel personal shoppers).
Keep answers concise, actionable, and elegant.
For size/measurement questions, explain which size (XS, S, M, L, XL, XXL) or whether custom bespoke sizing is advised, considering bust, waist, hips, and fabric drape.
Always reassure the client with Infi's 30-day effortless returns, complimentary atelier alterations, and bespoke craftsmanship guarantee.`;

    let userPrompt = "";
    if (mode === "size_recommendation") {
      userPrompt = `Client measurements & sizing query:
Bust: ${measurements?.bust || "Not specified"} in
Waist: ${measurements?.waist || "Not specified"} in
Hips: ${measurements?.hips || "Not specified"} in
Height: ${measurements?.height || "Not specified"}
Fit preference: ${measurements?.fitPreference || "Fitted silhouette"}
Dress: ${dressContext?.name || "Luxury Formal Dress"} (Fabric: ${dressContext?.fabric || "Silk / Satin / Velvet"})
Question/Details: ${prompt || "What is my recommended size and fit notes?"}

Please provide:
1. Recommended Infi Standard Size (XS, S, M, L, XL, or Made-to-Measure Bespoke)
2. Fit Analysis (how the fabric will drape on their curves)
3. Tailor's Advice (e.g. hemline with heels, bust support).`;
    } else {
      userPrompt = `Client inquiry: "${prompt}".
Context dress (if any): ${dressContext?.name || "Infi Collection"}.
Provide an elegant, helpful stylist response with styling pairings, fabric care, or bespoke advice.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Thank you for consulting Infi Atelier. Our master stylists are at your disposal.";
    return res.json({ response: text });
  } catch (error: any) {
    console.error("AI Stylist API error:", error?.message || error);
    // Return friendly luxury stylist message on any API error
    const fallbackResponse = generateStylistFallback(
      req.body.mode,
      req.body.prompt,
      req.body.measurements,
      req.body.dressContext
    );
    return res.json({ response: fallbackResponse });
  }
});

// AI-Powered Recommendation Engine endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const { profile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ status: "fallback", message: "No API key configured, using client heuristic." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the Master Haute Couture Recommendation Intelligence for Infi (luxury formalwear & bespoke atelier).
Your task is to analyze client behavior (browsed gowns, active cart items, wishlist, past orders) and explicit preferences (style quiz: occasion, silhouette, mood, fit priority).
Select 4 recommended dress IDs from the available Infi collection IDs:
- 'infi-01' (Architectural Cowl Neck Column in Heavy Italian Silk Crepe)
- 'infi-02' (Midnight Velvet Mermaid Gala Gown in Lyon Silk Velvet)
- 'infi-03' (Bias-Cut Mulberry Silk Slip Gown in 28 Momme Silk Satin)
- 'infi-04' (Haute Corded Chantilly Lace Ball Gown with cathedral train)
- 'infi-05' (Champagne Off-The-Shoulder Draped Gown in Liquid Crepe)
- 'infi-06' (Sculpted Mikado Architectural Mermaid in Japanese Silk Mikado)

And select 4 complementary accessory IDs from:
- 'acc-1' (Constellation Pavé Crystal Drops)
- 'acc-2' (Aurelia Duchesse Satin Minaudière)
- 'acc-3' (Starlight 90mm Strappy Stilettos)
- 'acc-4' (Gossamer Mulberry Silk Chiffon Stole)

Return strictly a valid JSON object matching this schema:
{
  "personaSummary": "Short evocative title for client aesthetic (e.g., 'The Obsidian Gala Muse')",
  "confidenceScore": 98,
  "primaryOccasion": "Gala / Black Tie / Cocktail / Bridal",
  "preferredSilhouette": "Column / Mermaid / Bias Cut / Ball Gown",
  "dresses": [
    {
      "dressId": "infi-01",
      "matchScore": 98,
      "reason": "Detailed couture justification tailored to their specific browsing & quiz answers",
      "curatorTag": "Top Aesthetic Match"
    }
  ],
  "accessories": [
    {
      "accessoryId": "acc-1",
      "matchScore": 95,
      "reason": "Why this specific accessory pairs with their persona",
      "pairedCategory": "Haute Jewelry"
    }
  ],
  "stylistNote": "Warm personal 2-sentence note from Infi Master Couturier"
}`;

    const prompt = `Client Behavior & Explicit Preferences Profile:
${JSON.stringify(profile, null, 2)}

Provide personalized formalwear recommendations and a persona profile in JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Recommendations API error:", err?.message || err);
    return res.status(200).json({ status: "fallback", error: err?.message });
  }
});

function generateStylistFallback(
  mode?: string,
  prompt?: string,
  measurements?: any,
  dressContext?: any
): string {
  if (mode === "size_recommendation" && measurements) {
    const bust = parseFloat(measurements.bust) || 34;
    const waist = parseFloat(measurements.waist) || 27;
    const hips = parseFloat(measurements.hips) || 37;

    let recommendedSize = "M";
    if (bust <= 33 && waist <= 26 && hips <= 36) recommendedSize = "XS (US 0-2 / UK 6)";
    else if (bust <= 35 && waist <= 28 && hips <= 38) recommendedSize = "S (US 4-6 / UK 8-10)";
    else if (bust <= 38 && waist <= 31 && hips <= 41) recommendedSize = "M (US 8-10 / UK 12)";
    else if (bust <= 41 && waist <= 34 && hips <= 44) recommendedSize = "L (US 12-14 / UK 14-16)";
    else if (bust <= 45 && waist <= 38 && hips <= 48) recommendedSize = "XL (US 16 / UK 18)";
    else recommendedSize = "Custom Bespoke Tailoring (Made-to-Measure)";

    return `Based on your body proportions (${bust}" bust, ${waist}" waist, ${hips}" hips), Infi Master Couturiers recommend: **${recommendedSize}**.

• **Fit Profile**: This will offer an immaculate drape across the bodice while allowing fluid movement through the hips and hem.
• **Fabric Behavior**: For luxury silks and structured crepes, we leave a 0.75" internal seam allowance for easy micro-alterations.
• **Atelier Guarantee**: If your proportions vary across standard categories, our "Custom Tailoring" service crafts each gown directly to your exact anatomical specifications with zero alteration hassle.`;
  }

  const cleanPrompt = (prompt || "").toLowerCase();
  if (cleanPrompt.includes("return") || cleanPrompt.includes("exchange")) {
    return "Infi offers a complimentary 30-day return and exchange window for all unworn formalwear with original atelier tags. Bespoke made-to-measure orders also include our Complimentary Fit Guarantee, including one round of private tailoring adjustments.";
  }
  if (cleanPrompt.includes("measure") || cleanPrompt.includes("tailor") || cleanPrompt.includes("custom")) {
    return "For bespoke custom orders, our master tailors require your bust, waist, hips, hollow-to-hem, and heel height. You can use our interactive Custom Tailoring studio with illustrated guides, or book a 1-on-1 virtual measurement session with our head couturier.";
  }
  if (cleanPrompt.includes("shipping") || cleanPrompt.includes("delivery") || cleanPrompt.includes("time")) {
    return "Standard collection dresses arrive within 3–5 business days via discreet white-glove express courier. Bespoke made-to-measure orders require 14–21 days of handcrafted atelier construction before express delivery.";
  }

  return `Welcome to Infi Atelier. For ${dressContext?.name ? `"${dressContext.name}"` : "our formalwear collection"}, our stylists recommend pairing sculptural evening gowns with delicate crystal drop earrings, a minimalist satin clutch, and 85mm strappy stilettos. Contact our atelier hotline at +91 8295313004 for private salon bookings.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Infi Atelier Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
