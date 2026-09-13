(() => {
  const currentScriptUrl = document.currentScript?.src || location.href;
  const baseUrl = new URL('.', currentScriptUrl);

  const weddingRuntime = document.createElement('script');
  weddingRuntime.src = new URL('runtime-fixes.js?v=20260911t', baseUrl).href;
  document.head.appendChild(weddingRuntime);

  const voiceCameraCss = document.createElement('link');
  voiceCameraCss.rel = 'stylesheet';
  voiceCameraCss.href = new URL('voice-camera-v2.css?v=20260911v', baseUrl).href;
  document.head.appendChild(voiceCameraCss);
})();
