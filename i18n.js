(() => {
  const dict = {
    ar: {
      dir:'rtl',lang:'ar',switchLabel:'EN',
      gateEyebrow:'ابتسم علشان تفتح الدعوة 💍',
      gateTitleSub:'الدعوة دي ما بتفتحش بالمجاملة',
      gateBody:'عايزين ضحكة حقيقية للكاميرا… خليك مبتسم كام ثانية والدعوة هتفتح.',
      startCamera:'افتح الكاميرا',
      privacy:'الكاميرا شغالة على جهازك فقط لاكتشاف الابتسامة، ومفيش صورة بتتحفظ أو بتترفع.',
      smileFallback:'حاول مرة تانية',
      saveDate:'SAVE THE DATE',month:'SEPTEMBER',
      officialBody:'مستنيينكم تشاركونا اليوم اللي هنبدأ فيه فصل جديد من حكايتنا.',
      timeLabel:'الوقت',timeValue:'5:00 مساءً',placeLabel:'المكان',placeValue:'كنيسة الملاك – شيراتون، القاهرة',
      openLocation:'عرض الموقع على الخريطة ↗',days:'يوم',hours:'ساعة',minutes:'دقيقة',seconds:'ثانية',countdownDone:'النهارده اليوم الكبير ❤️',
      surpriseLabel:'A LITTLE SURPRISE',surpriseTitle:'المفاجأة بدأت',
      attendanceLabel:'تأكيد الحضور',rsvpTitle:'هتكون معانا؟',rsvpLead:'اختار ردك وسجّل اسمك قبل الخميس 17 سبتمبر 2026.',
      attendYes:'أيوه، جاي',attendYesSub:'ومتحمس أفرح معاكم',attendNo:'للأسف مش هقدر',attendNoSub:'بس قلبي معاكم',
      nameLabel:'اسمك',namePlaceholder:'اكتب اسمك هنا',companionsLabel:'كام شخص جاي معاك؟',companionsHint:'اختار عدد المرافقين من غير ما تحسب نفسك.',confirmResponse:'تأكيد الرد',
      missionLabel:'SECRET MISSION',missionTitle:'مهمتك السرية في الفرح',missionBody:'كل ضيف له مهمة صغيرة. نفّذها من غير ما حد ياخد باله، وصوّر النتيجة.',missionButton:'هات المهمة',
      dropTitle:'سيب لنا اللحظة',dropBody:'صورة، فيديو، أو لقطة عفوية تستاهل تفضل معانا.',chooseMedia:'اختار صور أو فيديوهات',chooseMediaSub:'من الموبايل أو الكمبيوتر',sendMedia:'إرسال الملفات',
      voiceTitle:'قولها بصوتك',voiceBody:'سيب لنا كلمة نسمعها بعد الفرح: دعوة حلوة، ذكرى، أو نصيحة.',recordHint:'اضغط على الدائرة وابدأ التسجيل.',shareVoice:'إرسال الفويس',saveVoice:'حفظ عندي',redoVoice:'إعادة التسجيل',
      cameraTitle:'صورة من قلب اليوم',cameraBody:'افتح الكاميرا وخد صورة بإطار David & Diana.',openWeddingCamera:'افتح كاميرا الفرح',
      yesFeedback:'مستنيينك تنور اليوم معانا ✨',noFeedback:'هتوحشنا، وإن شاء الله نفرح مع بعض قريب 🤍'
    },
    en: {
      dir:'ltr',lang:'en',switchLabel:'AR',
      gateEyebrow:'SMILE TO UNLOCK 💍',
      gateTitleSub:'This invitation does not open for just any smile',
      gateBody:'Give the camera a real smile and hold it for a few seconds to unlock the invitation.',
      startCamera:'Open camera',
      privacy:'Smile detection happens only on your device. No photo is saved or uploaded.',
      smileFallback:'Try again',
      saveDate:'SAVE THE DATE',month:'SEPTEMBER',
      officialBody:'Join us for the day we begin a new chapter of our story.',
      timeLabel:'TIME',timeValue:'5:00 PM',placeLabel:'PLACE',placeValue:'Archangel Church — Sheraton, Cairo',
      openLocation:'View on Google Maps ↗',days:'DAYS',hours:'HOURS',minutes:'MINUTES',seconds:'SECONDS',countdownDone:'Today is the day ❤️',
      surpriseLabel:'A LITTLE SURPRISE',surpriseTitle:'The surprise begins',
      attendanceLabel:'CONFIRM ATTENDANCE',rsvpTitle:'Will you be there?',rsvpLead:'Choose your response and add your name by Thursday, 17 September 2026.',
      attendYes:'Yes, I’ll be there',attendYesSub:'Can’t wait to celebrate',attendNo:'Sadly, I can’t make it',attendNoSub:'I’ll be there in spirit',
      nameLabel:'Your name',namePlaceholder:'Type your name here',companionsLabel:'How many guests are coming with you?',companionsHint:'Choose the number of companions, not including yourself.',confirmResponse:'Confirm response',
      missionLabel:'SECRET MISSION',missionTitle:'Your secret wedding mission',missionBody:'Every guest gets a small mission. Complete it without getting caught and capture the result.',missionButton:'Give me a mission',
      dropTitle:'Leave us the moment',dropBody:'A photo, a video, or an unplanned moment worth keeping.',chooseMedia:'Choose photos or videos',chooseMediaSub:'From your phone or computer',sendMedia:'Send files',
      voiceTitle:'Say it in your voice',voiceBody:'Leave us something to listen to after the wedding: a wish, a memory, or a piece of advice.',recordHint:'Tap the circle to start recording.',shareVoice:'Send voice note',saveVoice:'Save to device',redoVoice:'Record again',
      cameraTitle:'A photo from the day',cameraBody:'Open the camera and take a photo with the David & Diana wedding frame.',openWeddingCamera:'Open wedding camera',
      yesFeedback:'We can’t wait to celebrate with you ✨',noFeedback:'We’ll miss you, and hope we celebrate together soon 🤍'
    }
  };
  let current = localStorage.getItem('wedding-language') || 'ar';
  const $all = s => [...document.querySelectorAll(s)];
  function applyText(t){
    $all('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(t[key]!==undefined)el.textContent=t[key];});
    $all('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(t[key]!==undefined)el.placeholder=t[key];});
  }
  function setLanguage(lang){
    current=dict[lang]?lang:'ar';
    const t=dict[current];
    document.documentElement.lang=t.lang;
    document.documentElement.dir=t.dir;
    document.body.dataset.language=current;
    localStorage.setItem('wedding-language',current);
    applyText(t);
    const floating=document.getElementById('floatingLanguage');
    if(floating) floating.textContent=t.switchLabel;
    updateRsvpFeedback();
  }
  function updateRsvpFeedback(){
    const feedback=document.getElementById('rsvpFeedback');
    const checked=document.querySelector('input[name="attending"]:checked');
    if(!feedback){return;}
    if(!checked){feedback.textContent='';return;}
    feedback.textContent=checked.value==='yes'?dict[current].yesFeedback:dict[current].noFeedback;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('floatingLanguage')?.addEventListener('click',()=>setLanguage(current==='ar'?'en':'ar'));
    $all('input[name="attending"]').forEach(input=>input.addEventListener('change',updateRsvpFeedback));
    setLanguage(current);
  });
  window.WEDDING_I18N={get language(){return current;},setLanguage};
})();