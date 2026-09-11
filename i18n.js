(() => {
  const dict = {
    ar: {
      dir:'rtl',lang:'ar',
      gateEyebrow:'SMILE TO UNLOCK',gateTitleSub:'الدعوة دي ما بتفتحش بالمجاملة',gateBody:'عايزين ضحكة حقيقية للكاميرا… ولما نتأكد منها، الدعوة تفتح.',startCamera:'افتح الكاميرا وابتسم',manualUnlock:'فتح الدعوة يدويًا',privacy:'الكاميرا تُستخدم على جهازك فقط لاكتشاف الابتسامة، ولا يتم رفع أو حفظ صورتك.',smileFallback:'أنا ابتسمت — افتح الدعوة',
      introTitle:'اليوم اللي مستنيينه',introBody:'وجودكم هو اللي هيكمل اليوم. تعالوا نعمل ذكرى نفضل نفتكرها كلنا.',
      surpriseLabel:'A LITTLE SURPRISE',surpriseTitle:'المفاجأة بدأت',surpriseBody:'شغّل الصوت… دي أول لقطة من الحكاية.',videoUnsupported:'متصفحك لا يدعم تشغيل الفيديو.',
      officialTitle:'أوكيه… رسميًّا!',officialBody:'مستنيينكم تشاركونا بداية أحلى فصل في حكايتنا.',dayLabel:'اليوم',dayValue:'الخميس، 24 سبتمبر 2026',timeLabel:'الوقت',timeValue:'5:00 مساءً',placeLabel:'المكان',placeValue:'كنيسة الملاك – شيراتون، القاهرة',openLocation:'افتح الموقع على الخريطة',days:'يوم',hours:'ساعة',minutes:'دقيقة',seconds:'ثانية',countdownDone:'النهارده اليوم الكبير ♥',
      rsvpTitle:'هنشوفك معانا؟',rsvpLead:'أكد حضورك قبل الخميس 17 سبتمبر 2026.',nameLabel:'اسمك',namePlaceholder:'اكتب اسمك',attendanceQuestion:'هتقدر تحضر؟',yesTitle:'أيوه، جاي',yesSub:'مستنيينك تنورنا',noTitle:'للأسف مش هقدر',noSub:'هتوحشنا',companionsLabel:'عدد المرافقين',companionsHint:'من غير ما تحسب نفسك.',confirmRsvp:'تأكيد الرد',yes:'فرحتنا هتكمل بيكم. مستنيينكم منورين ✨',no:'هتوحشونا، بس أكيد هتفضلوا جزء من اليوم بقلوبكم.',
      missionTitle:'مهمتك السرية',missionBody:'لكل ضيف مهمة صغيرة يوم الفرح. خلّصها من غير ما حد ياخد باله، وصوّر النتيجة.',missionButton:'هات المهمة',
      dropTitle:'Wedding Drop',dropBody:'عندك لقطة حلوة أو فيديو من اليوم؟ ابعتهولنا هنا مباشرة.',dropChoose:'اختار صور أو فيديوهات',dropHint:'من الموبايل أو الكمبيوتر',sendMedia:'إرسال الملفات',
      voiceTitle:'قولها… متكتبهاش',voiceBody:'سيب لنا فويس نسمعه بعد الفرح: كلمة من القلب، دعوة حلوة، أو نصيحة تستاهل تتسجل.',recordStatus:'اضغط وابدأ التسجيل. تقدر تسمعه قبل ما تبعته.',shareRecording:'إرسال الفويس',saveRecording:'حفظ على الجهاز',deleteRecording:'مسح وإعادة التسجيل',
      cameraTitle:'صورتك من قلب اليوم',cameraBody:'افتح الكاميرا وخد صورة بإطار David & Diana الخاص بالفرح.',openWeddingCamera:'افتح Wedding Camera',switchCamera:'تبديل الكاميرا',capturePhoto:'صوّر',retakePhoto:'إعادة التصوير',savePhoto:'حفظ الصورة',sharePhoto:'مشاركة الصورة'
    },
    en: {
      dir:'ltr',lang:'en',
      gateEyebrow:'SMILE TO UNLOCK',gateTitleSub:'This invitation needs a real smile',gateBody:'Give the camera a genuine smile. Once we verify it, the invitation opens.',startCamera:'Open camera & smile',manualUnlock:'Open invitation manually',privacy:'Your camera is used only on this device to detect your smile. Nothing is uploaded or saved.',smileFallback:'I smiled — open the invitation',
      introTitle:'The day we have been waiting for',introBody:'Having you there is what will make the day complete. Come make a memory with us.',
      surpriseLabel:'A LITTLE SURPRISE',surpriseTitle:'The surprise starts here',surpriseBody:'Turn the sound on… this is the first scene of the story.',videoUnsupported:'Your browser does not support this video.',
      officialTitle:'Okay… it’s official!',officialBody:'We cannot wait to celebrate the beginning of our next chapter with you.',dayLabel:'Day',dayValue:'Thursday, 24 September 2026',timeLabel:'Time',timeValue:'5:00 PM',placeLabel:'Place',placeValue:'Archangel Michael Church — Sheraton, Cairo',openLocation:'Open location in Maps',days:'Days',hours:'Hours',minutes:'Minutes',seconds:'Seconds',countdownDone:'Today is the big day ♥',
      rsvpTitle:'Will we see you there?',rsvpLead:'Please confirm by Thursday, 17 September 2026.',nameLabel:'Your name',namePlaceholder:'Enter your name',attendanceQuestion:'Will you be able to join us?',yesTitle:'Yes, I’ll be there',yesSub:'We can’t wait to see you',noTitle:'Sadly, I can’t make it',noSub:'We’ll miss you',companionsLabel:'Number of guests with you',companionsHint:'Do not include yourself.',confirmRsvp:'Confirm response',yes:'Our celebration will be brighter with you. See you there ✨',no:'We’ll miss you, but you’ll still be part of the day in spirit.',
      missionTitle:'Your secret mission',missionBody:'Every guest gets one small wedding mission. Complete it without getting caught, then capture the result.',missionButton:'Get my mission',
      dropTitle:'Wedding Drop',dropBody:'Caught a great photo or video today? Send it to us directly here.',dropChoose:'Choose photos or videos',dropHint:'From your phone or computer',sendMedia:'Send files',
      voiceTitle:'Say it, don’t type it',voiceBody:'Leave us a voice note for after the wedding: something from the heart, a wish, or advice worth saving.',recordStatus:'Tap to start recording. You can listen before sending it.',shareRecording:'Send voice note',saveRecording:'Save to device',deleteRecording:'Delete & record again',
      cameraTitle:'Your photo from the day',cameraBody:'Open the camera and take a photo with the David & Diana wedding frame.',openWeddingCamera:'Open Wedding Camera',switchCamera:'Switch camera',capturePhoto:'Take photo',retakePhoto:'Retake',savePhoto:'Save photo',sharePhoto:'Share photo'
    }
  };

  const missions = {
    ar:['صوّر أحلى ضحكة عفوية للعريس أو العروسة من غير ما ياخدوا بالهم.','هات صورة تجمع 3 أجيال من العيلة في لقطة واحدة.','اكتشف مين أكتر واحد بيرقص بحماس وصوّر له فيديو 5 ثواني.','خلّي شخصين مايعرفوش بعض يعملوا صورة مضحكة سوا.','صوّر أجمل تفصيلة في الديكور محدش واخد باله منها.','سجّل كلمة سريعة من حد كبير في العيلة للعروسين.','التقط صورة لحد بيضحك من قلبه من غير ما يبص للكاميرا.','اعمل selfie مع شخص أول مرة تقابله في الفرح.','صوّر لحظة لطيفة بين طفل وأحد الكبار.','لقطة سينمائية لمدة 5 ثواني للمكان قبل ما يزحم.','خلي مجموعة تعمل قلب بإيديها وصوّرهم.','صوّر العريس والعروسة من زاوية غير متوقعة لكن لطيفة.'],
    en:['Capture the bride or groom laughing naturally without them noticing.','Get one photo with three generations of the family together.','Find the most energetic dancer and record a 5-second clip.','Get two people who have never met to take a funny photo together.','Photograph the best decor detail most people have missed.','Record a quick message for the couple from an older family member.','Capture someone laughing genuinely without looking at the camera.','Take a selfie with someone you met for the first time today.','Capture a sweet moment between a child and an older guest.','Film a 5-second cinematic shot of the venue before it gets crowded.','Get a group to make a heart with their hands and photograph them.','Take a creative, flattering photo of David and Diana from an unexpected angle.']
  };

  let current = localStorage.getItem('wedding-language') || 'ar';
  let lastMission = -1;
  const $all = s => [...document.querySelectorAll(s)];
  const t = key => dict[current]?.[key] || key;

  function setLanguage(lang){
    current = dict[lang] ? lang : 'ar';
    const tr = dict[current];
    document.documentElement.lang = tr.lang;
    document.documentElement.dir = tr.dir;
    document.body.dataset.language = current;
    localStorage.setItem('wedding-language',current);
    $all('[data-i18n]').forEach(el => { const value=tr[el.dataset.i18n]; if(value) el.textContent=value; });
    $all('[data-i18n-placeholder]').forEach(el => { const value=tr[el.dataset.i18nPlaceholder]; if(value) el.placeholder=value; });
    $all('.language-toggle').forEach(btn => { const active=btn.dataset.lang===current; btn.classList.toggle('active',active); btn.setAttribute('aria-pressed',String(active)); });
    updateRsvpFeedback();
  }

  function updateRsvpFeedback(){
    const feedback=document.getElementById('rsvpFeedback');
    const checked=document.querySelector('input[name="attending"]:checked');
    if(!feedback||!checked)return;
    feedback.textContent=checked.value==='yes'?dict[current].yes:dict[current].no;
    feedback.className='rsvp-feedback '+(checked.value==='yes'?'is-yes':'is-no');
  }

  function addCelebration(){
    const box=document.getElementById('rsvpFeedback');
    if(!box)return;
    box.animate?.([{transform:'scale(.97)',opacity:.55},{transform:'scale(1)',opacity:1}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});
    if(document.querySelector('input[name="attending"]:checked')?.value==='yes'){
      for(let i=0;i<10;i++){const piece=document.createElement('i');piece.className='confetti-piece';piece.style.setProperty('--i',i);piece.textContent=['✦','·','♥'][i%3];box.append(piece);setTimeout(()=>piece.remove(),900)}
    }
  }

  function handleMission(e){
    e.preventDefault();e.stopImmediatePropagation();
    const list=missions[current];let i;do{i=Math.floor(Math.random()*list.length)}while(list.length>1&&i===lastMission);lastMission=i;
    const card=document.getElementById('missionCard');if(!card)return;card.textContent='🎯 '+list[i];card.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded',()=>{
    $all('.language-toggle').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
    $all('input[name="attending"]').forEach(input=>input.addEventListener('change',()=>{updateRsvpFeedback();addCelebration()}));
    document.getElementById('missionButton')?.addEventListener('click',handleMission,true);
    setLanguage(current);
  });

  window.WEDDING_I18N={get language(){return current},setLanguage,t,dict};
})();