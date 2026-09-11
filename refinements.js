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

  new MutationObserver(clearMission).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();