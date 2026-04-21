import { NextResponse } from "next/server";

const VTON_PROMPT =
  "A realistic photo of a person wearing the provided clothing. Maintain the original face and identity. Ensure correct body fit, natural folds, proper lighting, high detail, no distortions, and realistic fabric texture.";

// IDM-VTON — best open-source virtual try-on model on Replicate
const REPLICATE_MODEL =
  "yisol/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f";

// ── Polling helper ──────────────────────────────────────────────────────────

async function pollReplicate(predictionId: string, token: string): Promise<string> {
  const maxAttempts = 90; // 90 × 2s = 3 min max
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();

    if (data.status === "succeeded") {
      const out = data.output;
      if (Array.isArray(out) && out[0]) return out[0] as string;
      if (typeof out === "string") return out;
      throw new Error("Unexpected Replicate output format");
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Prediction ${data.status}: ${data.error ?? "unknown"}`);
    }
  }
  throw new Error("Prediction timed out after 3 minutes");
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { userImage, garmentId } = await req.json();

    if (!userImage || !garmentId) {
      return NextResponse.json(
        { error: "Missing userImage or garmentId" },
        { status: 400 }
      );
    }

    const token = process.env.REPLICATE_API_TOKEN?.trim();

    // ── No API key → tell client to show setup prompt ──────────────────────
    if (!token) {
      console.info("[VTON] No REPLICATE_API_TOKEN — returning mock response.");
      await new Promise(r => setTimeout(r, 1500)); // short fake delay
      return NextResponse.json({
        success: true,
        isMock: true,
        generatedUrl: userImage,
        garmentUrl: garmentId,
      });
    }

    // ── Real Replicate call ────────────────────────────────────────────────
    console.info("[VTON] Creating IDM-VTON prediction...");

    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL.split(":")[1],
        input: {
          human_img: userImage,   // data URI or public URL
          garm_img: garmentId,    // garment image (public Unsplash URL)
          garment_des: VTON_PROMPT,
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("[VTON] Replicate create error:", err);
      throw new Error(`Replicate create failed (${createRes.status}): ${err}`);
    }

    const prediction = await createRes.json();
    console.info("[VTON] Prediction created:", prediction.id);

    const resultUrl = await pollReplicate(prediction.id, token);
    console.info("[VTON] Result:", resultUrl);

    return NextResponse.json({
      success: true,
      isMock: false,
      generatedUrl: resultUrl,
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[VTON] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
