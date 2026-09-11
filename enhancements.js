(() => {
  try { sessionStorage.removeItem('wedding-unlocked'); } catch {}

  const CONFIG = window.WEDDING_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const gate = $('#gate');
  const invitation = $('#invitation');
  const smileDialog = $('#smileDialog');
  const smileVideo = $('#smileVideo');
  const smileStatus = $('#smileStatus');
  const fallback = $('#smileFallback');
  const surpriseVideo = $('#surpriseVideo');

  let stream = null;
  let landmarker = null;
  let raf = 0;
  let scanStarted = 0;
  let holdStarted = 0;
  let unlocking = false;

  const stopStream = () => {
    cancelAnimationFrame(raf);
    stream?.getTracks?.().forEach(t => t.stop());
    stream = null;
    if (smileVideo) smileVideo.srcObject = null;
  };

  async function openInvitation() {
    if (unlocking) return;
    unlocking = true;
    stopStream();
    if (smileDialog?.open) smileDialog.close();
    gate?.classList.add('hidden');
    invitation?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (surpriseVideo) {
      surpriseVideo.currentTime = 0;
      surpriseVideo.volume = 1;
      surpriseVideo.muted = false;
      surpriseVideo.setAttribute('autoplay', '');
      try {
        await surpriseVideo.play();
      } catch (err) {
        console.warn('Sound autoplay blocked; retrying muted', err);
        surpriseVideo.muted = true;
        try { await surpriseVideo.play(); } catch {}
      }
    }
    unlocking = false;
  }

  async function getLandmarker() {
    if (landmarker) return landmarker;
    const visionModule = await import(CONFIG.faceTasksVisionModuleUrl);
    const { FaceLandmarker, FilesetResolver } = visionModule;
    const vision = await FilesetResolver.forVisionTasks(CONFIG.faceTasksVisionBaseUrl);
    landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: CONFIG.faceLandmarkerModelUrl, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
    });
    return landmarker;
  }

  function score(categories, name) {
    return categories?.find(c => c.categoryName === name)?.score ?? 0;
  }

  function scanLoop() {
    if (!stream || !landmarker || smileVideo.readyState < 2) {
      raf = requestAnimationFrame(scanLoop);
      return;
    }
    try {
      const now = performance.now();
      const result = landmarker.detectForVideo(smileVideo, now);
      const cats = result.faceBlendshapes?.[0]?.categories;
      const smile = cats?.length ? (score(cats, 'mouthSmileLeft') + score(cats, 'mouthSmileRight')) / 2 : 0;
      if (smile >= 0.42) {
        if (!holdStarted) holdStarted = now;
        const held = now - holdStarted;
        const needed = 2800;
        const remaining = Math.max(0, Math.ceil((needed - held) / 1000));
        smileStatus.textContent = remaining > 0 ? `خليك مبتسم… بنعمل Scan ${remaining} 😄` : 'تمام… الضحكة اتأكدت 😄';
        if (held >= needed) {
          smileStatus.textContent = 'تم التأكيد… المفاجأة بتبدأ 🎬';
          setTimeout(openInvitation, 250);
          return;
        }
      } else {
        holdStarted = 0;
        smileStatus.textContent = 'ابتسم للكاميرا وخليك ثابت شوية 😄';
      }
      if (now - scanStarted > 10000) fallback?.classList.remove('hidden');
      raf = requestAnimationFrame(scanLoop);
    } catch (e) {
      console.error(e);
      fallback?.classList.remove('hidden');
      raf = requestAnimationFrame(scanLoop);
    }
  }

  async function beginScan(event) {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    unlocking = false;
    holdStarted = 0;
    fallback?.classList.add('hidden');
    if (!smileDialog.open) smileDialog.showModal();
    smileStatus.textContent = 'جارٍ تجهيز الكاميرا…';
    try {
      stopStream();
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      smileVideo.srcObject = stream;
      await smileVideo.play();
      smileStatus.textContent = 'بص للكاميرا وابتسم… هنفحص الضحكة كام ثانية 😄';
      scanStarted = performance.now();
      await getLandmarker();
      scanLoop();
    } catch (e) {
      console.error(e);
      smileStatus.textContent = 'تعذر تشغيل فحص الابتسامة على الجهاز ده. استخدم الزر البديل.';
      fallback?.classList.remove('hidden');
    }
  }

  ['#startSmile', '#reopenSmile'].forEach(sel => {
    $(sel)?.addEventListener('click', beginScan, true);
  });
  $('#manualUnlock')?.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); openInvitation(); }, true);
  fallback?.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); openInvitation(); }, true);
  smileDialog?.addEventListener('close', stopStream);

  const form = $('#rsvpForm');
  const status = $('#rsvpStatus');
  const companionsWrap = $('#companionsWrap');
  const companions = $('#rsvpCompanions');
  const deadline = new Date('2026-09-17T23:59:59+03:00');

  function syncAttendance() {
    const value = $('input[name="attending"]:checked')?.value;
    if (value === 'yes') {
      companionsWrap?.classList.remove('hidden');
      if (companions) companions.required = true;
    } else {
      companionsWrap?.classList.add('hidden');
      if (companions) { companions.required = false; companions.value = '0'; }
    }
  }
  $$('input[name="attending"]').forEach(r => r.addEventListener('change', syncAttendance));

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (Date.now() > deadline.getTime()) {
      status.textContent = 'انتهى موعد تأكيد الحضور يوم 17 سبتمبر.';
      return;
    }
    const name = $('#rsvpName')?.value.trim();
    const attending = $('input[name="attending"]:checked')?.value;
    const count = attending === 'yes' ? Math.max(0, Math.min(10, Number(companions?.value || 0))) : 0;
    if (!name || !attending) return;
    if (!CONFIG.rsvpEndpoint) {
      status.textContent = 'نموذج الحضور جاهز، لكن ربط الحفظ النهائي لسه محتاج نشر Google Apps Script.';
      return;
    }
    const submit = $('#rsvpSubmit');
    submit.disabled = true;
    status.textContent = 'بنحفظ ردك…';
    try {
      const body = new URLSearchParams({ name, attending, companions: String(count), source: 'wedding-site' });
      const response = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body, redirect: 'follow' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.error || 'save_failed');
      status.textContent = attending === 'yes' ? `تم ❤️ مستنيينك${count ? ` ومعاك ${count}` : ''}!` : 'تم تسجيل ردك. هنفتقدك ❤️';
      form.reset();
      syncAttendance();
    } catch (err) {
      console.error(err);
      status.textContent = 'حصلت مشكلة في حفظ الرد. جرّب تاني.';
    } finally {
      submit.disabled = false;
    }
  });
})();