(() => {
  const $ = s => document.querySelector(s);
  const gate = $('#gate');
  const invitation = $('#invitation');
  const dialog = $('#smileDialog');
  const smileVideo = $('#smileVideo');
  const status = $('#smileStatus');
  const meter = $('#scanMeterFill');
  const fallback = $('#smileFallback');
  const manual = $('#manualUnlock');
  const surprise = $('#surpriseVideo');
  const config = window.WEDDING_CONFIG || {};
  let stream = null;
  let detector = null;
  let raf = 0;
  let smileSince = 0;
  let unlocking = false;

  function stopCamera(){
    cancelAnimationFrame(raf);
    stream?.getTracks?.().forEach(t => t.stop());
    stream = null;
    if(smileVideo) smileVideo.srcObject = null;
  }
  function hideGateForCamera(){ gate?.classList.add('camera-active'); }
  function restoreGate(){ if(!unlocking) gate?.classList.remove('camera-active'); }
  function setMeter(value){ if(meter) meter.style.width = `${Math.max(0,Math.min(100,value))}%`; }
  function primeSurprise(){
    if(!surprise) return;
    try{surprise.preload='auto';surprise.volume=1;surprise.muted=true;const p=surprise.play();p?.then?.(()=>{surprise.pause();surprise.currentTime=0;}).catch?.(()=>{});}catch{}
  }
  async function playSurpriseWithSound(){
    if(!surprise) return;
    surprise.currentTime=0;surprise.volume=1;surprise.muted=false;
    try{await surprise.play();return;}catch{}
    let button=$('#soundStartFallback');
    if(!button){button=document.createElement('button');button.id='soundStartFallback';button.type='button';button.className='primary';button.textContent=document.documentElement.lang==='en'?'Play surprise with sound':'شغّل المفاجأة بالصوت';surprise.insertAdjacentElement('afterend',button);button.addEventListener('click',async()=>{try{surprise.muted=false;surprise.volume=1;await surprise.play();button.remove();}catch{}});}
  }
  async function unlock(){
    if(unlocking) return;
    unlocking=true;stopCamera();
    if(dialog?.open) dialog.close();
    gate?.classList.remove('camera-active');gate?.classList.add('hidden');
    invitation?.classList.remove('hidden');
    window.scrollTo({top:0,left:0,behavior:'instant'});
    await playSurpriseWithSound();unlocking=false;
  }
  function score(categories,name){return categories?.find(x=>x.categoryName===name)?.score||0;}
  async function getDetector(){if(detector)return detector;const m=await import(config.faceTasksVisionModuleUrl);const vision=await m.FilesetResolver.forVisionTasks(config.faceTasksVisionBaseUrl);detector=await m.FaceLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:config.faceLandmarkerModelUrl,delegate:'GPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:true});return detector;}
  function loop(){
    if(!stream||!detector||smileVideo.readyState<2){raf=requestAnimationFrame(loop);return;}
    try{const now=performance.now();const result=detector.detectForVideo(smileVideo,now);const cats=result.faceBlendshapes?.[0]?.categories;const smile=cats?.length?(score(cats,'mouthSmileLeft')+score(cats,'mouthSmileRight'))/2:0;const threshold=Number(config.smileThreshold||.46);const holdMs=Number(config.smileHoldMs||3000);if(smile>=threshold){if(!smileSince)smileSince=now;const held=now-smileSince;setMeter(Math.min(100,(held/holdMs)*100));const remaining=Math.max(0,Math.ceil((holdMs-held)/1000));if(status)status.textContent=remaining>0?(document.documentElement.lang==='en'?`Hold the smile… ${remaining}`:`ثبت الضحكة… ${remaining}`):(document.documentElement.lang==='en'?'Perfect. Opening…':'تمام… بنفتح الدعوة');if(held>=holdMs){unlock();return;}}else{smileSince=0;setMeter(0);if(status)status.textContent=document.documentElement.lang==='en'?'Smile and hold it for 3 seconds':'ابتسم وخليك ثابت 3 ثواني';}}catch{}
    raf=requestAnimationFrame(loop);
  }
  async function startScan(e){
    e?.preventDefault?.();e?.stopImmediatePropagation?.();unlocking=false;smileSince=0;setMeter(0);fallback?.classList.add('hidden');primeSurprise();hideGateForCamera();
    if(dialog&&!dialog.open)dialog.showModal();
    if(status)status.textContent=document.documentElement.lang==='en'?'Preparing camera…':'جارٍ تجهيز الكاميرا…';
    try{stopCamera();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:960}},audio:false});smileVideo.srcObject=stream;await smileVideo.play();await getDetector();if(status)status.textContent=document.documentElement.lang==='en'?'Smile and hold it for 3 seconds':'ابتسم وخليك ثابت 3 ثواني';loop();}catch(err){console.error(err);setMeter(0);if(status)status.textContent=document.documentElement.lang==='en'?'Camera could not start. Check permission and try again.':'الكاميرا ما اشتغلتش. راجع صلاحية الكاميرا وحاول تاني.';fallback?.classList.remove('hidden');}
  }
  $('#startSmile')?.addEventListener('click',startScan,true);
  fallback?.addEventListener('click',startScan,true);
  manual?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  dialog?.addEventListener('close',()=>{stopCamera();restoreGate();});
  try{sessionStorage.removeItem('wedding-unlocked');}catch{}
  if(manual)manual.classList.add('hidden');
})();