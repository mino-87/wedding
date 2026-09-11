(() => {
  const $ = s => document.querySelector(s);
  const surprise = $('#surpriseVideo');
  const gate = $('#gate');
  const invitation = $('#invitation');
  const dialog = $('#smileDialog');
  const status = $('#smileStatus');
  const smileVideo = $('#smileVideo');
  const config = window.WEDDING_CONFIG || {};
  let stream, detector, raf, smileSince = 0, unlocking = false;

  function stopCamera(){ cancelAnimationFrame(raf); stream?.getTracks?.().forEach(t => t.stop()); stream = null; if (smileVideo) smileVideo.srcObject = null; }
  function primeVideo(){
    if(!surprise) return;
    try {
      surprise.preload = 'auto';
      surprise.muted = true;
      surprise.volume = 1;
      const p = surprise.play();
      p?.catch?.(() => {});
    } catch(_) {}
  }
  function addSoundFallback(){
    let b = $('#soundStartFallback');
    if(!b && surprise){
      b = document.createElement('button');
      b.id = 'soundStartFallback';
      b.className = 'primary';
      b.type = 'button';
      b.textContent = '🔊 شغّل المفاجأة بالصوت';
      surprise.insertAdjacentElement('afterend', b);
      b.addEventListener('click', async () => {
        try { surprise.muted = false; surprise.volume = 1; await surprise.play(); b.remove(); }
        catch(_) {}
      });
    }
  }
  async function playSurprise(){
    if(!surprise) return;
    surprise.currentTime = 0;
    surprise.muted = false;
    surprise.volume = 1;
    try { await surprise.play(); }
    catch(_) { addSoundFallback(); }
  }
  async function unlock(){
    if(unlocking) return;
    unlocking = true;
    stopCamera();
    if(dialog?.open) dialog.close();
    gate?.classList.add('hidden');
    invitation?.classList.remove('hidden');
    window.scrollTo(0,0);
    await playSurprise();
  }
  function score(c,n){ return c?.find(x => x.categoryName === n)?.score || 0; }
  async function getDetector(){
    if(detector) return detector;
    const m = await import(config.faceTasksVisionModuleUrl);
    const vision = await m.FilesetResolver.forVisionTasks(config.faceTasksVisionBaseUrl);
    detector = await m.FaceLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:config.faceLandmarkerModelUrl,delegate:'GPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:true});
    return detector;
  }
  function loop(){
    if(!stream || !detector || smileVideo.readyState < 2){ raf = requestAnimationFrame(loop); return; }
    try {
      const now = performance.now();
      const r = detector.detectForVideo(smileVideo, now);
      const c = r.faceBlendshapes?.[0]?.categories;
      const s = c?.length ? (score(c,'mouthSmileLeft') + score(c,'mouthSmileRight')) / 2 : 0;
      if(s >= 0.42){
        if(!smileSince) smileSince = now;
        const held = now - smileSince;
        const pct = Math.min(100, Math.round(held / 30));
        status.textContent = held < 3000 ? 'خليك مبتسم… Scan ' + pct + '% 😄' : 'الضحكة اتأكدت… المفاجأة بتبدأ 🎬';
        if(held >= 3000){ unlock(); return; }
      } else {
        smileSince = 0;
        status.textContent = 'ابتسم للكاميرا وخليك ثابت 3 ثواني 😄';
      }
    } catch(_) {}
    raf = requestAnimationFrame(loop);
  }
  async function start(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    unlocking = false;
    primeVideo();
    if(!dialog.open) dialog.showModal();
    status.textContent = 'جارٍ تجهيز الكاميرا…';
    try {
      stopCamera();
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
      smileVideo.srcObject = stream;
      await smileVideo.play();
      status.textContent = 'ابتسم وخليك ثابت 3 ثواني 😄';
      await getDetector();
      loop();
    } catch(_) {
      status.textContent = 'تعذر تشغيل الفحص التلقائي. استخدم الزر البديل.';
      $('#smileFallback')?.classList.remove('hidden');
    }
  }
  $('#startSmile')?.addEventListener('click',start,true);
  $('#manualUnlock')?.addEventListener('click',e => { e.preventDefault(); e.stopImmediatePropagation(); primeVideo(); unlock(); },true);
  $('#smileFallback')?.addEventListener('click',e => { e.preventDefault(); e.stopImmediatePropagation(); primeVideo(); unlock(); },true);
  dialog?.addEventListener('close',stopCamera);
  try { sessionStorage.removeItem('wedding-unlocked'); } catch(_) {}
})();
