"use client";

import { useState, useRef } from "react";

const VIBES = [
  { id: "bold", label: "🔥 Bold & Energetic", desc: "High contrast, vivid colors, Gen Z energy" },
  { id: "faith", label: "✝️ Faith-Forward", desc: "Scripture-centered, reverent, intentional" },
  { id: "minimal", label: "✨ Clean & Modern", desc: "Minimal, airy, contemporary feel" },
  { id: "warm", label: "🌿 Warm & Organic", desc: "Earthy tones, soft textures, grounded" },
  { id: "illustrated", label: "🎨 Illustrated", desc: "Playful, hand-drawn feel, expressive" },
];

const PAGE_SIZES = ["Letter (8.5×11)", "A4", "Half Letter (5.5×8.5)", "Square (8×8)"];
const OUTPUT_FORMATS = ["PDF", "Page Images", "Both"];

const VIBES_STYLES = {
  bold: {
    bg: "linear-gradient(135deg, #1a0a2e 0%, #16213e 100%)",
    accent: "#ff6b35",
    accent2: "#ffd23f",
    text: "#ffffff",
    subtext: "#c9b8ff",
    pageBg: "#ffffff",
    pageAccent: "#ff6b35",
    pageAccent2: "#6c63ff",
    headerFont: "Playfair Display",
    bodyFont: "DM Sans",
  },
  faith: {
    bg: "linear-gradient(135deg, #1c2b4a 0%, #0f1d30 100%)",
    accent: "#c9a84c",
    accent2: "#e8d5a3",
    text: "#f5f0e8",
    subtext: "#c9a84c",
    pageBg: "#fdfaf4",
    pageAccent: "#2c5282",
    pageAccent2: "#c9a84c",
    headerFont: "Playfair Display",
    bodyFont: "DM Sans",
  },
  minimal: {
    bg: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)",
    accent: "#111111",
    accent2: "#555555",
    text: "#111111",
    subtext: "#666666",
    pageBg: "#ffffff",
    pageAccent: "#111111",
    pageAccent2: "#888888",
    headerFont: "Playfair Display",
    bodyFont: "DM Sans",
  },
  warm: {
    bg: "linear-gradient(135deg, #2d1b0e 0%, #3d2b1a 100%)",
    accent: "#e8a87c",
    accent2: "#f4c98e",
    text: "#fdf3e7",
    subtext: "#d4a574",
    pageBg: "#fdf6ec",
    pageAccent: "#8b4513",
    pageAccent2: "#e8a87c",
    headerFont: "Playfair Display",
    bodyFont: "DM Sans",
  },
  illustrated: {
    bg: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)",
    accent: "#ff9f43",
    accent2: "#48dbfb",
    text: "#ffffff",
    subtext: "#a8d8ea",
    pageBg: "#fffef5",
    pageAccent: "#ff6b6b",
    pageAccent2: "#48dbfb",
    headerFont: "Playfair Display",
    bodyFont: "DM Sans",
  },
};

function PagePreview({ page, vibe, index, isColor }) {
  const s = VIBES_STYLES[vibe];
  const isCover = page.type === "cover";

  const coverStyle = {
    width: "100%",
    aspectRatio: "8.5/11",
    background: isCover
      ? `linear-gradient(160deg, ${s.pageAccent} 0%, ${s.pageAccent2} 100%)`
      : s.pageBg,
    filter: !isColor && !isCover ? "grayscale(100%)" : "none",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    position: "relative",
    fontFamily: s.bodyFont,
    display: "flex",
    flexDirection: "column",
    padding: isCover ? "10%" : "8%",
    boxSizing: "border-box",
  };

  if (isCover) {
    return (
      <div style={coverStyle}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 48, height: 3, background: "rgba(255,255,255,0.6)", marginBottom: 24, borderRadius: 2 }} />
          <h1 style={{ fontFamily: s.headerFont, color: "#ffffff", fontSize: "clamp(18px, 5vw, 32px)", lineHeight: 1.2, margin: "0 0 16px", fontWeight: 900 }}>{page.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(10px, 2.5vw, 14px)", lineHeight: 1.6, margin: "0 0 32px" }}>{page.subtitle}</p>
          {page.scripture && (
            <div style={{ borderLeft: "3px solid rgba(255,255,255,0.5)", paddingLeft: 16, marginTop: 8 }}>
              <p style={{ color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontSize: "clamp(9px, 2vw, 12px)", margin: 0, fontFamily: s.headerFont }}>{page.scripture}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(8px, 1.8vw, 11px)", margin: "4px 0 0" }}>{page.reference}</p>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(7px, 1.5vw, 10px)", margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>Youth Ministry</p>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>✦</span>
        </div>
      </div>
    );
  }

  const accentColor = isColor ? s.pageAccent : "#555";
  const accent2 = isColor ? s.pageAccent2 : "#888";

  return (
    <div style={coverStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6%", paddingBottom: "4%", borderBottom: `2px solid ${accentColor}` }}>
        <div>
          <p style={{ color: accent2, fontSize: "clamp(7px, 1.5vw, 9px)", textTransform: "uppercase", letterSpacing: 2, margin: "0 0 2px", fontWeight: 600 }}>{page.section || "Reflection"}</p>
          <h2 style={{ fontFamily: s.headerFont, color: "#111", fontSize: "clamp(12px, 3vw, 20px)", margin: 0, fontWeight: 900 }}>{page.title}</h2>
        </div>
        <div style={{ width: "clamp(20px, 5vw, 32px)", height: "clamp(20px, 5vw, 32px)", borderRadius: "50%", background: isColor ? `linear-gradient(135deg, ${accentColor}, ${accent2})` : "#ccc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "white", fontSize: "clamp(8px, 2vw, 13px)" }}>{index}</span>
        </div>
      </div>

      {page.scripture && (
        <div style={{ background: isColor ? `${accentColor}12` : "#f5f5f5", borderRadius: 6, padding: "clamp(8px, 2%, 14px)", marginBottom: "5%", borderLeft: `3px solid ${accentColor}` }}>
          <p style={{ fontFamily: s.headerFont, fontStyle: "italic", fontSize: "clamp(8px, 2vw, 12px)", color: "#333", margin: "0 0 4px", lineHeight: 1.5 }}>"{page.scripture}"</p>
          <p style={{ fontSize: "clamp(7px, 1.5vw, 10px)", color: accent2, margin: 0, fontWeight: 600 }}>— {page.reference}</p>
        </div>
      )}

      {page.intro && (
        <p style={{ fontSize: "clamp(8px, 1.8vw, 11px)", color: "#444", lineHeight: 1.6, margin: "0 0 5%" }}>{page.intro}</p>
      )}

      {page.questions && page.questions.map((q, qi) => (
        <div key={qi} style={{ marginBottom: "4%" }}>
          <p style={{ fontSize: "clamp(7px, 1.6vw, 10px)", fontWeight: 600, color: isColor ? accentColor : "#333", margin: "0 0 4px" }}>{qi + 1}. {q}</p>
          <div style={{ borderBottom: `1px solid ${accentColor}40`, height: "clamp(10px, 2.5vw, 18px)", marginBottom: 2 }} />
          <div style={{ borderBottom: `1px solid ${accentColor}25`, height: "clamp(10px, 2.5vw, 18px)", marginBottom: 2 }} />
        </div>
      ))}

      {page.closingPrompt && (
        <div style={{ marginTop: "auto", paddingTop: "4%", borderTop: `1px dashed ${accent2}60` }}>
          <p style={{ fontSize: "clamp(7px, 1.5vw, 9px)", color: accent2, fontStyle: "italic", margin: 0, textAlign: "center" }}>{page.closingPrompt}</p>
        </div>
      )}
    </div>
  );
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
    outputFormat: "PDF",
    extras: "",
  });
  const [loading, setLoading] = useState(false);
  const [workbook, setWorkbook] = useState(null);
  const [error, setError] = useState(null);

  const s = VIBES_STYLES[form.vibe];
  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const generateWorkbook = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageCountForContent = form.pageCount - (form.hasCover ? 1 : 0);
      const prompt = `You are a creative youth ministry curriculum designer. Generate a complete workbook for youth ministry.

Workbook Details:
- Title: "${form.title || "Untitled Workbook"}"
- Topic/Theme: "${form.topic}"
- Audience: ${form.audience}
- Style/Vibe: ${form.vibe} (${VIBES.find((v) => v.id === form.vibe)?.desc})
- Total content pages: ${pageCountForContent}
- Color: ${form.isColor ? "Full color" : "Black & white"}
- Extra instructions: ${form.extras || "none"}

Return ONLY valid JSON (no markdown, no backticks) in this exact shape:
{
  "workbookTitle": "string",
  "subtitle": "string",
  "coverScripture": "string (verse text)",
  "coverReference": "string (e.g. John 3:16)",
  "pages": [
    {
      "type": "content",
      "title": "string",
      "section": "string (short label like 'Week 1' or 'Day 2')",
      "scripture": "string (relevant verse text)",
      "reference": "string",
      "intro": "string (2-3 sentences setting up this page)",
      "questions": ["string", "string", "string"],
      "closingPrompt": "string (short encouraging closing line)"
    }
  ]
}

Generate exactly ${pageCountForContent} page objects. Make content age-appropriate, engaging, and Scripture-grounded.`;

      // Call our secure Next.js API proxy instead of Anthropic directly
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API error");
      }

      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const pages = [];
      if (form.hasCover) {
        pages.push({
          type: "cover",
          title: parsed.workbookTitle,
          subtitle: parsed.subtitle,
          scripture: parsed.coverScripture,
          reference: parsed.coverReference,
        });
      }
      parsed.pages.forEach((p) => pages.push({ ...p, type: "content" }));

      setWorkbook({ ...parsed, pages, form: { ...form } });
      setStep(3);
    } catch (e) {
      console.error(e);
      setError("Something went wrong generating the workbook. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${s.accent}50`,
    background: "rgba(255,255,255,0.07)",
    color: s.text,
    fontFamily: "DM Sans, sans-serif",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "DM Sans, sans-serif",
    fontSize: 12,
    fontWeight: 600,
    color: s.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    display: "block",
  };

  const btnPrimary = {
    background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})`,
    color: form.vibe === "minimal" ? "#111" : "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.5,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .page-card { animation: fadeUp 0.4s ease forwards; }
        @media print {
          .no-print { display: none !important; }
          .print-pages { display: block !important; }
          .workbook-page { page-break-after: always; width: 100%; margin: 0; padding: 40px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: s.bg, transition: "background 0.5s ease" }}>

        {/* Header */}
        <div className="no-print" style={{ padding: "24px 32px", borderBottom: `1px solid ${s.accent}30`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>📖</span>
          </div>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", color: s.text, fontSize: 20, fontWeight: 900 }}>Workbook Generator</h1>
            <p style={{ fontFamily: "DM Sans, sans-serif", color: s.subtext, fontSize: 12 }}>Youth Ministry Edition</p>
          </div>
          {workbook && (
            <button className="no-print" onClick={() => { setWorkbook(null); setStep(1); }} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${s.accent}50`, color: s.subtext, borderRadius: 6, padding: "6px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 12, cursor: "pointer" }}>
              ← New Workbook
            </button>
          )}
        </div>

        {/* Steps */}
        {!workbook && (
          <div className="no-print" style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 0 0" }}>
            {["Setup", "Specs", "Preview"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? `linear-gradient(135deg, ${s.accent}, ${s.accent2})` : step === i + 1 ? `${s.accent}30` : "transparent", border: `2px solid ${step >= i + 1 ? s.accent : s.accent + "30"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: step >= i + 1 ? s.text : s.subtext }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: step === i + 1 ? s.text : s.subtext }}>{label}</span>
                {i < 2 && <div style={{ width: 24, height: 1, background: `${s.accent}30` }} />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="no-print page-card" style={{ maxWidth: 600, margin: "32px auto", padding: "0 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, border: `1px solid ${s.accent}25` }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", color: s.text, fontSize: 22, marginBottom: 8 }}>Tell me about your workbook</h2>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: s.subtext, fontSize: 13, marginBottom: 28 }}>Start with the basics — what are we creating?</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Workbook Title</label>
                  <input style={inputStyle} placeholder="e.g. Identity in Christ, Walking in Purpose..." value={form.title} onChange={(e) => update("title", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Topic / Theme</label>
                  <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Describe the theme, focus, series, or spiritual goal of this workbook..." value={form.topic} onChange={(e) => update("topic", e.target.value)} />
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
                      <div key={v.id} onClick={() => update("vibe", v.id)} style={{ padding: "12px 16px", borderRadius: 8, border: `2px solid ${form.vibe === v.id ? s.accent : s.accent + "30"}`, background: form.vibe === v.id ? `${s.accent}20` : "transparent", cursor: "pointer", display: "flex", gap: 10, alignItems: "center", transition: "all 0.2s" }}>
                        <span style={{ fontSize: 18 }}>{v.label.split(" ")[0]}</span>
                        <div>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, color: s.text, margin: 0 }}>{v.label.split(" ").slice(1).join(" ")}</p>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: s.subtext, margin: 0 }}>{v.desc}</p>
                        </div>
                        {form.vibe === v.id && <span style={{ marginLeft: "auto", color: s.accent, fontSize: 16 }}>✓</span>}
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
          <div className="no-print page-card" style={{ maxWidth: 600, margin: "32px auto", padding: "0 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, border: `1px solid ${s.accent}25` }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", color: s.text, fontSize: 22, marginBottom: 8 }}>Set your specs</h2>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: s.subtext, fontSize: 13, marginBottom: 28 }}>Format, size, and output details</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Number of Pages (including cover if selected)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input type="range" min={3} max={20} value={form.pageCount} onChange={(e) => update("pageCount", Number(e.target.value))} style={{ flex: 1, accentColor: s.accent }} />
                    <div style={{ width: 48, textAlign: "center", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 20, color: s.accent }}>{form.pageCount}</div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Page Size</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {PAGE_SIZES.map((ps) => (
                      <div key={ps} onClick={() => update("pageSize", ps)} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${form.pageSize === ps ? s.accent : s.accent + "30"}`, background: form.pageSize === ps ? `${s.accent}20` : "transparent", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.pageSize === ps ? s.text : s.subtext, fontWeight: form.pageSize === ps ? 600 : 400 }}>
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
                        <div key={String(val)} onClick={() => update("isColor", val)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${form.isColor === val ? s.accent : s.accent + "30"}`, background: form.isColor === val ? `${s.accent}20` : "transparent", cursor: "pointer", textAlign: "center", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.isColor === val ? s.text : s.subtext, fontWeight: form.isColor === val ? 600 : 400 }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Cover Page</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["✅ Yes", true], ["❌ No", false]].map(([label, val]) => (
                        <div key={String(val)} onClick={() => update("hasCover", val)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${form.hasCover === val ? s.accent : s.accent + "30"}`, background: form.hasCover === val ? `${s.accent}20` : "transparent", cursor: "pointer", textAlign: "center", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.hasCover === val ? s.text : s.subtext, fontWeight: form.hasCover === val ? 600 : 400 }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Output Format</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {OUTPUT_FORMATS.map((f) => (
                      <div key={f} onClick={() => update("outputFormat", f)} style={{ padding: "10px", borderRadius: 8, border: `2px solid ${form.outputFormat === f ? s.accent : s.accent + "30"}`, background: form.outputFormat === f ? `${s.accent}20` : "transparent", cursor: "pointer", textAlign: "center", fontFamily: "DM Sans, sans-serif", fontSize: 12, color: form.outputFormat === f ? s.text : s.subtext, fontWeight: form.outputFormat === f ? 600 : 400 }}>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Anything else? (optional)</label>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="e.g. Include a prayer prompt on each page, add a memory verse activity..." value={form.extras} onChange={(e) => update("extras", e.target.value)} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ ...btnPrimary, background: "transparent", border: `1px solid ${s.accent}50`, color: s.text, flex: "0 0 auto" }} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...btnPrimary, flex: 1 }} onClick={generateWorkbook} disabled={!form.topic || loading}>
                    {loading ? "Generating..." : "✨ Generate Workbook"}
                  </button>
                </div>

                {error && (
                  <div style={{ background: "#ff444420", border: "1px solid #ff4444", borderRadius: 8, padding: 12, color: "#ff8888", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
                    {error}
                  </div>
                )}

                {loading && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.15)", borderTopColor: s.accent, animation: "spin 0.9s linear infinite" }} />
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: s.subtext, fontSize: 13 }}>Building your workbook...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Preview */}
        {workbook && !loading && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "20px 24px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", color: s.subtext, fontSize: 13 }}>
                📄 {workbook.pages.length} pages · {form.pageSize} · {form.isColor ? "Full Color" : "B&W"}
              </span>
              <button style={btnPrimary} onClick={() => window.print()}>
                🖨️ Print / Save as PDF
              </button>
            </div>

            <div className="no-print" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {workbook.pages.map((page, i) => (
                <div key={i} className="page-card" style={{ animationDelay: `${i * 0.07}s` }}>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: s.subtext, textAlign: "center", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                    {page.type === "cover" ? "Cover" : `Page ${i + (form.hasCover ? 0 : 1)}`}
                  </p>
                  <PagePreview page={page} vibe={form.vibe} index={i + (form.hasCover ? 0 : 1)} isColor={form.isColor} />
                </div>
              ))}
            </div>

            <div className="print-pages" style={{ display: "none" }}>
              {workbook.pages.map((page, i) => (
                <div key={i} className="workbook-page">
                  <PagePreview page={page} vibe={form.vibe} index={i + (form.hasCover ? 0 : 1)} isColor={form.isColor} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
