(() => {
  const $ = s => document.querySelector(s);
  const surprise = $('#surpriseVideo');
  const gate = $('#gate');
  const invitation = $('#invitation');
  const dialog = $('#smileDialog');
  const status = $('#smileStatus');
  const smileVideo = $('#smileVideo');
  const meter = $('#scanMeterFill');
  const config = window.WEDDING_CONFIG || {};
  let stream, detector, raf, smileSince = 0, unlocking = false;

  const isEn = () => document.documentElement.lang === 'en';
  const text = (ar,en) => isEn() ? en : ar;
  const setStatus = (ar,en) => { if(status) status.textContent=text(ar,en); };
  const setMeter = pct => { if(meter) meter.style.width = `${Math.max(0,Math.min(100,pct))}%`; };

  function stopCamera(){
    cancelAnimationFrame(raf);
    stream?.getTracks?.().forEach(t=>t.stop());
    stream=null;
    smileSince=0;
    setMeter(0);
    if(smileVideo)smileVideo.srcObject=null;
  }

  function primeVideo(){
    if(!surprise)return;
    try{
      surprise.preload='auto';
      surprise.volume=1;
      surprise.muted=true;
      surprise.currentTime=0;
      const p=surprise.play();
      p?.then(()=>{surprise.pause();surprise.currentTime=0}).catch(()=>{});
    }catch(_){}
  }

  function addSoundFallback(){
    let b=$('#soundStartFallback');
    if(!b&&surprise){
      b=document.createElement('button');
      b.id='soundStartFallback';
      b.className='primary';
      b.type='button';
      b.textContent=text('شغّل المفاجأة بالصوت','Play surprise with sound');
      surprise.insertAdjacentElement('afterend',b);
      b.addEventListener('click',async()=>{
        try{surprise.muted=false;surprise.volume=1;await surprise.play();b.remove()}catch(_){}
      });
    }
  }

  async function playSurprise(){
    if(!surprise)return;
    surprise.currentTime=0;
    surprise.muted=false;
    surprise.volume=1;
    try{await surprise.play()}
    catch(_){addSoundFallback()}
  }

  async function unlock(){
    if(unlocking)return;
    unlocking=true;
    stopCamera();
    if(dialog?.open)dialog.close();
    gate?.classList.add('hidden');
    invitation?.classList.remove('hidden');
    window.scrollTo({top:0,left:0,behavior:'instant'});
    await playSurprise();
    unlocking=false;
  }

  function score(c,n){return c?.find(x=>x.categoryName===n)?.score||0}
  async function getDetector(){
    if(detector)return detector;
    const m=await import(config.faceTasksVisionModuleUrl);
    const vision=await m.FilesetResolver.forVisionTasks(config.faceTasksVisionBaseUrl);
    detector=await m.FaceLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:config.faceLandmarkerModelUrl,delegate:'GPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:true});
    return detector;
  }

  function loop(){
    if(!stream||!detector||smileVideo.readyState<2){raf=requestAnimationFrame(loop);return}
    try{
      const now=performance.now();
      const r=detector.detectForVideo(smileVideo,now);
      const c=r.faceBlendshapes?.[0]?.categories;
      const s=c?.length?(score(c,'mouthSmileLeft')+score(c,'mouthSmileRight'))/2:0;
      const threshold=Number(config.smileThreshold||.46);
      const hold=Number(config.smileHoldMs||3000);
      if(s>=threshold){
        if(!smileSince)smileSince=now;
        const held=now-smileSince;
        const pct=Math.min(100,Math.round((held/hold)*100));
        setMeter(pct);
        setStatus(`خليك مبتسم… بنعمل Scan ${pct}%`,`Keep smiling… scanning ${pct}%`);
        if(held>=hold){setStatus('تمام. الضحكة اتأكدت… المفاجأة بتبدأ','Perfect. Smile verified… starting the surprise');setMeter(100);unlock();return}
      }else{
        smileSince=0;setMeter(0);
        setStatus('ابتسم للكاميرا وخليك ثابت 3 ثواني','Smile at the camera and hold it for 3 seconds');
      }
    }catch(_){}
    raf=requestAnimationFrame(loop);
  }

  async function start(e){
    e?.preventDefault();e?.stopImmediatePropagation();
    unlocking=false;primeVideo();smileSince=0;setMeter(0);
    $('#smileFallback')?.classList.add('hidden');
    if(!dialog.open)dialog.showModal();
    setStatus('جارٍ تجهيز الكاميرا…','Preparing camera…');
    try{
      stopCamera();
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:960}},audio:false});
      smileVideo.srcObject=stream;
      await smileVideo.play();
      setStatus('ابتسم وخليك ثابت 3 ثواني','Smile and hold it for 3 seconds');
      await getDetector();
      loop();
      setTimeout(()=>{if(stream&&!unlocking)$('#smileFallback')?.classList.remove('hidden')},15000);
    }catch(_){
      setStatus('تعذر تشغيل الفحص التلقائي. استخدم الزر البديل.','Automatic smile scan could not start. Use the fallback button.');
      $('#smileFallback')?.classList.remove('hidden');
    }
  }

  $('#startSmile')?.addEventListener('click',start,true);
  $('#reopenSmile')?.addEventListener('click',start,true);
  $('#manualUnlock')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();primeVideo();unlock()},true);
  $('#smileFallback')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();primeVideo();unlock()},true);
  dialog?.addEventListener('close',stopCamera);
  try{sessionStorage.removeItem('wedding-unlocked')}catch(_){}
})();