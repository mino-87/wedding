(() => {
  'use strict';

  const CONFIG = window.WEDDING_CONFIG || {};
  const VIDEO_LIMIT = CONFIG.maxVideoUploadBytes || 500 * 1024 * 1024;
  const IMAGE_LIMIT = CONFIG.maxImageUploadBytes || 25 * 1024 * 1024;
  const SMALL_UPLOAD_LIMIT = 10 * 1024 * 1024;
  const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MiB; multiple of Drive's 256 KiB chunk requirement.

  const $ = (selector) => document.querySelector(selector);
  const endpoint = () => CONFIG.uploadEndpoint || CONFIG.backendEndpoint || '';
  const setStatus = (text) => {
    const el = $('#uploadStatus');
    if (el) el.textContent = text;
  };

  function isVideo(file) {
    return /^video\//i.test(file.type || '') || /\.(mov|mp4|m4v|webm|avi)$/i.test(file.name || '');
  }

  function limitFor(file) {
    return isVideo(file) ? VIDEO_LIMIT : IMAGE_LIMIT;
  }

  function formatMb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 1) + ' MB';
  }

  function currentPreviewFiles() {
    const picker = $('#mediaPicker');
    if (!picker || !picker.files) return [];
    const all = Array.from(picker.files);
    const labels = Array.from(document.querySelectorAll('#mediaPreview .file-label')).map((el) => el.textContent || '');
    if (!labels.length) return all.slice(0, CONFIG.maxFilesPerBatch || 10);

    const remaining = new Map();
    labels.forEach((name) => remaining.set(name, (remaining.get(name) || 0) + 1));
    return all.filter((file) => {
      const count = remaining.get(file.name) || 0;
      if (!count) return false;
      remaining.set(file.name, count - 1);
      return true;
    }).slice(0, CONFIG.maxFilesPerBatch || 10);
  }

  function fileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
      reader.onerror = () => reject(new Error('FILE_READ_FAILED'));
      reader.readAsDataURL(file);
    });
  }

  async function smallUpload(file, kind) {
    const data = await fileAsBase64(file);
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify({
        action: 'upload',
        event: 'David & Diana 24.09.2026',
        kind,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data
      })
    });
    if (!response.ok) throw new Error('HTTP_' + response.status);
    const result = await response.json().catch(() => ({ok: true}));
    if (result && result.ok === false) throw new Error(result.error || 'UPLOAD_FAILED');
    return result;
  }

  async function startResumable(file, kind) {
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify({
        action: 'startResumableUpload',
        event: 'David & Diana 24.09.2026',
        kind,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size
      })
    });
    if (!response.ok) throw new Error('INIT_HTTP_' + response.status);
    const result = await response.json().catch(() => null);
    if (!result || !result.ok || !result.sessionUrl) {
      const err = new Error((result && result.error) || 'RESUMABLE_NOT_AVAILABLE');
      err.code = result && result.error;
      throw err;
    }
    return result.sessionUrl;
  }

  async function uploadChunk(sessionUrl, file, start, endExclusive) {
    const chunk = file.slice(start, endExclusive);
    const response = await fetch(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Range': `bytes ${start}-${endExclusive - 1}/${file.size}`
      },
      body: chunk
    });

    if (response.status === 308) return {complete: false};
    if (response.ok) {
      return {complete: true, result: await response.json().catch(() => ({}))};
    }
    throw new Error('CHUNK_HTTP_' + response.status);
  }

  async function resumableUpload(file, kind, onProgress) {
    const sessionUrl = await startResumable(file, kind);
    let start = 0;
    let finalResult = {};

    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      let lastError = null;
      let chunkResult = null;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          chunkResult = await uploadChunk(sessionUrl, file, start, end);
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 900 * attempt));
        }
      }

      if (lastError) throw lastError;
      start = end;
      if (chunkResult && chunkResult.result) finalResult = chunkResult.result;
      if (onProgress) onProgress(start, file.size);
    }

    return finalResult;
  }

  async function uploadFile(file, index, total) {
    const kind = isVideo(file) ? 'video' : 'media';
    const limit = limitFor(file);
    if (file.size > limit) {
      const err = new Error('FILE_TOO_LARGE');
      err.file = file;
      err.limit = limit;
      throw err;
    }

    // Small images keep the lightweight path. Videos use Drive resumable upload,
    // with a fallback for an older Apps Script deployment while it is being updated.
    if (!isVideo(file) && file.size <= SMALL_UPLOAD_LIMIT) {
      setStatus(`جارٍ إرسال ${index + 1} من ${total}…`);
      return smallUpload(file, kind);
    }

    try {
      return await resumableUpload(file, kind, (sent, size) => {
        const percent = Math.min(100, Math.round((sent / size) * 100));
        setStatus(`جارٍ إرسال ${index + 1} من ${total} — ${percent}%`);
      });
    } catch (err) {
      // Preserve old behavior for small files if the live Apps Script version has
      // not yet been redeployed with resumable support.
      if (file.size <= SMALL_UPLOAD_LIMIT && (err.code === 'UNKNOWN_ACTION' || err.message === 'RESUMABLE_NOT_AVAILABLE')) {
        setStatus(`جارٍ إرسال ${index + 1} من ${total}…`);
        return smallUpload(file, kind);
      }
      throw err;
    }
  }

  document.addEventListener('click', async (event) => {
    const button = event.target.closest && event.target.closest('#shareMedia');
    if (!button) return;

    const files = currentPreviewFiles();
    if (!files.length || !endpoint()) return;

    // Take ownership before app.js's legacy Base64 upload handler runs.
    event.preventDefault();
    event.stopImmediatePropagation();

    const tooLarge = files.find((file) => file.size > limitFor(file));
    if (tooLarge) {
      const max = limitFor(tooLarge);
      setStatus(`${tooLarge.name} أكبر من الحد المسموح (${formatMb(max)}).`);
      return;
    }

    button.disabled = true;
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], i, files.length);
      }

      setStatus('اترسلت الملفات بنجاح إلى Wedding Drive ❤️');
      const picker = $('#mediaPicker');
      const preview = $('#mediaPreview');
      if (picker) picker.value = '';
      if (preview) preview.innerHTML = '';
      button.disabled = true;
    } catch (err) {
      console.error('Wedding upload failed', err);
      if (err && err.message === 'FILE_TOO_LARGE') {
        setStatus('الملف أكبر من الحد المسموح. الصور حتى 25 MB والفيديو حتى 500 MB.');
      } else {
        setStatus('الرفع متوقف. الملف لم يضِع — جرّب مرة تانية، ولو كان فيديو كبير سيكمل على دفعات.');
      }
      button.disabled = false;
    }
  }, true);
})();
