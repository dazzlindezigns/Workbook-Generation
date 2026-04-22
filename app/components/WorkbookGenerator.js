"use client";

import { useState } from "react";

const VIBES = [
  { id: "bold", label: "🔥 Bold & Energetic", desc: "High contrast, vivid colors, Gen Z energy" },
  { id: "faith", label: "✝️ Faith-Forward", desc: "Scripture-centered, reverent, intentional" },
  { id: "minimal", label: "✨ Clean & Modern", desc: "Minimal, airy, contemporary feel" },
  { id: "warm", label: "🌿 Warm & Organic", desc: "Earthy tones, soft textures, grounded" },
  { id: "illustrated", label: "🎨 Illustrated", desc: "Playful, hand-drawn feel, expressive" },
];

const PAGE_SIZES = ["Letter (8.5×11)", "A4", "Half Letter (5.5×8.5)", "Square (8×8)"];

const STYLE_MAP = {
  bold: "bold, vibrant, high-energy youth ministry style with bright colors",
  faith: "reverent, faith-centered, elegant Christian ministry style",
  minimal: "clean, modern, minimalist design with simple elegant lines",
  warm: "warm, organic, earthy illustrated style with soft textures",
  illustrated: "whimsical hand-drawn illustrated style, playful and expressive like a children's activity book",
};

function buildImagePrompt(page, vibe, isColor) {
  const bw = !isColor ? "black and white line art only, no color" : "full color illustration";
  const style = STYLE_MAP[vibe] || STYLE_MAP.illustrated;

  switch (page.activityType) {
    case "cover":
      return `Create a stunning ${bw} cover page for a youth ministry workbook in ${style}.
Main title: "${page.title}". Subtitle: "${page.subtitle || ""}".
Include: large beautiful title typography, illustrated decorative elements (clouds, stars, rays of light, crosses, doves), a scripture banner, "Youth Ministry" text at bottom, elaborate decorative border.
Make it look like a professionally designed ministry workbook cover. No placeholder boxes — complete finished illustration.`;

    case "wordsearch":
      return `Create a ${bw} word search activity page for youth ministry in hand-drawn illustrated style.
Title: "I'm Listening". Theme: ${page.topic || page.title}.
Include: decorative illustrated title with an ear icon and sparkles, a 12x12 word search grid with clear letters, a word bank below with 12 faith-related words, instruction text "Circle the words you hear", decorative illustrated border with stars and faith elements.
Make it look hand-drawn and fun for kids.`;

    case "drawit":
      return `Create a ${bw} draw-your-own activity page for youth ministry in whimsical illustrated style.
Title: "${page.title}". Theme: ${page.topic || ""}.
Include: fun illustrated title banner at top, a large decorative empty frame in the center for drawing (50% of page), instruction text "Draw a picture of you!" or similar, illustrated decorative elements around the frame (flowers, stars, crayons, clouds), a short encouraging phrase at the bottom.
Make it feel magical and inviting for children.`;

    case "coloring":
      return `Create a ${bw} coloring page for children in whimsical illustrated style.
Title: "${page.title}". Theme: ${page.topic || ""}.
Include: decorative hand-drawn border, illustrated characters or scenes related to the theme, large title at the top, blank lines for writing at the bottom.
Style: clean line art suitable for coloring, with sparkles, stars, and faith-themed elements. Fun and engaging for kids ages 6-12.`;

    default:
      return `Create a beautiful ${bw} youth ministry workbook reflection page in ${style}.
Page title: "${page.title}". Scripture: ${page.scripture || ""}. Theme: ${page.topic || ""}.
Include: decorative title banner at top, illustrated scripture scroll with space for text, 3-4 lined writing areas with decorative bullet points (stars, crosses, hearts), encouraging illustrated border elements, small faith-themed icons.
Bottom: a decorative prayer or reflection footer area. Make it look like a premium printed ministry workbook page.`;
  }
}

export default function WorkbookGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    topic: "",
    audience: "Middle School (6-8th grade)",
    vibe: "faith",
    pageCount: 6,
    isColor: true,
    hasCover: true,
    pageSize: "Letter (8.5×11)",
    extras: "",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const generateWorkbook = async () => {
    setLoading(true);
    setError(null);
    setPages([]);

    try {
      // Step 1: Anthropic plans the workbook
      setProgress({ current: 0, total: 1, label: "Planning your workbook..." });

      const pageCountForContent = form.pageCount - (form.hasCover ? 1 : 0);
      const prompt = `You are a creative youth ministry curriculum designer. Plan a workbook with illustrated pages.

Workbook Details:
- Title: "${form.title || "Untitled Workbook"}"
- Topic/Theme: "${form.topic}"
- Audience: ${form.audience}
- Style: ${form.vibe}
- Content pages: ${pageCountForContent}
- Has cover: ${form.hasCover}
- Extra instructions: ${form.extras || "none"}

Return ONLY valid JSON (no markdown, no backticks):
{
  "workbookTitle": "string",
  "subtitle": "string",
  "coverScripture": "string",
  "coverReference": "string",
  "pages": [
    {
      "title": "string",
      "topic": "string (brief description of this page focus)",
      "scripture": "string (verse text if applicable)",
      "reference": "string",
      "activityType": "reflection | coloring | wordsearch | drawit"
    }
  ]
}

Generate exactly ${pageCountForContent} page objects.
Mix activity types creatively. Include at least one wordsearch and one drawit or coloring page if page count allows.
Make content age-appropriate and Scripture-grounded.`;

      const planRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      const planData = await planRes.json();
      if (!planRes.ok) throw new Error(planData.error || "Planning failed");

      const text = planData.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const plan = JSON.parse(clean);

      const allPages = [];
      if (form.hasCover) {
        allPages.push({
          title: plan.workbookTitle,
          subtitle: plan.subtitle,
          scripture: plan.coverScripture,
          reference: plan.coverReference,
          activityType: "cover",
          topic: form.topic,
        });
      }
      plan.pages.forEach((p) => allPages.push(p));

      // Step 2: Gemini illustrates each page
      const total = allPages.length;
      const generatedPages = [];

      for (let i = 0; i < allPages.length; i++) {
        const page = allPages[i];
        setProgress({
          current: i + 1,
          total,
          label: `Illustrating: "${page.title}" (${i + 1}/${total})`,
        });

        const imagePrompt = buildImagePrompt(page, form.vibe, form.isColor);

        const imgRes = await fetch("/api/imagine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: imagePrompt }),
        });

        const imgData = await imgRes.json();

        const newPage = {
          ...page,
          imageBase64: imgData.imageBase64 || null,
          mimeType: imgData.mimeType || "image/png",
          error: imgData.error || null,
        };

        generatedPages.push(newPage);
        setPages([...generatedPages]);
      }

      setStep(3);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const colors = {
    bg: "linear-gradient(135deg, #1c2b4a 0%, #0f1d30 100%)",
    accent: "#c9a84c",
    accent2: "#e8d5a3",
    text: "#f5f0e8",
    subtext: "#c9a84c",
    border: "rgba(201,168,76,0.25)",
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.07)",
    color: colors.text, fontFamily: "DM Sans, sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700,
    color: colors.subtext, textTransform: "uppercase", letterSpacing: 1.5,
    marginBottom: 6, display: "block",
  };

  const btnPrimary = {
    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
    color: "#1c2b4a", border: "none", borderRadius: 8, padding: "12px 28px",
    fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
  };

  const card = {
    background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 32,
    border: `1px solid ${colors.border}`,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        @media print {
          .no-print { display: none !important; }
          .print-page { page-break-after: always; width: 100%; }
          .print-page img { width: 100%; height: auto; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: colors.bg }}>

        {/* Header */}
        <div className="no-print" style={{ padding: "20px 32px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📖</div>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", color: colors.text, fontSize: 20, fontWeight: 900 }}>Workbook Generator</h1>
            <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 11 }}>Youth Ministry Edition · AI Illustrated</p>
          </div>
          {step === 3 && (
            <button className="no-print" onClick={() => { setStep(1); setPages([]); }} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${colors.border}`, color: colors.subtext, borderRadius: 6, padding: "6px 16px", fontFamily: "DM Sans, sans-serif", fontSize: 12, cursor: "pointer" }}>
              ← New Workbook
            </button>
          )}
        </div>

        {/* Step indicators */}
        {step < 3 && !loading && (
          <div className="no-print" style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 0 0" }}>
            {["Describe", "Specs", "Generate"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})` : step === i + 1 ? `${colors.accent}30` : "transparent", border: `2px solid ${step >= i + 1 ? colors.accent : colors.accent + "30"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: step >= i + 1 ? colors.text : colors.subtext }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: step === i + 1 ? colors.text : colors.subtext }}>{label}</span>
                {i < 2 && <div style={{ width: 24, height: 1, background: `${colors.accent}30` }} />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="no-print fade-up" style={{ maxWidth: 580, margin: "32px auto", padding: "0 24px" }}>
            <div style={card}>
              <h2 style={{ fontFamily: "Playfair Display, serif", color: colors.text, fontSize: 22, marginBottom: 6 }}>Tell me about your workbook</h2>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 13, marginBottom: 28 }}>AI plans the content · Gemini illustrates every page</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Workbook Title</label>
                  <input style={inputStyle} placeholder="e.g. Glory Carrier, Identity in Christ..." value={form.title} onChange={(e) => update("title", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Topic / Theme</label>
                  <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Describe the spiritual theme, series focus, or message goal..." value={form.topic} onChange={(e) => update("topic", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Audience</label>
                  <select style={inputStyle} value={form.audience} onChange={(e) => update("audience", e.target.value)}>
                    {["Elementary (3-5th grade)", "Middle School (6-8th grade)", "High School (9-12th grade)", "Young Adults (18-25)", "Mixed Youth"].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Style / Vibe</label>
                  <div style={{ display: "grid", gap: 8 }}>
                    {VIBES.map((v) => (
                      <div key={v.id} onClick={() => update("vibe", v.id)} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${form.vibe === v.id ? colors.accent : colors.accent + "30"}`, background: form.vibe === v.id ? `${colors.accent}18` : "transparent", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 16 }}>{v.label.split(" ")[0]}</span>
                        <div>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, color: colors.text, margin: 0 }}>{v.label.split(" ").slice(1).join(" ")}</p>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: colors.subtext, margin: 0 }}>{v.desc}</p>
                        </div>
                        {form.vibe === v.id && <span style={{ marginLeft: "auto", color: colors.accent }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <button style={btnPrimary} onClick={() => setStep(2)}>Next: Specs →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="no-print fade-up" style={{ maxWidth: 580, margin: "32px auto", padding: "0 24px" }}>
            <div style={card}>
              <h2 style={{ fontFamily: "Playfair Display, serif", color: colors.text, fontSize: 22, marginBottom: 6 }}>Set your specs</h2>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 13, marginBottom: 28 }}>Format, size, and style details</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Number of Pages (including cover if selected)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input type="range" min={3} max={12} value={form.pageCount} onChange={(e) => update("pageCount", Number(e.target.value))} style={{ flex: 1, accentColor: colors.accent }} />
                    <div style={{ width: 40, textAlign: "center", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 22, color: colors.accent }}>{form.pageCount}</div>
                  </div>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: colors.subtext, marginTop: 4 }}>⚡ Each page is individually illustrated — allow ~30 sec per page</p>
                </div>
                <div>
                  <label style={labelStyle}>Page Size</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {PAGE_SIZES.map((ps) => (
                      <div key={ps} onClick={() => update("pageSize", ps)} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${form.pageSize === ps ? colors.accent : colors.accent + "30"}`, background: form.pageSize === ps ? `${colors.accent}18` : "transparent", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.pageSize === ps ? colors.text : colors.subtext, fontWeight: form.pageSize === ps ? 700 : 400 }}>
                        {ps}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Color Mode</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["🎨 Color", true], ["⬛ B&W", false]].map(([label, val]) => (
                        <div key={String(val)} onClick={() => update("isColor", val)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${form.isColor === val ? colors.accent : colors.accent + "30"}`, background: form.isColor === val ? `${colors.accent}18` : "transparent", cursor: "pointer", textAlign: "center", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.isColor === val ? colors.text : colors.subtext, fontWeight: form.isColor === val ? 700 : 400 }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Cover Page</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["✅ Yes", true], ["❌ No", false]].map(([label, val]) => (
                        <div key={String(val)} onClick={() => update("hasCover", val)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${form.hasCover === val ? colors.accent : colors.accent + "30"}`, background: form.hasCover === val ? `${colors.accent}18` : "transparent", cursor: "pointer", textAlign: "center", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.hasCover === val ? colors.text : colors.subtext, fontWeight: form.hasCover === val ? 700 : 400 }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Anything else? (optional)</label>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="e.g. Include a prayer prompt, make it for a specific sermon series..." value={form.extras} onChange={(e) => update("extras", e.target.value)} />
                </div>

                {error && (
                  <div style={{ background: "#ff444420", border: "1px solid #ff4444", borderRadius: 8, padding: 12, color: "#ff8888", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>{error}</div>
                )}

                {loading && (
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 24, textAlign: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${colors.accent}30`, borderTopColor: colors.accent, animation: "spin 0.9s linear infinite", margin: "0 auto 14px" }} />
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.text, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{progress.label}</p>
                    {progress.total > 0 && (
                      <>
                        <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, margin: "14px 0 6px", overflow: "hidden" }}>
                          <div style={{ width: `${(progress.current / progress.total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})`, borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                        <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 12 }}>{progress.current} of {progress.total} pages illustrated</p>
                      </>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ ...btnPrimary, background: "transparent", border: `1px solid ${colors.border}`, color: colors.text, flex: "0 0 auto" }} onClick={() => setStep(1)} disabled={loading}>← Back</button>
                  <button style={{ ...btnPrimary, flex: 1, opacity: loading || !form.topic ? 0.6 : 1 }} onClick={generateWorkbook} disabled={loading || !form.topic}>
                    {loading ? "Illustrating..." : "✨ Generate & Illustrate"}
                  </button>
                </div>
              </div>
            </div>

            {/* Live preview while generating */}
            {loading && pages.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 11, textAlign: "center", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Pages illustrated so far</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {pages.map((page, i) => (
                    <div key={i} className="fade-up">
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 9, color: colors.subtext, textAlign: "center", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                        {page.activityType === "cover" ? "Cover" : `Page ${i + 1}`}
                      </p>
                      {page.imageBase64 ? (
                        <img src={`data:${page.mimeType};base64,${page.imageBase64}`} alt={page.title} style={{ width: "100%", borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }} />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "3/4", background: "rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#ff8888", fontSize: 10, fontFamily: "DM Sans, sans-serif" }}>Failed</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Final preview */}
        {step === 3 && pages.length > 0 && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "20px 24px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", color: colors.subtext, fontSize: 13 }}>
                🎨 {pages.length} illustrated pages · {form.pageSize} · {form.isColor ? "Full Color" : "B&W"}
              </span>
              <button style={btnPrimary} onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
            </div>

            <div className="no-print" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {pages.map((page, i) => (
                <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: colors.subtext, textAlign: "center", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                    {page.activityType === "cover" ? "Cover" : `Page ${i + 1} · ${page.activityType}`}
                  </p>
                  {page.imageBase64 ? (
                    <img src={`data:${page.mimeType};base64,${page.imageBase64}`} alt={page.title} style={{ width: "100%", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "3/4", background: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                      <span style={{ fontSize: 24 }}>⚠️</span>
                      <span style={{ color: colors.subtext, fontSize: 11, fontFamily: "DM Sans, sans-serif", textAlign: "center", padding: "0 12px" }}>Image generation failed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "none" }} className="print-pages">
              {pages.map((page, i) => (
                <div key={i} className="print-page">
                  {page.imageBase64 && (
                    <img src={`data:${page.mimeType};base64,${page.imageBase64}`} alt={page.title} style={{ width: "100%", height: "100vh", objectFit: "contain" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
