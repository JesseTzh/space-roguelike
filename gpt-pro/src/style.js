const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  html, body, #app {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #020817;
    color: #f8fafc;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    touch-action: none;
    overscroll-behavior: none;
  }
  button, input { font: inherit; }
  .game-stage {
    position: fixed;
    inset: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top, #0f172a 0, #020817 58%);
  }
  .game-stage > canvas {
    background: #020817;
    border-left: 1px solid rgba(125, 211, 252, 0.18);
    border-right: 1px solid rgba(125, 211, 252, 0.18);
  }
  .ui-root {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    padding: 20px;
  }
  .ui-root > * { pointer-events: auto; }
  .panel {
    width: min(94vw, 680px);
    max-height: 94vh;
    overflow: auto;
    padding: 24px;
    border: 1px solid rgba(125, 211, 252, 0.38);
    border-radius: 24px;
    background: rgba(2, 8, 23, 0.88);
    box-shadow: 0 20px 80px rgba(0,0,0,0.4), inset 0 0 32px rgba(56, 189, 248, 0.08);
    backdrop-filter: blur(10px);
  }
  .panel h1 { margin: 0 0 12px; font-size: clamp(28px, 6vw, 48px); }
  .panel h2 { margin: 8px 0 12px; font-size: 18px; color: #bae6fd; }
  .panel p { margin: 8px 0; color: #cbd5e1; }
  .panel button {
    border: 1px solid rgba(148, 163, 184, 0.45);
    border-radius: 14px;
    padding: 12px 14px;
    color: #f8fafc;
    background: rgba(15, 23, 42, 0.96);
    cursor: pointer;
  }
  .panel button:disabled { opacity: 0.45; cursor: not-allowed; }
  .panel button.primary {
    border-color: rgba(56, 189, 248, 0.85);
    background: linear-gradient(135deg, rgba(14, 116, 144, 0.95), rgba(30, 64, 175, 0.95));
  }
  .panel button.large { width: 100%; padding: 18px; margin: 18px 0; font-size: 24px; }
  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px 16px;
    margin: 16px 0;
  }
  .menu-panel label { display: block; margin-top: 10px; color: #cbd5e1; }
  .result-grid {
    display: grid;
    grid-template-columns: minmax(160px, 0.9fr) minmax(220px, 1.2fr) minmax(220px, 1fr);
    gap: 16px;
  }
  .modules, .slots { display: grid; gap: 10px; align-content: start; }
  .module-card {
    display: grid;
    grid-template-columns: 58px 1fr;
    gap: 4px 10px;
    text-align: left;
  }
  .module-card img { grid-row: span 3; width: 58px; height: 58px; object-fit: contain; }
  .module-card strong { color: #fff; }
  .module-card span { color: #7dd3fc; font-size: 12px; }
  .module-card p { grid-column: 2; margin: 0; font-size: 13px; }
  .slot { display: grid; grid-template-columns: 44px 1fr; align-items: center; text-align: left; min-height: 54px; }
  .slot.locked { opacity: 0.55; }
  .slot span { color: #7dd3fc; }
  .panel-actions { display: flex; gap: 12px; margin-top: 18px; justify-content: flex-end; flex-wrap: wrap; }
  .pause-panel, .game-result, .menu-panel { text-align: center; }
  @media (max-width: 760px) {
    .ui-root { padding: 10px; }
    .panel { padding: 16px; border-radius: 18px; }
    .result-grid { grid-template-columns: 1fr; }
    .panel-actions { justify-content: stretch; }
    .panel-actions button { flex: 1 1 160px; }
  }
  @media (orientation: landscape) and (max-height: 520px) {
    .game-stage::after {
      content: "建议竖屏游玩";
      position: fixed;
      top: 12px;
      right: 12px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0,0,0,0.62);
      color: #bae6fd;
      pointer-events: none;
    }
  }
`;
document.head.append(style);
export {};
//# sourceMappingURL=style.js.map