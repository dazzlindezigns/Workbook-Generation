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
  bold: "bold vibrant youth ministry style, bright electric colors, energetic",
  faith: "reverent elegant Christian ministry style, gold and navy tones, graceful",
  minimal: "clean modern minimalist style, simple elegant lines, refined",
  warm: "warm organic earthy style, soft textures, natural and grounded",
  illustrated: "whimsical hand-drawn illustrated style, playful like a children's activity book",
};

const VIBE_COLORS = {
  bold:       { primary: "#ff6b35", secondary: "#6c63ff", text: "#111", light: "#fff8f5" },
  faith:      { primary: "#2c5282", secondary: "#c9a84c", text: "#1a1a2e", light: "#fdfaf4" },
  minimal:    { primary: "#111111", secondary: "#888888", text: "#111", light: "#ffffff" },
  warm:       { primary: "#8b4513", secondary: "#e8a87c", text: "#2d1b0e", light: "#fdf6ec" },
  illustrated:{ primary: "#ff6b6b", secondary: "#48dbfb", text: "#1a1a2e", light: "#fffef5" },
};

function buildBgPrompt(page, vibe, isColor) {
  const style = STYLE_MAP[vibe] || STYLE_MAP.illustrated;
  const colorNote = !isColor ? "black and white line art only, no color fills" : "full color";
  const noText = "CRITICAL: Do NOT include any text, words, letters, numbers, or writing anywhere in the image. Pure illustration only.";

  switch (page.activityType) {
    case "cover":
      return `Create a stunning ${colorNote} decorative illustrated cover art background for a youth ministry workbook in ${style}. Include elaborate decorative border with faith elements (crosses, doves, stars, rays of light, clouds, flowers), a large blank empty central area (40% of image) where text will be overlaid, beautiful illustrated corner decorations, bottom footer area with ministry-themed illustrations. ${noText} Make it look like premium printed ministry workbook cover art.`;
    case "reflection":
      return `Create a beautiful ${colorNote} decorative page background for a youth ministry workbook in ${style}. Include ornate illustrated border around the entire page edges, a decorated top banner area blank inside for title text overlay, a decorative illustrated scroll shape in the upper third blank inside for scripture, small faith-themed illustrated icons scattered tastefully (stars, crosses, hearts, flowers), blank lined areas suggested by subtle decorative rules, bottom decorative footer illustration. ${noText} The center must be mostly open and light for text overlay.`;
    case "wordsearch":
      return `Create a ${colorNote} decorative border illustration for a youth ministry activity page in ${style}. Include fun illustrated frame around the entire page edges, decorated top area blank inside for title, small faith-themed illustrated icons in corners and margins (stars, crosses, sparkles, doves), bottom decorative illustration strip. The large CENTER of the page must be completely blank and white. ${noText}`;
    case "drawit":
      return `Create a ${colorNote} decorative illustration for a youth ministry draw-it activity page in ${style}. Include whimsical illustrated border around page edges, decorated top banner area blank inside for title, a large ornate decorative EMPTY FRAME in the center-bottom 60% of page where kids will draw, illustrated crayons pencils flowers stars around the frame, sparkles and hearts. ${noText} The drawing frame must be completely empty inside.`;
    case "coloring":
      return `Create a ${colorNote} coloring page illustration for youth ministry in whimsical hand-drawn style. Include a large detailed scene filling most of the page featuring faith-themed elements (children praying, church, cross, doves, flowers, nature, stars, clouds), decorative border around the edges, clean bold outlines suitable for coloring, a blank banner at the top for title overlay. ${noText} Make lines clear and bold for easy coloring.`;
    default:
      return `Create a beautiful ${colorNote} decorative page background in ${style}. Ornate illustrated border, blank top banner, open center, decorative footer. ${noText}`;
  }
}

function generateWordSearch(words) {
  const size = 12;
  const grid = Array(size).fill(null).map(() => Array(size).fill(""));
  const placed = [];
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  const clean = words.map(w => w.toUpperCase().replace(/[^A-Z]/g,"")).filter(w => w.length >= 3 && w.length <= 10);
  for (const word of clean) {
    let ok = false;
    for (let t = 0; t < 60 && !ok; t++) {
      const [dr,dc] = dirs[Math.floor(Math.random()*dirs.length)];
      const r = Math.floor(Math.random()*size), c = Math.floor(Math.random()*size);
      const er = r+dr*(word.length-1), ec = c+dc*(word.length-1);
      if (er<0||er>=size||ec<0||ec>=size) continue;
      let can = true;
      for (let i=0;i<word.length;i++) { const rr=r+dr*i,cc=c+dc*i; if(grid[rr][cc]&&grid[rr][cc]!==word[i]){can=false;break;} }
      if (can) { for(let i=0;i<word.length;i++) grid[r+dr*i][c+dc*i]=word[i]; placed.push(word); ok=true; }
    }
  }
  const abc="ABCDEFGHIJKLMNOPRSTWY";
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(!grid[r][c]) grid[r][c]=abc[Math.floor(Math.random()*abc.length)];
  return { grid, words: placed };
}

function PageContent({ page, vibe, index }) {
  const vc = VIBE_COLORS[vibe] || VIBE_COLORS.faith;

  if (page.activityType === "cover") {
    return (
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"15% 12% 20%",textAlign:"center" }}>
        <div style={{ width:44,height:3,background:vc.secondary,borderRadius:2,marginBottom:14 }} />
        <h1 style={{ fontFamily:"Playfair Display, serif",fontSize:"clamp(18px,5.5vw,36px)",fontWeight:900,color:vc.text,lineHeight:1.15,margin:"0 0 10px",textShadow:"0 2px 10px rgba(255,255,255,0.9)" }}>{page.title}</h1>
        {page.subtitle && <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(9px,2.2vw,13px)",color:vc.text,opacity:0.8,margin:"0 0 18px",lineHeight:1.5 }}>{page.subtitle}</p>}
        {page.scripture && (
          <div style={{ background:"rgba(255,255,255,0.75)",borderRadius:8,padding:"8px 14px",maxWidth:"82%",backdropFilter:"blur(4px)" }}>
            <p style={{ fontFamily:"Playfair Display, serif",fontStyle:"italic",fontSize:"clamp(7px,1.8vw,11px)",color:vc.primary,margin:"0 0 3px",lineHeight:1.5 }}>"{page.scripture}"</p>
            <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.3vw,9px)",color:vc.secondary,margin:0,fontWeight:700 }}>— {page.reference}</p>
          </div>
        )}
        <p style={{ position:"absolute",bottom:"8%",fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.3vw,9px)",color:vc.text,opacity:0.45,textTransform:"uppercase",letterSpacing:3 }}>Youth Ministry</p>
      </div>
    );
  }

  if (page.activityType === "coloring") {
    return (
      <div style={{ position:"absolute",top:"3%",left:"6%",right:"6%",display:"flex",justifyContent:"center" }}>
        <div style={{ background:"rgba(255,255,255,0.88)",borderRadius:7,padding:"4px 18px",backdropFilter:"blur(4px)" }}>
          <h2 style={{ fontFamily:"Playfair Display, serif",fontSize:"clamp(11px,2.8vw,18px)",fontWeight:900,color:vc.primary,margin:0,textAlign:"center" }}>{page.title}</h2>
        </div>
      </div>
    );
  }

  if (page.activityType === "wordsearch") {
    const wordList = page.wordList || ["JESUS","FAITH","GRACE","LOVE","HOPE","PRAY","BIBLE","HOLY","SPIRIT","TRUTH","GLORY","PEACE"];
    const { grid, words: placed } = generateWordSearch(wordList);
    return (
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",padding:"3% 5% 3%" }}>
        <div style={{ background:"rgba(255,255,255,0.9)",borderRadius:7,padding:"4px 14px",alignSelf:"center",marginBottom:"2%",backdropFilter:"blur(4px)" }}>
          <h2 style={{ fontFamily:"Playfair Display, serif",fontSize:"clamp(10px,2.5vw,17px)",fontWeight:900,color:vc.primary,margin:0 }}>{page.title}</h2>
        </div>
        <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.4vw,9px)",color:vc.text,textAlign:"center",margin:"0 0 2%",background:"rgba(255,255,255,0.75)",borderRadius:4,padding:"2px 8px",alignSelf:"center" }}>Circle the words you hear!</p>
        <div style={{ background:"rgba(255,255,255,0.9)",borderRadius:8,padding:"7px",flex:1,display:"flex",flexDirection:"column",backdropFilter:"blur(4px)" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:1,flex:1 }}>
            {grid.flat().map((l,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono, monospace",fontSize:"clamp(6px,1.3vw,9px)",fontWeight:700,color:vc.text,aspectRatio:"1",border:`0.5px solid ${vc.primary}20` }}>{l}</div>
            ))}
          </div>
          <div style={{ marginTop:5,paddingTop:5,borderTop:`1px solid ${vc.primary}25`,display:"flex",flexWrap:"wrap",gap:"2px 8px",justifyContent:"center" }}>
            {placed.map((w,i) => <span key={i} style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(5px,1.1vw,8px)",fontWeight:700,color:vc.primary,textTransform:"uppercase",letterSpacing:0.5 }}>{w}</span>)}
          </div>
        </div>
      </div>
    );
  }

  if (page.activityType === "drawit") {
    return (
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",padding:"3% 6%",alignItems:"center" }}>
        <div style={{ background:"rgba(255,255,255,0.9)",borderRadius:7,padding:"4px 16px",marginBottom:"2%",backdropFilter:"blur(4px)" }}>
          <h2 style={{ fontFamily:"Playfair Display, serif",fontSize:"clamp(10px,2.5vw,17px)",fontWeight:900,color:vc.primary,margin:0,textAlign:"center" }}>{page.title}</h2>
        </div>
        {page.drawPrompt && (
          <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.5vw,10px)",color:vc.text,textAlign:"center",background:"rgba(255,255,255,0.8)",borderRadius:4,padding:"3px 10px" }}>{page.drawPrompt}</p>
        )}
      </div>
    );
  }

  // Reflection
  return (
    <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",padding:"4% 7% 5%" }}>
      <div style={{ background:"rgba(255,255,255,0.9)",borderRadius:7,padding:"4px 14px",alignSelf:"flex-start",marginBottom:"3%",backdropFilter:"blur(4px)" }}>
        <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(5px,1.1vw,8px)",fontWeight:700,color:vc.secondary,textTransform:"uppercase",letterSpacing:2,margin:"0 0 1px" }}>{page.section||`Page ${index}`}</p>
        <h2 style={{ fontFamily:"Playfair Display, serif",fontSize:"clamp(10px,2.5vw,17px)",fontWeight:900,color:vc.primary,margin:0 }}>{page.title}</h2>
      </div>
      {page.scripture && (
        <div style={{ background:"rgba(255,255,255,0.85)",borderRadius:7,padding:"7px 11px",marginBottom:"3%",borderLeft:`3px solid ${vc.secondary}`,backdropFilter:"blur(4px)" }}>
          <p style={{ fontFamily:"Playfair Display, serif",fontStyle:"italic",fontSize:"clamp(6px,1.6vw,10px)",color:vc.text,margin:"0 0 3px",lineHeight:1.5 }}>"{page.scripture}"</p>
          <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(5px,1.2vw,8px)",color:vc.secondary,margin:0,fontWeight:700 }}>— {page.reference}</p>
        </div>
      )}
      {page.intro && (
        <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.5vw,9px)",color:vc.text,lineHeight:1.6,margin:"0 0 3%",background:"rgba(255,255,255,0.78)",borderRadius:6,padding:"5px 9px" }}>{page.intro}</p>
      )}
      <div style={{ flex:1,display:"flex",flexDirection:"column",gap:"3%" }}>
        {(page.questions||[]).map((q,qi) => (
          <div key={qi} style={{ background:"rgba(255,255,255,0.82)",borderRadius:6,padding:"5px 9px" }}>
            <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(6px,1.4vw,9px)",fontWeight:700,color:vc.primary,margin:"0 0 3px" }}>{qi+1}. {q}</p>
            {[0,1,2].map(li => <div key={li} style={{ borderBottom:`1px solid ${vc.primary}30`,height:"clamp(11px,2.2vw,16px)",marginBottom:2 }} />)}
          </div>
        ))}
      </div>
      {page.closingPrompt && (
        <div style={{ marginTop:"3%",background:"rgba(255,255,255,0.82)",borderRadius:6,padding:"4px 9px",textAlign:"center" }}>
          <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:"clamp(5px,1.2vw,8px)",fontStyle:"italic",color:vc.secondary,margin:0 }}>{page.closingPrompt}</p>
        </div>
      )}
    </div>
  );
}

function WorkbookPage({ page, vibe, index, isColor }) {
  const vc = VIBE_COLORS[vibe] || VIBE_COLORS.faith;
  return (
    <div style={{ width:"100%",aspectRatio:"8.5/11",position:"relative",borderRadius:8,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)",background:vc.light }}>
      {page.imageBase64 && (
        <img src={`data:${page.mimeType||"image/png"};base64,${page.imageBase64}`} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
      )}
      <PageContent page={page} vibe={vibe} index={index} />
    </div>
  );
}

export default function WorkbookGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title:"",topic:"",audience:"Middle School (6-8th grade)",vibe:"faith",pageCount:6,isColor:true,hasCover:true,pageSize:"Letter (8.5×11)",extras:"" });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current:0,total:0,label:"" });
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);
  const update = (k,v) => setForm(f => ({...f,[k]:v}));

  const generateWorkbook = async () => {
    setLoading(true); setError(null); setPages([]);
    try {
      setProgress({ current:0,total:1,label:"Planning your workbook..." });
      const pageCountForContent = form.pageCount - (form.hasCover ? 1 : 0);
      const prompt = `You are a creative youth ministry curriculum designer. Plan a workbook with illustrated pages.
Workbook: Title: "${form.title||"Untitled Workbook"}", Topic: "${form.topic}", Audience: ${form.audience}, Content pages: ${pageCountForContent}, Extra: ${form.extras||"none"}
Return ONLY valid JSON (no markdown):
{"workbookTitle":"string","subtitle":"string","coverScripture":"string","coverReference":"string","pages":[{"title":"string","section":"string","topic":"string","scripture":"string","reference":"string","intro":"string","questions":["string","string","string"],"closingPrompt":"string","activityType":"reflection | coloring | wordsearch | drawit","wordList":["word1","word2"],"drawPrompt":"string"}]}
Rules: Mix activity types. Include at least 1 wordsearch and 1 drawit if page count allows. wordList: 12 simple single faith words for wordsearch pages only. Generate exactly ${pageCountForContent} page objects. Age-appropriate and Scripture-grounded.`;

      const planRes = await fetch("/api/generate",{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ messages:[{role:"user",content:prompt}] }) });
      const planData = await planRes.json();
      if (!planRes.ok) throw new Error(planData.error||"Planning failed");
      const text = planData.content?.map(b=>b.text||"").join("")||"";
      const plan = JSON.parse(text.replace(/```json|```/g,"").trim());

      const allPages = [];
      if (form.hasCover) allPages.push({ title:plan.workbookTitle,subtitle:plan.subtitle,scripture:plan.coverScripture,reference:plan.coverReference,activityType:"cover",topic:form.topic });
      plan.pages.forEach(p => allPages.push(p));

      const total = allPages.length;
      const gen = [];
      for (let i=0; i<allPages.length; i++) {
        const page = allPages[i];
        setProgress({ current:i+1,total,label:`Illustrating: "${page.title}" (${i+1}/${total})` });
        const imgRes = await fetch("/api/imagine",{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ prompt:buildBgPrompt(page,form.vibe,form.isColor) }) });
        const imgData = await imgRes.json();
        gen.push({...page,imageBase64:imgData.imageBase64||null,mimeType:imgData.mimeType||"image/png"});
        setPages([...gen]);
      }
      setStep(3);
    } catch(e) { console.error(e); setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const C = { bg:"linear-gradient(135deg, #1c2b4a 0%, #0f1d30 100%)",accent:"#c9a84c",accent2:"#e8d5a3",text:"#f5f0e8",subtext:"#c9a84c",border:"rgba(201,168,76,0.25)",card:"rgba(255,255,255,0.05)" };
  const inp = { width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.07)",color:C.text,fontFamily:"DM Sans, sans-serif",fontSize:14,outline:"none",boxSizing:"border-box" };
  const lbl = { fontFamily:"DM Sans, sans-serif",fontSize:11,fontWeight:700,color:C.subtext,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,display:"block" };
  const btn = { background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,color:"#1c2b4a",border:"none",borderRadius:8,padding:"12px 28px",fontFamily:"DM Sans, sans-serif",fontSize:15,fontWeight:700,cursor:"pointer" };
  const card = { background:C.card,borderRadius:16,padding:32,border:`1px solid ${C.border}` };
  const chip = (a) => ({ padding:"10px 14px",borderRadius:8,border:`2px solid ${a?C.accent:C.accent+"30"}`,background:a?`${C.accent}18`:"transparent",cursor:"pointer",fontFamily:"DM Sans, sans-serif",fontSize:12,color:a?C.text:C.subtext,fontWeight:a?700:400,textAlign:"center" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fadeUp 0.45s ease forwards;}
        @media print{.np{display:none!important;}.pp{page-break-after:always;width:100%;}.pp>div{width:100%!important;aspect-ratio:8.5/11;border-radius:0!important;box-shadow:none!important;}}
      `}</style>
      <div style={{ minHeight:"100vh",background:C.bg }}>
        {/* Header */}
        <div className="np" style={{ padding:"18px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:9,background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📖</div>
          <div>
            <h1 style={{ fontFamily:"Playfair Display, serif",color:C.text,fontSize:19,fontWeight:900 }}>Workbook Generator</h1>
            <p style={{ fontFamily:"DM Sans, sans-serif",color:C.subtext,fontSize:11 }}>Youth Ministry · AI Illustrated · Accurate Text</p>
          </div>
          {step===3 && <button className="np" onClick={()=>{setStep(1);setPages([]);}} style={{ marginLeft:"auto",background:"transparent",border:`1px solid ${C.border}`,color:C.subtext,borderRadius:6,padding:"6px 16px",fontFamily:"DM Sans, sans-serif",fontSize:12,cursor:"pointer" }}>← New Workbook</button>}
        </div>

        {/* Steps */}
        {step<3&&!loading&&(
          <div className="np" style={{ display:"flex",justifyContent:"center",gap:8,padding:"18px 0 0" }}>
            {["Describe","Specs","Generate"].map((label,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:26,height:26,borderRadius:"50%",background:step>i?`linear-gradient(135deg,${C.accent},${C.accent2})`:step===i+1?`${C.accent}30`:"transparent",border:`2px solid ${step>=i+1?C.accent:C.accent+"30"}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontFamily:"DM Sans, sans-serif",fontSize:11,fontWeight:700,color:C.text }}>{i+1}</span>
                </div>
                <span style={{ fontFamily:"DM Sans, sans-serif",fontSize:12,color:step===i+1?C.text:C.subtext }}>{label}</span>
                {i<2&&<div style={{ width:20,height:1,background:`${C.accent}30` }} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step===1&&(
          <div className="np fu" style={{ maxWidth:560,margin:"28px auto",padding:"0 20px" }}>
            <div style={card}>
              <h2 style={{ fontFamily:"Playfair Display, serif",color:C.text,fontSize:21,marginBottom:5 }}>Tell me about your workbook</h2>
              <p style={{ fontFamily:"DM Sans, sans-serif",color:C.subtext,fontSize:12,marginBottom:24 }}>Gemini illustrates backgrounds · Text renders crisp & accurate</p>
              <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
                <div><label style={lbl}>Workbook Title</label><input style={inp} placeholder="e.g. Glory Carrier, Identity in Christ..." value={form.title} onChange={e=>update("title",e.target.value)} /></div>
                <div><label style={lbl}>Topic / Theme</label><textarea style={{...inp,minHeight:85,resize:"vertical"}} placeholder="Describe the spiritual theme or message goal..." value={form.topic} onChange={e=>update("topic",e.target.value)} /></div>
                <div><label style={lbl}>Audience</label>
                  <select style={inp} value={form.audience} onChange={e=>update("audience",e.target.value)}>
                    {["Elementary (3-5th grade)","Middle School (6-8th grade)","High School (9-12th grade)","Young Adults (18-25)","Mixed Youth"].map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Style / Vibe</label>
                  <div style={{ display:"grid",gap:7 }}>
                    {VIBES.map(v=>(
                      <div key={v.id} onClick={()=>update("vibe",v.id)} style={{ padding:"9px 13px",borderRadius:8,border:`2px solid ${form.vibe===v.id?C.accent:C.accent+"30"}`,background:form.vibe===v.id?`${C.accent}18`:"transparent",cursor:"pointer",display:"flex",gap:10,alignItems:"center" }}>
                        <span style={{ fontSize:15 }}>{v.label.split(" ")[0]}</span>
                        <div><p style={{ fontFamily:"DM Sans, sans-serif",fontWeight:600,fontSize:13,color:C.text,margin:0 }}>{v.label.split(" ").slice(1).join(" ")}</p><p style={{ fontFamily:"DM Sans, sans-serif",fontSize:11,color:C.subtext,margin:0 }}>{v.desc}</p></div>
                        {form.vibe===v.id&&<span style={{ marginLeft:"auto",color:C.accent }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <button style={btn} onClick={()=>setStep(2)}>Next: Specs →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step===2&&(
          <div className="np fu" style={{ maxWidth:560,margin:"28px auto",padding:"0 20px" }}>
            <div style={card}>
              <h2 style={{ fontFamily:"Playfair Display, serif",color:C.text,fontSize:21,marginBottom:5 }}>Set your specs</h2>
              <p style={{ fontFamily:"DM Sans, sans-serif",color:C.subtext,fontSize:12,marginBottom:24 }}>Format, size, and style details</p>
              <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
                <div>
                  <label style={lbl}>Number of Pages (including cover if selected)</label>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <input type="range" min={3} max={12} value={form.pageCount} onChange={e=>update("pageCount",Number(e.target.value))} style={{ flex:1,accentColor:C.accent }} />
                    <div style={{ width:38,textAlign:"center",fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:22,color:C.accent }}>{form.pageCount}</div>
                  </div>
                  <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:10,color:C.subtext,marginTop:3 }}>⚡ ~30 sec per page for illustration</p>
                </div>
                <div><label style={lbl}>Page Size</label><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 }}>{PAGE_SIZES.map(ps=><div key={ps} onClick={()=>update("pageSize",ps)} style={chip(form.pageSize===ps)}>{ps}</div>)}</div></div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                  <div><label style={lbl}>Color Mode</label><div style={{ display:"flex",gap:7 }}>{[["🎨 Color",true],["⬛ B&W",false]].map(([l,v])=><div key={String(v)} onClick={()=>update("isColor",v)} style={{...chip(form.isColor===v),flex:1}}>{l}</div>)}</div></div>
                  <div><label style={lbl}>Cover Page</label><div style={{ display:"flex",gap:7 }}>{[["✅ Yes",true],["❌ No",false]].map(([l,v])=><div key={String(v)} onClick={()=>update("hasCover",v)} style={{...chip(form.hasCover===v),flex:1}}>{l}</div>)}</div></div>
                </div>
                <div><label style={lbl}>Anything else? (optional)</label><textarea style={{...inp,minHeight:55,resize:"vertical"}} placeholder="e.g. Include a prayer prompt, specific sermon series..." value={form.extras} onChange={e=>update("extras",e.target.value)} /></div>

                {error&&<div style={{ background:"#ff444420",border:"1px solid #ff4444",borderRadius:8,padding:12,color:"#ff8888",fontFamily:"DM Sans, sans-serif",fontSize:13 }}>{error}</div>}

                {loading&&(
                  <div style={{ background:"rgba(255,255,255,0.05)",borderRadius:12,padding:20,textAlign:"center" }}>
                    <div style={{ width:40,height:40,borderRadius:"50%",border:`3px solid ${C.accent}30`,borderTopColor:C.accent,animation:"spin 0.9s linear infinite",margin:"0 auto 12px" }} />
                    <p style={{ fontFamily:"DM Sans, sans-serif",color:C.text,fontSize:14,fontWeight:600,margin:"0 0 4px" }}>{progress.label}</p>
                    {progress.total>0&&(
                      <>
                        <div style={{ width:"100%",height:5,background:"rgba(255,255,255,0.1)",borderRadius:3,margin:"12px 0 5px",overflow:"hidden" }}>
                          <div style={{ width:`${(progress.current/progress.total)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accent2})`,transition:"width 0.6s ease" }} />
                        </div>
                        <p style={{ fontFamily:"DM Sans, sans-serif",color:C.subtext,fontSize:11 }}>{progress.current} of {progress.total} pages</p>
                      </>
                    )}
                    {pages.length>0&&(
                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginTop:16 }}>
                        {pages.map((p,i)=>(
                          <div key={i} className="fu">
                            <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:8,color:C.subtext,textAlign:"center",marginBottom:3,textTransform:"uppercase",letterSpacing:1 }}>{p.activityType==="cover"?"Cover":`P${i+1}`}</p>
                            <WorkbookPage page={p} vibe={form.vibe} index={i+1} isColor={form.isColor} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display:"flex",gap:8 }}>
                  <button style={{...btn,background:"transparent",border:`1px solid ${C.border}`,color:C.text,flex:"0 0 auto"}} onClick={()=>setStep(1)} disabled={loading}>← Back</button>
                  <button style={{...btn,flex:1,opacity:loading||!form.topic?0.6:1}} onClick={generateWorkbook} disabled={loading||!form.topic}>{loading?"Illustrating...":"✨ Generate & Illustrate"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step===3&&pages.length>0&&(
          <div>
            <div className="np" style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:14,padding:"18px 24px",flexWrap:"wrap" }}>
              <span style={{ fontFamily:"DM Sans, sans-serif",color:C.subtext,fontSize:12 }}>🎨 {pages.length} pages · {form.pageSize} · {form.isColor?"Full Color":"B&W"}</span>
              <button style={btn} onClick={()=>window.print()}>🖨️ Print / Save as PDF</button>
            </div>
            <div className="np" style={{ maxWidth:980,margin:"0 auto",padding:"0 20px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20 }}>
              {pages.map((page,i)=>(
                <div key={i} className="fu" style={{ animationDelay:`${i*0.05}s` }}>
                  <p style={{ fontFamily:"DM Sans, sans-serif",fontSize:9,color:C.subtext,textAlign:"center",marginBottom:5,textTransform:"uppercase",letterSpacing:1 }}>
                    {page.activityType==="cover"?"Cover":`Page ${i+(form.hasCover?0:1)} · ${page.activityType}`}
                  </p>
                  <WorkbookPage page={page} vibe={form.vibe} index={i+(form.hasCover?0:1)} isColor={form.isColor} />
                </div>
              ))}
            </div>
            <div style={{ display:"none" }}>
              {pages.map((page,i)=>(
                <div key={i} className="pp">
                  <WorkbookPage page={page} vibe={form.vibe} index={i+(form.hasCover?0:1)} isColor={form.isColor} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
