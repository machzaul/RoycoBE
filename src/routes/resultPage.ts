import { Router, Request, Response } from 'express';
import { getCardByIdOrSlug, DEFINED_CARDS } from '../lib/cards';
import fs from 'fs';
import path from 'path';

const router = Router();

// Preload Isidora fonts as Base64 to guarantee 100% instant rendering across all mobile browsers
let isidoraBlackBase64 = '';
let isidoraSemiBoldBase64 = '';
try {
  const pBlack = path.join(process.cwd(), 'public', 'Font', 'Fonts', 'Isidora-Black.otf');
  if (fs.existsSync(pBlack)) {
    isidoraBlackBase64 = fs.readFileSync(pBlack).toString('base64');
  }
  const pSemi = path.join(process.cwd(), 'public', 'Font', 'Fonts', 'Isidora-SemiBold.otf');
  if (fs.existsSync(pSemi)) {
    isidoraSemiBoldBase64 = fs.readFileSync(pSemi).toString('base64');
  }
} catch (e) {
  console.warn('Font preload notice:', e);
}

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
      src: ${isidoraSemiBoldBase64 ? `url('data:font/otf;base64,${isidoraSemiBoldBase64}') format('opentype'), ` : ''}url('/Font/Fonts/Isidora-SemiBold.otf') format('opentype');
      font-weight: 500 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Isidora';
      src: ${isidoraBlackBase64 ? `url('data:font/otf;base64,${isidoraBlackBase64}') format('opentype'), ` : ''}url('/Font/Fonts/Isidora-Black.otf') format('opentype');
      font-weight: 800 900;
      font-style: normal;
      font-display: swap;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      font-family: 'Isidora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    body {
      background-color: #E50012;
      color: #FFFFFF;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: hidden;
      position: relative;
    }
    button, input {
      font-family: inherit;
    }
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
      line-height: 1.35;
      padding: 0 10px;
    }
    .card-wrap {
      width: 100%;
      max-width: 350px;
      margin: 20px auto 0;
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
      pointer-events: auto;
      -webkit-touch-callout: default !important;
      user-select: auto;
      cursor: pointer;
    }
    .actions {
      width: 100%;
      max-width: 350px;
      margin: 20px auto 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      width: 100%;
      height: 48px;
      border: 0;
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
      transition: transform 0.1s ease, filter 0.15s ease;
      text-decoration: none;
      letter-spacing: -0.2px;
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
      font-weight: 600;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 4px;
    }

    /* Modal Bottom Sheet */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-sheet {
      width: 100%;
      max-width: 440px;
      background: #FFFFFF;
      color: #1a1a1a;
      border-radius: 26px 26px 0 0;
      padding: 12px 20px 24px;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
      transform: translateY(100%);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      max-height: 90vh;
      overflow-y: auto;
    }
    @media (min-width: 640px) {
      .modal-overlay {
        align-items: center;
      }
      .modal-sheet {
        border-radius: 26px;
        transform: scale(0.94) translateY(20px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      }
      .modal-overlay.active .modal-sheet {
        transform: scale(1) translateY(0);
      }
    }
    .modal-overlay.active .modal-sheet {
      transform: translateY(0);
    }
    .modal-handle {
      width: 42px;
      height: 4.5px;
      background: #e2e8f0;
      border-radius: 9999px;
      margin: 4px auto 14px;
    }
    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 900;
      color: #111827;
      line-height: 1.2;
      letter-spacing: -0.3px;
    }
    .modal-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      margin-top: 3px;
      line-height: 1.3;
    }
    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: #f3f4f6;
      color: #4b5563;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease;
    }
    .modal-close:hover {
      background: #e5e7eb;
    }
    .modal-close svg {
      width: 16px;
      height: 16px;
    }

    /* Card Mini Preview */
    .card-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 14px;
      margin-bottom: 16px;
    }
    .preview-thumb {
      width: 46px;
      height: 46px;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      flex-shrink: 0;
    }
    .preview-info {
      text-align: left;
      min-width: 0;
      flex: 1;
    }
    .preview-badge {
      font-size: 10px;
      font-weight: 900;
      color: #E50012;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
    }
    .preview-title {
      font-size: 14px;
      font-weight: 900;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
      margin-top: 1px;
    }
    .preview-desc {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
      margin-top: 2px;
    }

    /* Share Grid */
    .share-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px 8px;
      margin-bottom: 16px;
    }
    .share-btn-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 4px;
      border-radius: 12px;
      transition: transform 0.12s ease, background 0.12s ease;
    }
    .share-btn-item:active {
      transform: scale(0.93);
      background: #f9fafb;
    }
    .share-icon-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transition: transform 0.15s ease;
    }
    .share-btn-item:hover .share-icon-circle {
      transform: translateY(-2px);
    }
    .share-icon-circle svg {
      width: 26px;
      height: 26px;
    }
    .share-wa {
      background-color: #25D366;
    }
    .share-ig {
      background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
    }
    .share-tg {
      background-color: #0088cc;
    }
    .share-fb {
      background-color: #1877F2;
    }
    .share-tw {
      background-color: #000000;
    }
    .share-copy {
      background-color: #4b5563;
    }
    .share-btn-label {
      font-size: 11.5px;
      font-weight: 800;
      color: #374151;
      text-align: center;
      line-height: 1.1;
    }

    /* Copy Link Input Bar */
    .copy-box {
      display: flex;
      align-items: center;
      background: #f3f4f6;
      border-radius: 9999px;
      padding: 4px 6px 4px 14px;
      margin-bottom: 12px;
      border: 1px solid #e5e7eb;
    }
    .copy-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 12px;
      font-weight: 600;
      color: #4b5563;
      outline: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: inherit;
    }
    .copy-btn {
      background: #E50012;
      color: #FFFFFF;
      border: none;
      border-radius: 9999px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 900;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease;
    }
    .copy-btn:hover {
      background: #cc0010;
    }

    /* Native Share & Cancel Button */
    .btn-native-share {
      width: 100%;
      height: 42px;
      border: 1.5px dashed #cbd5e1;
      background: #f8fafc;
      color: #334155;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: pointer;
      margin-bottom: 8px;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .btn-native-share:active {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .btn-native-share svg {
      width: 16px;
      height: 16px;
    }
    .modal-cancel-btn {
      width: 100%;
      height: 40px;
      border: none;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .modal-cancel-btn:hover {
      background: #e5e7eb;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%) translateY(-60px);
      background: #111827;
      color: #FFFFFF;
      padding: 10px 18px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 800;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .toast-icon {
      width: 16px;
      height: 16px;
      color: #10b981;
      flex-shrink: 0;
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
      <!-- Download / Save to Gallery Button -->
      <button class="btn btn-download" onclick="downloadCard()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        <span id="downloadText">Simpan ke Galeri Foto</span>
      </button>

      <!-- Share Button (Opens Social Share Sheet) -->
      <button class="btn btn-share" onclick="openShareModal()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>Bagikan Ke Orang Tersayang</span>
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

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
    <span id="toastMsg">Tautan berhasil disalin!</span>
  </div>

  <!-- Social Share Bottom Sheet Modal -->
  <div id="shareModal" class="modal-overlay" onclick="handleBackdropClick(event)">
    <div class="modal-sheet" id="modalSheet">
      <div class="modal-handle"></div>

      <div class="modal-header">
        <div>
          <h2 class="modal-title">Bagikan Hasil Kartu 💕</h2>
          <p class="modal-subtitle">Pilih media sosial untuk membagikan kartu cinta kamu</p>
        </div>
        <button class="modal-close" onclick="closeShareModal()" aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mini Preview -->
      <div class="card-preview">
        <img src="${card.image}" alt="${card.title}" class="preview-thumb" />
        <div class="preview-info">
          <span class="preview-badge">Love Language</span>
          <h3 class="preview-title">${card.title}</h3>
          <p class="preview-desc">${card.subTitle || 'Royco x AADC Experience'}</p>
        </div>
      </div>

      <!-- Social Media Share Grid -->
      <div class="share-grid">
        <!-- WhatsApp -->
        <button class="share-btn-item" onclick="shareWhatsApp()">
          <div class="share-icon-circle share-wa">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <span class="share-btn-label">WhatsApp</span>
        </button>

        <!-- Instagram -->
        <button class="share-btn-item" onclick="shareInstagram()">
          <div class="share-icon-circle share-ig">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="share-btn-label">Instagram</span>
        </button>

        <!-- Telegram -->
        <button class="share-btn-item" onclick="shareTelegram()">
          <div class="share-icon-circle share-tg">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.885-1.02 4.887-1.442 7.15-.178.957-.53 1.278-.87 1.309-.739.068-1.3-.488-2.016-.957-.864-.566-1.352-.919-2.19-1.471-.97-.638-.341-.989.212-1.564.145-.15 2.66-2.438 2.709-2.645.006-.026.011-.122-.047-.174-.058-.052-.144-.034-.207-.02-.088.02-1.498.954-4.228 2.798-.4.275-.762.41-1.086.403-.357-.008-1.044-.202-1.555-.368-.627-.204-1.125-.312-1.082-.659.022-.181.272-.367.75-.558 2.936-1.279 4.895-2.124 5.877-2.535 2.799-1.173 3.382-1.377 3.762-1.383.084-.001.27.02.391.119.102.083.13.195.144.274-.002.046.008.204-.002.324z"/>
            </svg>
          </div>
          <span class="share-btn-label">Telegram</span>
        </button>

        <!-- Facebook -->
        <button class="share-btn-item" onclick="shareFacebook()">
          <div class="share-icon-circle share-fb">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span class="share-btn-label">Facebook</span>
        </button>

        <!-- X (Twitter) -->
        <button class="share-btn-item" onclick="shareTwitter()">
          <div class="share-icon-circle share-tw">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <span class="share-btn-label">X / Twitter</span>
        </button>

        <!-- Salin Link -->
        <button class="share-btn-item" onclick="copyLink()">
          <div class="share-icon-circle share-copy" id="copyIconWrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <span class="share-btn-label" id="copyLabel">Salin Link</span>
        </button>
      </div>

      <!-- Copy URL Bar -->
      <div class="copy-box">
        <input type="text" id="shareUrlInput" readonly value="" class="copy-input" />
        <button onclick="copyLink()" class="copy-btn">Salin</button>
      </div>

      <!-- Native OS Share Button -->
      <button class="btn-native-share" onclick="shareNativeDevice()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>Bagikan Lewat Menu HP (Aplikasi Lainnya)</span>
      </button>

      <button class="modal-cancel-btn" onclick="closeShareModal()">Tutup</button>
    </div>
  </div>

  <script>
    let toastTimeout = null;
    function showToast(message, duration = 2500) {
      const toast = document.getElementById("toast");
      const msg = document.getElementById("toastMsg");
      if (!toast || !msg) return;
      msg.textContent = message;
      toast.classList.add("show");
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, duration);
    }

    function openShareModal() {
      const modal = document.getElementById("shareModal");
      const input = document.getElementById("shareUrlInput");
      if (input) input.value = window.location.href;
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }

    function closeShareModal() {
      const modal = document.getElementById("shareModal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    function handleBackdropClick(e) {
      if (e.target && e.target.id === "shareModal") {
        closeShareModal();
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeShareModal();
    });

    function triggerBlobDownload(blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Royko-LoveLanguage-${card.slug}.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 6000);
    }

    async function downloadCard() {
      const imgUrl = "${card.image}";
      const btnText = document.getElementById("downloadText");
      btnText.textContent = "Menyiapkan...";
      showToast("Menyiapkan kartu ke galeri...", 1500);
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], "Royko-LoveLanguage-${card.slug}.png", { type: "image/png" });

        // Metode 1: Web Share API dengan File (Standar resmi browser HP iOS & Android untuk Simpan ke Galeri Foto)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            showToast("Pilih 'Simpan Gambar' di menu HP untuk langsung masuk ke Galeri Foto 📸", 4000);
            await navigator.share({
              files: [file],
              title: "Love Language: ${card.title}",
              text: "Kartu Love Language Royco x AADC"
            });
            showToast("✓ Kartu berhasil disimpan!");
            return;
          } catch (err) {
            // Jika user membatalkan menu share, tetap unduh file via browser sebagai cadangan
            if (err && err.name === 'AbortError') {
              triggerBlobDownload(blob);
              showToast("✓ Kartu diunduh ke penyimpanan HP");
              return;
            }
          }
        }

        // Metode 2: Download standar via browser (Di Android otomatis terindeks oleh Galeri/Google Photos)
        triggerBlobDownload(blob);
        showToast("✓ Kartu berhasil disimpan ke galeri!", 3000);
      } catch (e) {
        window.open(imgUrl, "_blank");
      } finally {
        btnText.textContent = "Simpan ke Galeri Foto";
      }
    }

    function shareWhatsApp() {
      const pageUrl = window.location.href;
      const shareText = "Love language masakan aku adalah *${card.title}*! ❤️ Yuk cari tahu bahasa cintamu di kuis Royco x AADC:\\n\\n" + pageUrl;
      const waUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareText);
      window.open(waUrl, "_blank");
    }

    async function shareInstagram() {
      showToast("Menyiapkan gambar kartu...", 2000);
      const imgUrl = "${card.image}";
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], "Royko-LoveLanguage-${card.slug}.png", { type: "image/png" });

        // Auto download image so it's readily available in camera roll/gallery
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "Royko-LoveLanguage-${card.slug}.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        // If mobile OS supports file sharing directly (e.g. choose IG Story)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Love Language: ${card.title}",
              text: "Love language masakan aku adalah ${card.title}! ❤️",
            });
            return;
          } catch (err) {
            if (err && err.name === 'AbortError') return;
          }
        }
      } catch (e) {
        console.warn("IG prepare:", e);
      }

      showToast("✓ Kartu disimpan! Membuka Instagram...", 3000);
      setTimeout(() => {
        window.location.href = "instagram://camera";
        setTimeout(() => {
          window.open("https://www.instagram.com", "_blank");
        }, 1500);
      }, 700);
    }

    function shareTelegram() {
      const pageUrl = window.location.href;
      const shareText = "Love language masakan aku adalah ${card.title}! ❤️ Yuk cari tahu bahasa cintamu di Royco x AADC:";
      const tgUrl = "https://t.me/share/url?url=" + encodeURIComponent(pageUrl) + "&text=" + encodeURIComponent(shareText);
      window.open(tgUrl, "_blank");
    }

    function shareFacebook() {
      const pageUrl = window.location.href;
      const fbUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
      window.open(fbUrl, "_blank");
    }

    function shareTwitter() {
      const pageUrl = window.location.href;
      const shareText = "Love language masakan aku adalah ${card.title}! ❤️ Yuk cari tahu bahasa cintamu di Royco x AADC:";
      const twUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(pageUrl);
      window.open(twUrl, "_blank");
    }

    async function copyLink() {
      const pageUrl = window.location.href;
      const label = document.getElementById("copyLabel");
      try {
        await navigator.clipboard.writeText(pageUrl);
        showToast("✓ Tautan berhasil disalin!");
        if (label) {
          label.textContent = "Tersalin! ✓";
          setTimeout(() => { label.textContent = "Salin Link"; }, 2500);
        }
      } catch (err) {
        const input = document.getElementById("shareUrlInput");
        if (input) {
          input.select();
          document.execCommand("copy");
          showToast("✓ Tautan berhasil disalin!");
        } else {
          prompt("Salin link:", pageUrl);
        }
      }
    }

    async function shareNativeDevice() {
      const pageUrl = window.location.href;
      const shareTitle = "Love Language: ${card.title} - Royco x AADC";
      const shareText = "Love language masakan aku adalah ${card.title}! ❤️ Yuk cari tahu bahasa cintamu di Royco x AADC:";

      if (navigator.share) {
        try {
          const res = await fetch("${card.image}");
          const blob = await res.blob();
          const file = new File([blob], "Royko-LoveLanguage-${card.slug}.png", { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: shareTitle,
              text: shareText + "\\n" + pageUrl,
            });
            return;
          }
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: pageUrl,
          });
        } catch (err) {
          if (err && err.name !== 'AbortError') {
            showToast("Tidak dapat membuka menu bagikan.");
          }
        }
      } else {
        showToast("Menu share sistem butuh koneksi aman (HTTPS). Silakan gunakan tombol medsos di atas.");
      }
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

export default router;
