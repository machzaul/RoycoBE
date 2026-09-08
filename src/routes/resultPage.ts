import { Router, Request, Response } from 'express';
import { getCardByIdOrSlug, DEFINED_CARDS } from '../lib/cards';

const router = Router();

router.get('/:identifier', (req: Request, res: Response) => {
  const identifier = String(req.params.identifier);
  const card = getCardByIdOrSlug(identifier) || DEFINED_CARDS['1'];

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Love Language Kamu 💕 - Royco x AADC</title>
  <meta property="og:title" content="Love Language Kamu: ${card.title} - Royco x AADC">
  <meta property="og:description" content="${card.subTitle}">
  <meta property="og:image" content="${card.image}">
  <style>
    @font-face {
      font-family: 'Isidora';
      src: url('/Font/Fonts/Isidora-SemiBold.otf') format('opentype');
      font-weight: 600;
      font-display: swap;
    }
    @font-face {
      font-family: 'Isidora';
      src: url('/Font/Fonts/Isidora-Black.otf') format('opentype');
      font-weight: 900;
      font-display: swap;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background-color: #E50012;
      color: #FFFFFF;
      font-family: 'Isidora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: hidden;
    }
    button { font-family: inherit; }
    .stripe-bar {
      width: 100%;
      height: 8px;
      display: flex;
      flex-shrink: 0;
    }
    .stripe-1 { flex: 1; background-color: #00A3E0; }
    .stripe-2 { flex: 1; background-color: #00A651; }
    .stripe-3 { flex: 1; background-color: #38B6FF; }
    .stripe-4 { flex: 1; background-color: #FFC700; }
    .stripe-5 { flex: 1; background-color: #009E49; }

    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 440px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 20px;
      text-align: center;
    }
    .title {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1.15;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
    .subtitle {
      font-size: 14.5px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin-top: 8px;
      line-height: 1.3;
      padding: 0 10px;
    }
    .card-wrap {
      width: 100%;
      max-width: 350px;
      margin: 22px auto 0;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.35);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      background-color: #E50012;
      line-height: 0;
    }
    .card-wrap img {
      width: 100%;
      height: auto;
      display: block;
      pointer-events: none;
      user-select: none;
    }
    .actions {
      width: 100%;
      max-width: 350px;
      margin: 22px auto 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      width: 100%;
      height: 48px;
      border: 0;
      border-radius: 9999px;
      font-size: 14.5px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
      transition: transform 0.1s ease, filter 0.15s ease;
      text-decoration: none;
      letter-spacing: -0.1px;
    }
    .btn:active {
      transform: scale(0.98);
    }
    .btn-download {
      background-color: #FFC700;
      color: #151515;
    }
    .btn-download:hover {
      filter: brightness(1.05);
    }
    .btn-share {
      background-color: #FFFFFF;
      color: #E50012;
    }
    .btn-share:hover {
      background-color: #f7f7f7;
    }
    .btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.6;
      flex-shrink: 0;
    }
    .footer {
      margin-top: 26px;
      margin-bottom: 6px;
      text-align: center;
    }
    .footer-brand {
      font-size: 12.5px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      opacity: 0.95;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .footer-copy {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="stripe-bar">
    <div class="stripe-1"></div>
    <div class="stripe-2"></div>
    <div class="stripe-3"></div>
    <div class="stripe-4"></div>
    <div class="stripe-5"></div>
  </div>

  <div class="main-container">
    <h1 class="title">Love Language Kamu <span>💕</span></h1>
    <p class="subtitle">Yuk simpan hasilnya dan bagikan ke orang tersayang!</p>

    <div class="card-wrap">
      <img id="cardImg" src="${card.image}" alt="${card.title}" />
    </div>

    <div class="actions">
      <button class="btn btn-download" onclick="downloadCard()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        <span id="downloadText">Download Hasil Kartu</span>
      </button>

      <button class="btn btn-share" onclick="shareCard()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span id="shareText">Bagikan Ke Orang Tersayang</span>
      </button>
    </div>

    <div class="footer">
      <p class="footer-brand">ROYCO x AADC Experience <span>❤</span></p>
      <p class="footer-copy">Copyright &copy; 2026. All rights reserved.</p>
    </div>
  </div>

  <div class="stripe-bar">
    <div class="stripe-1"></div>
    <div class="stripe-2"></div>
    <div class="stripe-3"></div>
    <div class="stripe-4"></div>
    <div class="stripe-5"></div>
  </div>

  <script>
    async function downloadCard() {
      const imgUrl = "${card.image}";
      const btnText = document.getElementById("downloadText");
      btnText.textContent = "Mengunduh...";
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Royko-LoveLanguage-${card.slug}.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        window.open(imgUrl, "_blank");
      } finally {
        btnText.textContent = "Download Hasil Kartu";
      }
    }

    async function shareCard() {
      const imgUrl = "${card.image}";
      const shareTitle = "Love Language: ${card.title} - Royco x AADC";
      const shareText = "Love language masakan aku adalah ${card.title}! Yuk cari tahu bahasa cintamu di Royco x AADC ❤️";
      const shareBtnText = document.getElementById("shareText");

      try {
        if (shareBtnText) shareBtnText.textContent = "Menyiapkan...";
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], "Royko-LoveLanguage-${card.slug}.png", { type: "image/png" });

        // If device supports sharing files directly (WhatsApp, IG Stories, Telegram, etc)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: shareText,
          });
          return;
        } else if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: window.location.href,
          });
          return;
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('Share file fallback:', err);
      } finally {
        if (shareBtnText) shareBtnText.textContent = "Bagikan Ke Orang Tersayang";
      }

      // Fallback clipboard for desktop browsers
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (shareBtnText) {
          shareBtnText.textContent = "Link Tersalin! ✓";
          setTimeout(() => { shareBtnText.textContent = "Bagikan Ke Orang Tersayang"; }, 2000);
        }
      } catch (err) {
        prompt("Salin link untuk berbagi:", window.location.href);
      }
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

export default router;
