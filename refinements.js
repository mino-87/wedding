(() => {
  const $ = s => document.querySelector(s);
  const surprise = $('#surpriseVideo');
  const gate = $('#gate');
  const invitation = $('#invitation');

  async function primeSurprise() {
    if (!surprise) return;
    try {
      const src = surprise.querySelector('source')?.getAttribute('src');
      if (src && !surprise.getAttribute('src')) {
        surprise.src = src;
        surprise.querySelectorAll('source').forEach(s => s.removeAttribute('type'));
        surprise.load();
      }
      surprise.playsInline = true;
      surprise.muted = false;
      surprise.volume = 0.01;
      surprise.currentTime = 0;
      await surprise.play();
    } catch (e) {
      console.warn('Surprise prime failed', e);
    }
  }

  async function startSurpriseFromBeginning() {
    if (!surprise) return;
    try {
      surprise.muted = false;
      surprise.volume = 1;
      surprise.currentTime = 0;
      await surprise.play();
    } catch (e) {
      console.warn('Surprise autoplay with sound was blocked', e);
    }
  }

  $('#startSmile')?.addEventListener('click', primeSurprise, true);

  if (gate && invitation) {
    const observer = new MutationObserver(() => {
      const gateHidden = gate.classList.contains('hidden') || gate.getAttribute('aria-hidden') === 'true' || getComputedStyle(gate).display === 'none';
      const invitationVisible = !invitation.classList.contains('hidden') && getComputedStyle(invitation).display !== 'none';
      if (gateHidden && invitationVisible) startSurpriseFromBeginning();
    });
    observer.observe(gate, {attributes:true, attributeFilter:['class','style','aria-hidden']});
    observer.observe(invitation, {attributes:true, attributeFilter:['class','style']});
  }

  const missions = {
    ar: [
      'صوّر أحلى ضحكة عفوية للعريس أو العروسة من غير ما ياخدوا بالهم.',
      'هات صورة تجمع 3 أجيال من العيلة في لقطة واحدة.',
      'اكتشف مين أكتر واحد بيرقص بحماس وصوّر له فيديو 5 ثواني.',
      'خلّي شخصين مايعرفوش بعض يعملوا صورة مضحكة سوا.',
      'صوّر أجمل تفصيلة في الديكور محدش واخد باله منها.',
      'سجّل كلمة سريعة من حد كبير في العيلة للعروسين.',
      'التقط صورة لحد بيضحك من قلبه من غير ما يبص للكاميرا.',
      'اعمل selfie مع شخص أول مرة تقابله في الفرح.',
      'صوّر لحظة لطيفة بين طفل وأحد الكبار.',
      'اعمل لقطة سينمائية لمدة 5 ثواني للقاعة قبل ما تزحم.',
      'خلي مجموعة تعمل قلب بإيديها وصوّرهم.',
      'صوّر العريس والعروسة من زاوية غير متوقعة لكن لطيفة.',
      'التقط صورة لأجمل outfit في رأيك من غير إحراج صاحبه.',
      'سجّل نصيحة زواج في 10 ثواني من ضيف تختاره عشوائيًا.'
    ],
    en: [
      'Capture the best candid laugh from the bride or groom without them noticing.',
      'Take one photo that brings three generations of the family together.',
      'Find the most enthusiastic dancer and film a 5-second clip.',
      'Get two guests who do not know each other to pose for a funny photo together.',
      'Photograph the prettiest little decor detail most people might miss.',
      'Record a short message for the couple from one of the older family members.',
      'Capture someone genuinely laughing without looking at the camera.',
      'Take a selfie with someone you met for the first time at the wedding.',
      'Capture a sweet moment between a child and an older guest.',
      'Film a 5-second cinematic shot of the reception hall before it gets crowded.',
      'Get a group to make a heart with their hands and photograph them.',
      'Photograph the bride and groom from an unexpected but flattering angle.',
      'Capture your favorite wedding outfit of the night — respectfully and naturally.',
      'Record a 10-second marriage tip from a guest you choose at random.'
    ]
  };

  let last = {ar:-1,en:-1};
  const language = () => document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'ar';
  function clearMission(){
    const card = $('#missionCard');
    if(card){card.textContent='';card.classList.add('hidden');}
  }

  $('#missionButton')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const lang = language();
    const list = missions[lang];
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (list.length > 1 && i === last[lang]);
    last[lang] = i;
    const card = $('#missionCard');
    if (card) {
      card.textContent = `🎯 ${list[i]}`;
      card.dir = lang === 'en' ? 'ltr' : 'rtl';
      card.lang = lang;
      card.classList.remove('hidden');
    }
  }, true);

  /* Clarify the two voice actions and prevent duplicate uploads to Drive. */
  const voiceUploadButton = $('#shareRecording');
  const voiceLocalButton = $('#saveRecording');
  const recordPreview = $('#recordPreview');
  const recordStatus = $('#recordStatus');
  let voiceUploaded = false;
  let voiceUploading = false;
  let lastVoiceSrc = '';

  function setVoiceLabels() {
    const en = language() === 'en';
    if (voiceUploadButton && !voiceUploaded && !voiceUploading) voiceUploadButton.textContent = en ? 'Send voice to us' : 'حفظ الفويس عندنا';
    if (voiceLocalButton) voiceLocalButton.textContent = en ? 'Save a copy on my device' : 'حفظ نسخة على جهازي';
  }

  function resetVoiceUploadForNewRecording() {
    const src = recordPreview?.getAttribute('src') || '';
    if (src !== lastVoiceSrc) {
      lastVoiceSrc = src;
      voiceUploaded = false;
      voiceUploading = false;
      if (voiceUploadButton) {
        voiceUploadButton.disabled = false;
        delete voiceUploadButton.dataset.saved;
      }
      setVoiceLabels();
    }
  }

  if (recordPreview) new MutationObserver(resetVoiceUploadForNewRecording).observe(recordPreview,{attributes:true,attributeFilter:['src']});
  $('#deleteRecording')?.addEventListener('click', () => setTimeout(resetVoiceUploadForNewRecording,0), true);

  const endpoint = () => window.WEDDING_CONFIG?.uploadEndpoint || window.WEDDING_CONFIG?.backendEndpoint || '';
  const blobToBase64 = blob => new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(new Error('FILE_READ_FAILED'));
    reader.readAsDataURL(blob);
  });

  async function uploadBlob(blob, kind, name) {
    const url = endpoint();
    if (!url) throw new Error('UPLOAD_NOT_CONFIGURED');
    const max = window.WEDDING_CONFIG?.maxCentralUploadBytes || 12 * 1024 * 1024;
    if (blob.size > max) throw new Error('FILE_TOO_LARGE');
    const data = await blobToBase64(blob);
    const response = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:'upload',event:'David & Diana 24.09.2026',kind,name,mimeType:blob.type || 'application/octet-stream',data})
    });
    if (!response.ok) throw new Error('HTTP_' + response.status);
    const result = await response.json().catch(() => ({ok:true}));
    if (result?.ok === false) throw new Error(result.error || 'UPLOAD_FAILED');
    return result;
  }

  voiceUploadButton?.addEventListener('click', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const en = language() === 'en';
    if (voiceUploaded) {
      if (recordStatus) recordStatus.textContent = en ? 'This voice message is already saved with us ✓' : 'الفويس ده اتحفظ عندنا بالفعل ✓';
      return;
    }
    if (voiceUploading) return;
    const src = recordPreview?.getAttribute('src') || recordPreview?.src || '';
    if (!src) {
      if (recordStatus) recordStatus.textContent = en ? 'Nothing was saved — record a voice message first.' : 'متحفظش حاجة — سجّل فويس الأول.';
      return;
    }
    try {
      voiceUploading = true;
      voiceUploadButton.disabled = true;
      voiceUploadButton.textContent = en ? 'Saving…' : 'جارٍ الحفظ…';
      if (recordStatus) recordStatus.textContent = en ? 'Saving your voice message…' : 'بنحفظ الفويس عندنا…';
      const blob = await fetch(src).then(r => r.blob());
      const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : blob.type.includes('webm') ? 'webm' : 'audio';
      await uploadBlob(blob,'voice',`david-diana-message-${Date.now()}.${ext}`);
      voiceUploaded = true;
      voiceUploadButton.dataset.saved = '1';
      voiceUploadButton.textContent = en ? 'Saved ✓' : 'اتحفظ ✓';
      if (recordStatus) recordStatus.textContent = en ? 'Your voice message was saved successfully ❤️' : 'الفويس اتحفظ عندنا بنجاح ❤️';
    } catch (err) {
      console.error('Voice upload failed',err);
      voiceUploaded = false;
      voiceUploadButton.disabled = false;
      setVoiceLabels();
      if (recordStatus) recordStatus.textContent = en ? 'The voice message was not saved. Please try again.' : 'الفويس متحفظش. جرّب مرة تانية.';
    } finally {
      voiceUploading = false;
      if (!voiceUploaded) setVoiceLabels();
    }
  }, true);

  /* Wedding Camera compatibility fix: the HTML uses *WeddingPhoto IDs while old app.js used older IDs. */
  const weddingDialog = $('#weddingCameraDialog');
  const weddingView = $('#weddingView');
  const weddingVideo = $('#weddingVideo');
  const weddingCanvas = $('#weddingCanvas');
  const weddingStatus = $('#weddingCameraStatus');
  const captureButton = $('#captureWeddingPhoto');
  const retakeButton = $('#retakeWeddingPhoto');
  const sharePhotoButton = $('#shareWeddingPhoto');
  const savePhotoButton = $('#saveWeddingPhoto');
  const switchButton = $('#switchCamera');
  const openCameraButton = $('#openWeddingCamera');
  let capturedWeddingBlob = null;
  let cameraUploaded = false;

  function setCameraCaptureState(captured) {
    if (weddingView) weddingView.classList.toggle('hidden',captured);
    if (weddingCanvas) weddingCanvas.classList.toggle('hidden',!captured);
    captureButton?.classList.toggle('hidden',captured);
    switchButton?.classList.toggle('hidden',captured);
    retakeButton?.classList.toggle('hidden',!captured);
    sharePhotoButton?.classList.toggle('hidden',!captured);
    savePhotoButton?.classList.toggle('hidden',!captured);
  }

  function stopVisibleWeddingStream() {
    const stream = weddingVideo?.srcObject;
    stream?.getTracks?.().forEach(track => track.stop());
    if (weddingVideo) weddingVideo.srcObject = null;
  }

  function drawResponsiveWeddingFrame(ctx,W,H) {
    const short = Math.min(W,H);
    const pad = Math.max(14,Math.round(short*.028));
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,.96)';
    ctx.lineWidth=Math.max(6,Math.round(short*.009));
    ctx.strokeRect(pad,pad,W-pad*2,H-pad*2);
    ctx.textAlign='center';
    ctx.fillStyle='#fff';
    ctx.shadowColor='rgba(0,0,0,.72)';
    ctx.shadowBlur=Math.max(8,Math.round(short*.014));
    ctx.font=`italic 700 ${Math.round(short*.075)}px Georgia,serif`;
    ctx.fillText('David & Diana',W/2,pad + short*.09);
    ctx.font=`700 ${Math.round(short*.031)}px Arial,sans-serif`;
    ctx.fillText('24.09.2026',W/2,pad + short*.135);
    ctx.font=`600 ${Math.round(short*.032)}px Arial,sans-serif`;
    ctx.fillText("Smile — you're at our wedding",W/2,H-pad-short*.045);
    ctx.restore();
  }

  captureButton?.addEventListener('click', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    try {
      const vw = weddingVideo?.videoWidth || 0;
      const vh = weddingVideo?.videoHeight || 0;
      if (!vw || !vh) throw new Error('CAMERA_NOT_READY');
      const maxSide = 1920;
      const scale = Math.min(1,maxSide/Math.max(vw,vh));
      const W = Math.max(1,Math.round(vw*scale));
      const H = Math.max(1,Math.round(vh*scale));
      weddingCanvas.width = W;
      weddingCanvas.height = H;
      const ctx = weddingCanvas.getContext('2d',{alpha:false});
      ctx.drawImage(weddingVideo,0,0,W,H);
      drawResponsiveWeddingFrame(ctx,W,H);
      capturedWeddingBlob = await new Promise(resolve => weddingCanvas.toBlob(resolve,'image/jpeg',.92));
      if (!capturedWeddingBlob) throw new Error('CAPTURE_FAILED');
      cameraUploaded = false;
      sharePhotoButton && (sharePhotoButton.disabled = false);
      setCameraCaptureState(true);
      stopVisibleWeddingStream();
      if (weddingStatus) weddingStatus.textContent = language()==='en' ? 'Photo ready ❤️' : 'الصورة جاهزة ❤️';
    } catch (err) {
      console.error('Wedding camera capture failed',err);
      if (weddingStatus) weddingStatus.textContent = language()==='en' ? 'Could not take the photo. Please try again.' : 'تعذر التقاط الصورة. جرّب تاني.';
    }
  }, true);

  retakeButton?.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    capturedWeddingBlob = null;
    cameraUploaded = false;
    setCameraCaptureState(false);
    openCameraButton?.click();
  }, true);

  savePhotoButton?.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!capturedWeddingBlob) return;
    const url = URL.createObjectURL(capturedWeddingBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `David-Diana-Wedding-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url),1500);
    if (weddingStatus) weddingStatus.textContent = language()==='en' ? 'A copy was saved on your device ✓' : 'اتحفظت نسخة على جهازك ✓';
  }, true);

  sharePhotoButton?.addEventListener('click', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const en = language()==='en';
    if (!capturedWeddingBlob) return;
    if (cameraUploaded) {
      if (weddingStatus) weddingStatus.textContent = en ? 'This photo is already saved with us ✓' : 'الصورة دي اتحفظت عندنا بالفعل ✓';
      return;
    }
    try {
      sharePhotoButton.disabled = true;
      if (weddingStatus) weddingStatus.textContent = en ? 'Saving the photo…' : 'بنحفظ الصورة…';
      await uploadBlob(capturedWeddingBlob,'camera',`David-Diana-Wedding-${Date.now()}.jpg`);
      cameraUploaded = true;
      sharePhotoButton.textContent = en ? 'Saved ✓' : 'اتحفظت ✓';
      if (weddingStatus) weddingStatus.textContent = en ? 'Photo saved successfully ❤️' : 'الصورة اتحفظت عندنا بنجاح ❤️';
    } catch (err) {
      console.error('Wedding photo upload failed',err);
      sharePhotoButton.disabled = false;
      if (weddingStatus) weddingStatus.textContent = en ? 'The photo was not saved. Please try again.' : 'الصورة متحفظتش. جرّب تاني.';
    }
  }, true);

  /* Keep the live frame aligned to the actual iPhone/desktop video aspect ratio. */
  const style = document.createElement('style');
  style.textContent = `
    #weddingCameraDialog{width:min(96vw,780px)!important;max-width:780px!important;padding:clamp(12px,2.5vw,24px)!important;box-sizing:border-box!important}
    #weddingCameraDialog .camera-shell{position:relative!important;width:min(92vw,700px)!important;height:auto!important;aspect-ratio:auto!important;margin:0 auto!important;overflow:hidden!important;background:#050505!important;border-radius:18px!important}
    #weddingCameraDialog #weddingVideo{display:block!important;width:100%!important;height:auto!important;max-height:70dvh!important;object-fit:contain!important;background:#050505!important}
    #weddingCameraDialog #weddingCanvas{display:block;width:min(92vw,700px)!important;height:auto!important;max-height:70dvh!important;object-fit:contain!important;margin:0 auto!important;border-radius:18px!important;background:#050505!important}
    #weddingCameraDialog #weddingCanvas.hidden{display:none!important}
    #weddingCameraDialog .wedding-frame{position:absolute!important;inset:clamp(10px,2.7vw,22px)!important;width:auto!important;height:auto!important;transform:none!important;border:clamp(2px,.55vw,4px) solid rgba(255,255,255,.94)!important;border-radius:2px!important;pointer-events:none!important;box-sizing:border-box!important}
    #weddingCameraDialog .frame-title{position:absolute!important;top:clamp(10px,2.5vw,24px)!important;left:0!important;right:0!important;text-align:center!important;font-size:clamp(1.65rem,6vw,3.4rem)!important;line-height:1!important}
    #weddingCameraDialog .frame-date{position:absolute!important;top:clamp(48px,9vw,82px)!important;left:0!important;right:0!important;text-align:center!important;font-size:clamp(.72rem,2.6vw,1.05rem)!important;letter-spacing:.16em!important}
    #weddingCameraDialog .frame-caption{position:absolute!important;bottom:clamp(12px,2.8vw,26px)!important;left:12px!important;right:12px!important;text-align:center!important;font-size:clamp(.72rem,2.8vw,1.05rem)!important}
    #weddingCameraDialog .camera-actions{display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:10px!important;margin-top:14px!important}
    #weddingCameraDialog .camera-actions .hidden{display:none!important}
    @media(max-width:600px){
      #weddingCameraDialog{width:96vw!important;max-height:94dvh!important;padding:10px!important}
      #weddingCameraDialog .camera-shell,#weddingCameraDialog #weddingCanvas{width:92vw!important;max-height:68dvh!important;border-radius:14px!important}
      #weddingCameraDialog #weddingVideo{max-height:68dvh!important}
      #weddingCameraDialog .wedding-frame{inset:10px!important;border-width:2px!important}
      #weddingCameraDialog .frame-title{top:12px!important;font-size:clamp(1.55rem,8vw,2.45rem)!important}
      #weddingCameraDialog .frame-date{top:48px!important;font-size:.72rem!important}
      #weddingCameraDialog .frame-caption{bottom:12px!important;font-size:.72rem!important}
    }
  `;
  document.head.appendChild(style);

  function onLanguageChanged(){
    clearMission();
    setVoiceLabels();
    if (sharePhotoButton && !cameraUploaded) sharePhotoButton.textContent = language()==='en' ? 'Send photo to us' : 'حفظ الصورة عندنا';
    if (savePhotoButton) savePhotoButton.textContent = language()==='en' ? 'Save a copy' : 'حفظ نسخة على جهازي';
  }
  new MutationObserver(onLanguageChanged).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  setVoiceLabels();
  onLanguageChanged();
})();