import { useState, useCallback, useRef } from "react";
import { AI_PATTERNS, SAMPLE_TEXT } from "./patterns";
import { analyzeText, getPatternCounts, getAIScore } from "./analyze";
import { humanize } from "./api";

/* ------------------------------------------------------------------ */
/*  Small presentational components                                    */
/* ------------------------------------------------------------------ */

function HighlightedText({ text, matches }) {
  if (!matches.length) return <span>{text}</span>;
  const parts = [];
  let lastIndex = 0;
  matches.forEach((m, i) => {
    if (m.start > lastIndex)
      parts.push(<span key={`t-${i}`}>{text.slice(lastIndex, m.start)}</span>);
    parts.push(
      <span
        key={`m-${i}`}
        style={{
          backgroundColor: m.pattern.color + "25",
          borderBottom: `2px solid ${m.pattern.color}`,
          borderRadius: "2px",
          padding: "0 1px",
          cursor: "default",
        }}
        title={`${m.pattern.label}: "${m.text}"`}
      >
        {text.slice(m.start, m.end)}
      </span>
    );
    lastIndex = m.end;
  });
  if (lastIndex < text.length)
    parts.push(<span key="end">{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

function ScoreGauge({ score }) {
  const color =
    score < 25 ? "#22c55e" : score < 50 ? "#eab308" : score < 75 ? "#f97316" : "#ef4444";
  const label =
    score < 25
      ? "Probably human"
      : score < 50
      ? "Some AI patterns"
      : score < 75
      ? "Likely AI-written"
      : "Almost certainly AI";
  const C = 2 * Math.PI * 54;
  const offset = C - (score / 100) * C;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a2e" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease" }}
        />
        <text x="70" y="62" textAnchor="middle" fill={color} fontSize="32" fontWeight="700"
          fontFamily="'JetBrains Mono', monospace">{score}</text>
        <text x="70" y="82" textAnchor="middle" fill="#8892a4" fontSize="11"
          fontFamily="'DM Sans', sans-serif">/ 100</text>
      </svg>
      <div style={{ color, fontSize: "13px", fontWeight: 600, marginTop: "4px",
        fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [inputText, setInputText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState("analyze");
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const textareaRef = useRef(null);

  const matches = analyzeText(inputText);
  const patternCounts = getPatternCounts(matches);
  const aiScore = getAIScore(inputText, matches);
  const activePatterns = AI_PATTERNS.filter((p) => patternCounts[p.id]);
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const loadSample = useCallback(() => {
    setInputText(SAMPLE_TEXT);
    setHumanizedText("");
    setStreamText("");
    setActiveView("analyze");
  }, []);

  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) return;
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      return;
    }
    setIsProcessing(true);
    setError("");
    setStreamText("");
    setActiveView("result");

    try {
      const result = await humanize(inputText, apiKey);
      setHumanizedText(result);
      // Typewriter effect
      for (let i = 0; i <= result.length; i++) {
        await new Promise((r) => setTimeout(r, 8));
        setStreamText(result.slice(0, i));
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Check your API key and try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, apiKey]);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#c8cfd8",
      fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #6c5ce755; }
        textarea::placeholder { color: #4a5068; }
        textarea:focus { outline: none; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .btn-primary:hover { background: #7c6cf0 !important; }
        .btn-ghost:hover { background: #1a1a2e !important; }
        .pattern-chip { transition: all 0.2s ease; }
        .pattern-chip:hover { transform: translateY(-1px); filter: brightness(1.2); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 700,
            color: "#eee", letterSpacing: "-0.5px" }}>
            <span style={{ color: "#6c5ce7" }}>◆</span> Humanizer
          </h1>
          <p style={{ fontSize: "13px", color: "#5a6377", marginTop: "4px" }}>
            Detect AI writing patterns. Rewrite with soul.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="btn-ghost" onClick={loadSample} style={{
            background: "transparent", border: "1px solid #252540", color: "#8892a4",
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif" }}>
            Load sample
          </button>
          <button className="btn-primary" onClick={handleHumanize}
            disabled={!inputText.trim() || isProcessing}
            style={{
              background: isProcessing ? "#3d3666" : "#6c5ce7", border: "none",
              color: "#fff", padding: "8px 20px", borderRadius: "8px", fontSize: "13px",
              fontWeight: 600, cursor: inputText.trim() && !isProcessing ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif", opacity: !inputText.trim() ? 0.4 : 1,
              transition: "all 0.2s ease" }}>
            {isProcessing ? "Rewriting..." : "Humanize"}
          </button>
        </div>
      </div>

      {/* API key prompt */}
      {showKeyInput && !apiKey.trim() && (
        <div style={{ padding: "16px 32px", background: "#12122a",
          borderBottom: "1px solid #1a1a2e", display: "flex", gap: "12px",
          alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: "13px", color: "#8892a4", whiteSpace: "nowrap" }}>
            Anthropic API key:
          </label>
          <input type="password" placeholder="sk-ant-..."
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              flex: 1, minWidth: "200px", background: "#0d0d1a",
              border: "1px solid #252540", borderRadius: "6px",
              padding: "8px 12px", color: "#c8cfd8", fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              outline: "none",
            }}
          />
          <span style={{ fontSize: "11px", color: "#5a6377" }}>
            Your key stays in your browser. Nothing is stored.
          </span>
        </div>
      )}

      {/* Main panels */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 85px)", flexWrap: "wrap" }}>
        {/* Left: input */}
        <div style={{ flex: "1 1 50%", minWidth: "320px",
          borderRight: "1px solid #1a1a2e", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 24px", borderBottom: "1px solid #1a1a2e",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: "12px", color: "#5a6377" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "10px" }}>
              Input
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {wordCount} words · {matches.length} patterns
            </span>
          </div>
          <textarea ref={textareaRef} value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setHumanizedText(""); setStreamText("");
              if (activeView === "result") setActiveView("analyze");
            }}
            placeholder="Paste AI-generated text here..."
            style={{ flex: 1, background: "transparent", border: "none",
              color: "#c8cfd8", fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px", lineHeight: 1.7, padding: "20px 24px",
              resize: "none", minHeight: "300px" }}
          />
        </div>

        {/* Right: analysis / result */}
        <div style={{ flex: "1 1 50%", minWidth: "320px",
          display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 24px", borderBottom: "1px solid #1a1a2e",
            display: "flex", alignItems: "stretch" }}>
            {["analyze", "result"].map((tab) => (
              <button key={tab} onClick={() => setActiveView(tab)}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: activeView === tab ? "2px solid #6c5ce7" : "2px solid transparent",
                  color: activeView === tab ? "#eee" : "#5a6377",
                  padding: "12px 16px", fontSize: "12px", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase", letterSpacing: "1.5px",
                  transition: "all 0.2s ease" }}>
                {tab === "analyze" ? "Analysis" : "Rewritten"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
            {activeView === "analyze" ? (
              <div className="fade-in">
                {!inputText.trim() ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#3a4058" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>◆</div>
                    <p style={{ fontSize: "14px" }}>Paste some text or load the sample to begin</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center",
                      marginBottom: "28px", flexWrap: "wrap" }}>
                      <ScoreGauge score={aiScore} />
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ fontSize: "12px", color: "#5a6377", marginBottom: "10px",
                          fontFamily: "'JetBrains Mono', monospace",
                          textTransform: "uppercase", letterSpacing: "1px" }}>
                          Detected patterns
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {activePatterns.length === 0 && (
                            <span style={{ color: "#22c55e", fontSize: "13px" }}>
                              No AI patterns detected
                            </span>
                          )}
                          {activePatterns.map((p) => (
                            <span key={p.id} className="pattern-chip" title={p.description}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                background: p.color + "18", border: `1px solid ${p.color}40`,
                                borderRadius: "6px", padding: "4px 10px", fontSize: "12px",
                                color: p.color, fontWeight: 500 }}>
                              <span style={{ background: p.color, width: "6px", height: "6px",
                                borderRadius: "50%", display: "inline-block" }} />
                              {p.label}
                              <span style={{ opacity: 0.7,
                                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                                x{patternCounts[p.id]}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: "#5a6377", marginBottom: "10px",
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: "uppercase", letterSpacing: "1px" }}>
                      Highlighted text
                    </div>
                    <div style={{ background: "#0a0a16", border: "1px solid #1a1a2e",
                      borderRadius: "10px", padding: "20px", fontSize: "14px",
                      lineHeight: 1.8, whiteSpace: "pre-wrap",
                      maxHeight: "400px", overflow: "auto" }}>
                      <HighlightedText text={inputText} matches={matches} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="fade-in">
                {isProcessing ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ animation: "pulse 1.5s ease infinite",
                      fontSize: "14px", color: "#6c5ce7" }}>
                      Removing the AI fingerprint...
                    </div>
                  </div>
                ) : error ? (
                  <div style={{ background: "#1a0a0a", border: "1px solid #3d1515",
                    borderRadius: "10px", padding: "20px", color: "#ef4444", fontSize: "14px" }}>
                    {error}
                  </div>
                ) : streamText ? (
                  <>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "20px",
                      flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "120px", background: "#1a0a0a",
                        border: "1px solid #3d1515", borderRadius: "8px",
                        padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: "11px", color: "#ef4444",
                          fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>
                          BEFORE
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#ef4444",
                          fontFamily: "'JetBrains Mono', monospace" }}>{aiScore}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: "120px", background: "#0a1a0a",
                        border: "1px solid #153d15", borderRadius: "8px",
                        padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: "11px", color: "#22c55e",
                          fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>
                          AFTER
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#22c55e",
                          fontFamily: "'JetBrains Mono', monospace" }}>
                          {getAIScore(humanizedText, analyzeText(humanizedText))}
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "#0a0a16", border: "1px solid #1a1a2e",
                      borderRadius: "10px", padding: "20px", fontSize: "14px",
                      lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {streamText}
                      {isProcessing && (
                        <span style={{ animation: "pulse 0.8s ease infinite",
                          color: "#6c5ce7" }}>|</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#3a4058" }}>
                    <p style={{ fontSize: "14px" }}>
                      Click "Humanize" to rewrite your text
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
