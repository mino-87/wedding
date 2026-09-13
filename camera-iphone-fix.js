(() => {
  'use strict';

  const dialog = document.querySelector('#weddingCameraDialog');
  const view = document.querySelector('#weddingView');
  const video = document.querySelector('#weddingVideo');
  if (!dialog || !view || !video) return;

  const closeX = dialog.querySelector('button.close');
  const actions = dialog.querySelector('.camera-actions');
  const status = document.querySelector('#weddingCameraStatus');

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'ar';
  }

  function stopCamera() {
    const stream = video.srcObject;
    if (stream?.getTracks) stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  function closeCamera() {
    stopCamera();
    if (dialog.open) dialog.close();
  }

  function fitPreviewToPhone() {
    const vw = video.videoWidth || 0;
    const vh = video.videoHeight || 0;
    if (!vw || !vh) return;

    const ratio = vw / vh;
    const maxW = Math.min(window.innerWidth * 0.92, 720);
    const maxH = Math.max(260, Math.min(window.innerHeight * 0.68, 760));
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }

    view.style.setProperty('width', `${Math.round(w)}px`, 'important');
    view.style.setProperty('height', `${Math.round(h)}px`, 'important');
    view.style.setProperty('aspect-ratio', `${vw} / ${vh}`, 'important');
    video.style.setProperty('width', '100%', 'important');
    video.style.setProperty('height', '100%', 'important');
    video.style.setProperty('object-fit', 'cover', 'important');
  }

  video.addEventListener('loadedmetadata', () => requestAnimationFrame(fitPreviewToPhone));
  video.addEventListener('playing', () => requestAnimationFrame(fitPreviewToPhone));
  window.addEventListener('orientationchange', () => setTimeout(fitPreviewToPhone, 180));
  window.addEventListener('resize', fitPreviewToPhone);

  if (closeX) {
    closeX.type = 'button';
    closeX.setAttribute('aria-label', lang() === 'en' ? 'Close camera' : 'إغلاق الكاميرا');
    closeX.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeCamera();
    }, true);
  }

  let cancel = document.querySelector('#cancelWeddingCamera');
  if (actions && !cancel) {
    cancel = document.createElement('button');
    cancel.id = 'cancelWeddingCamera';
    cancel.type = 'button';
    cancel.className = 'secondary wedding-camera-cancel';
    actions.appendChild(cancel);
  }

  if (cancel) {
    cancel.type = 'button';
    cancel.textContent = lang() === 'en' ? 'Cancel' : 'إلغاء';
    cancel.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeCamera();
    }, true);

    new MutationObserver(() => {
      cancel.textContent = lang() === 'en' ? 'Cancel' : 'إلغاء';
      if (closeX) closeX.setAttribute('aria-label', lang() === 'en' ? 'Close camera' : 'إغلاق الكاميرا');
    }).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  }

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCamera();
  });

  dialog.addEventListener('close', stopCamera);

  const style = document.createElement('style');
  style.id = 'iphone-wedding-camera-fix';
  style.textContent = `
    #weddingCameraDialog{
      width:min(96vw,780px)!important;
      max-width:96vw!important;
      max-height:96dvh!important;
      overflow:auto!important;
      padding:clamp(12px,2.5vw,22px)!important;
      box-sizing:border-box!important;
    }
    #weddingCameraDialog form[method="dialog"]{
      position:sticky!important;
      top:0!important;
      z-index:100!important;
      height:0!important;
      overflow:visible!important;
      pointer-events:none!important;
    }
    #weddingCameraDialog button.close{
      pointer-events:auto!important;
      position:absolute!important;
      top:2px!important;
      right:2px!important;
      left:auto!important;
      width:46px!important;
      height:46px!important;
      min-width:46px!important;
      min-height:46px!important;
      border-radius:999px!important;
      display:grid!important;
      place-items:center!important;
      z-index:101!important;
      font-size:30px!important;
      line-height:1!important;
      background:rgba(20,20,20,.72)!important;
      color:#fff!important;
      border:1px solid rgba(255,255,255,.35)!important;
      backdrop-filter:blur(8px)!important;
      -webkit-backdrop-filter:blur(8px)!important;
    }
    #weddingView{
      position:relative!important;
      overflow:hidden!important;
      margin:12px auto 0!important;
      max-width:92vw!important;
      max-height:68dvh!important;
      padding:0!important;
      background:#111!important;
      border-radius:16px!important;
    }
    #weddingView #weddingVideo{
      display:block!important;
      margin:0!important;
      max-width:none!important;
      max-height:none!important;
      border-radius:0!important;
    }
    #weddingView .wedding-frame{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      box-sizing:border-box!important;
      margin:0!important;
      pointer-events:none!important;
      border:clamp(3px,.9vw,7px) solid rgba(255,255,255,.96)!important;
      transform:none!important;
    }
    #weddingView .frame-title{
      position:absolute!important;
      top:clamp(14px,4vw,34px)!important;
      left:0!important;
      right:0!important;
      text-align:center!important;
      font-size:clamp(24px,7vw,54px)!important;
      line-height:1!important;
      margin:0!important;
    }
    #weddingView .frame-date{
      position:absolute!important;
      top:clamp(48px,13vw,96px)!important;
      left:0!important;
      right:0!important;
      text-align:center!important;
      font-size:clamp(11px,3vw,20px)!important;
      margin:0!important;
    }
    #weddingView .frame-caption{
      position:absolute!important;
      bottom:clamp(14px,4vw,32px)!important;
      left:12px!important;
      right:12px!important;
      text-align:center!important;
      font-size:clamp(11px,3.2vw,20px)!important;
      line-height:1.25!important;
      margin:0!important;
    }
    #weddingCameraDialog .camera-actions{
      display:flex!important;
      flex-wrap:wrap!important;
      justify-content:center!important;
      gap:10px!important;
      padding-bottom:max(6px,env(safe-area-inset-bottom))!important;
    }
    #cancelWeddingCamera{
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      min-height:44px!important;
    }
    @media (max-width:600px){
      #weddingCameraDialog{
        width:100vw!important;
        max-width:100vw!important;
        max-height:100dvh!important;
        border-radius:0!important;
        padding:10px!important;
      }
      #weddingView{
        max-width:94vw!important;
        max-height:70dvh!important;
        border-radius:12px!important;
      }
      #weddingCameraDialog button.close{
        top:max(4px,env(safe-area-inset-top))!important;
        right:6px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();