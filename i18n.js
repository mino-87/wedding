(() => {
  const translations = {
    ar: {
      gateEyebrow:'SMILE TO UNLOCK 💍',
      gateTitle:'David <span>&amp;</span> Diana',
      gateSubtitle:'الدعوة دي ما بتفتحش بالمجاملة 😏',
      gateText:'عايزين ضحكة حقيقية للكاميرا… ولما نصدقك، الدعوة تفتح 😄',
      openCamera:'📷 افتح الكاميرا',
      manualUnlock:'الكاميرا مش متعاونة؟ افتح الدعوة يدويًا',
      privacy:'الكاميرا تُستخدم على جهازك فقط لاكتشاف الابتسامة، ولا يتم رفع أو حفظ صورتك.',
      smileFallback:'أنا ابتسمت 😄 — افتح الدعوة',
      heroKicker:'THE WEDDING OF',
      heroRsvp:'أكد حضورك ↓',
      movieLine:'🎬 المفاجأة بدأت!',
      saveDateEyebrow:'SAVE THE DATE',
      saveDateTitle:'Okay… it’s official!',
      saveDateLead:'وأخيرًا جه اليوم 😄 مستنيينكم تشاركونا بداية أحلى فصل في حكايتنا وتخلّوا اليوم أحلى بوجودكم.',
      dayLabel:'DAY', dayValue:'الخميس 24 سبتمبر 2026',
      timeLabel:'TIME', timeValue:'5:00 مساءً',
      placeLabel:'PLACE', placeValue:'كنيسة الملاك – شيراتون، القاهرة',
      map:'📍 افتح الموقع',
      countdownDone:'النهارده اليوم الكبير ❤️',
      rsvpEyebrow:'RSVP', rsvpTitle:'جايين نفرح سوا؟',
      rsvpLead:'أكدوا حضوركم قبل يوم الخميس 17 سبتمبر 2026.',
      nameLabel:'الاسم', namePlaceholder:'اكتب اسمك',
      attendingLegend:'هل هتقدر تحضر؟',
      attendingYes:'أيوه، جاي ❤️', attendingNo:'للأسف مش هقدر',
      companionsLabel:'عدد المرافقين',
      companionsHint:'اكتب عدد الأشخاص اللي جايين معاك، من غير ما تحسب نفسك.',
      submitRsvp:'تأكيد الرد',
      missionTitle:'مهمتك السرية في الفرح 🕵️',
      missionText:'لكل ضيف مهمة صغيرة ولذيذة يوم الفرح 😏 نفّذها من غير ما حد ياخد باله. وبعد ما تخلص مهمتك، صوّرها وحطّها في Wedding Drop ❤️',
      missionButton:'🎯 هات المهمة',
      dropTitle:'Wedding Drop',
      dropText:'اختاروا اللقطات من الموبايل وابعثوها لنا مباشرة ❤️',
      chooseFiles:'＋ اختار صور أو فيديوهات',
      chooseFilesHint:'من Gallery الموبايل أو الكمبيوتر',
      sendFiles:'إرسال الصور / الفيديوهات',
      voiceTitle:'Say it, don’t type it',
      voiceText:'سيبوا لنا فويس نسمعه بعد الفرح: دعوة حلوة، كلمة من القلب، أو نصيحة للمبتدئين في الحياة الزوجية 😂❤️',
      voiceStatus:'اضغط وابدأ التسجيل — وتقدر تسمعه قبل ما تشاركه.',
      shareVoice:'مشاركة الفويس', saveVoice:'حفظ الفويس', deleteVoice:'مسح وإعادة التسجيل',
      cameraTitle:'Wedding Camera',
      cameraText:'افتح الكاميرا وخد صورة من قلب اليوم بالـframe بتاع David & Diana، وبعدها احفظها عندك أو شاركها ❤️',
      openWeddingCamera:'📷 Open Wedding Camera',
      footer:'Made with smiles for David & Diana ❤️'
    },
    en: {
      gateEyebrow:'SMILE TO UNLOCK 💍',
      gateTitle:'David <span>&amp;</span> Diana',
      gateSubtitle:'This invitation does not open with a polite smile 😏',
      gateText:'Give the camera a real smile… once we believe you, the invitation opens 😄',
      openCamera:'📷 Open camera',
      manualUnlock:'Camera not cooperating? Open the invitation',
      privacy:'Your camera is used only on this device to detect a smile. No photo is uploaded or saved.',
      smileFallback:'I smiled 😄 — open the invitation',
      heroKicker:'THE WEDDING OF',
      heroRsvp:'Confirm your attendance ↓',
      movieLine:'🎬 The surprise begins!',
      saveDateEyebrow:'SAVE THE DATE',
      saveDateTitle:'Okay… it’s official!',
      saveDateLead:'The day is finally here 😄 Join us as we begin the sweetest chapter of our story and make it even better by being there.',
      dayLabel:'DAY', dayValue:'Thursday, 24 September 2026',
      timeLabel:'TIME', timeValue:'5:00 PM',
      placeLabel:'PLACE', placeValue:'Archangel Church – Sheraton, Cairo',
      map:'📍 Open location',
      countdownDone:'Today is the big day ❤️',
      rsvpEyebrow:'RSVP', rsvpTitle:'Will you celebrate with us?',
      rsvpLead:'Please confirm your attendance by Thursday, 17 September 2026.',
      nameLabel:'Name', namePlaceholder:'Enter your name',
      attendingLegend:'Will you be able to attend?',
      attendingYes:'Yes, I’m coming ❤️', attendingNo:'Unfortunately, I can’t make it',
      companionsLabel:'Additional guests',
      companionsHint:'Enter the number of people coming with you, not including yourself.',
      submitRsvp:'Confirm RSVP',
      missionTitle:'Your secret wedding mission 🕵️',
      missionText:'Every guest gets a small, fun mission on the wedding day 😏 Complete it unnoticed, then capture it and add it to Wedding Drop ❤️',
      missionButton:'🎯 Get my mission',
      dropTitle:'Wedding Drop',
      dropText:'Choose your favorite photos or videos and send them to us ❤️',
      chooseFiles:'＋ Choose photos or videos',
      chooseFilesHint:'From your phone gallery or computer',
      sendFiles:'Send photos / videos',
      voiceTitle:'Say it, don’t type it',
      voiceText:'Leave us a voice message to hear after the wedding: a kind wish, a heartfelt note, or newlywed advice 😂❤️',
      voiceStatus:'Tap to start recording — you can listen before sharing.',
      shareVoice:'Share voice message', saveVoice:'Save voice message', deleteVoice:'Delete and record again',
      cameraTitle:'Wedding Camera',
      cameraText:'Open the camera, take a photo with the David & Diana frame, then save or share it ❤️',
      openWeddingCamera:'📷 Open Wedding Camera',
      footer:'Made with smiles for David & Diana ❤️'
    }
  };
  const setHtml=(selector,key,lang)=>{const el=document.querySelector(selector);if(el&&translations[lang][key]!=null)el.innerHTML=translations[lang][key]};
  const setText=(selector,key,lang)=>{const el=document.querySelector(selector);if(el&&translations[lang][key]!=null)el.textContent=translations[lang][key]};
  const setLabel=(selector,key,lang)=>{const el=document.querySelector(selector);if(!el)return;const input=el.querySelector('input');el.textContent=translations[lang][key];if(input)el.appendChild(input)};
  function applyLanguage(lang){
    lang=lang==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.body.classList.toggle('is-english',lang==='en');
    setText('#gate .eyebrow','gateEyebrow',lang);
    setHtml('#gate h2','gateSubtitle',lang);
    setText('#gate .gate-card > p:nth-of-type(2)','gateText',lang);
    setText('#startSmile','openCamera',lang);
    setText('#manualUnlock','manualUnlock',lang);
    setText('#gate .privacy','privacy',lang);
    setText('#smileFallback','smileFallback',lang);
    setText('.hero-kicker','heroKicker',lang);
    setText('.hero-rsvp','heroRsvp',lang);
    setText('.movie-line','movieLine',lang);
    setText('.save-date .eyebrow','saveDateEyebrow',lang);
    setHtml('.save-date h2','saveDateTitle',lang);
    setText('.save-date .lead','saveDateLead',lang);
    setText('.details-grid article:nth-child(1) span','dayLabel',lang);
    setText('.details-grid article:nth-child(1) strong','dayValue',lang);
    setText('.details-grid article:nth-child(2) span','timeLabel',lang);
    setText('.details-grid article:nth-child(2) strong','timeValue',lang);
    setText('.details-grid article:nth-child(3) span','placeLabel',lang);
    setText('.details-grid article:nth-child(3) strong','placeValue',lang);
    setText('.save-date .inline','map',lang);
    document.querySelectorAll('#countdown span').forEach((el,i)=>el.textContent=[lang==='ar'?'يوم':'Days',lang==='ar'?'ساعة':'Hours',lang==='ar'?'دقيقة':'Minutes',lang==='ar'?'ثانية':'Seconds'][i]);
    setText('#countdownDone','countdownDone',lang);
    setText('#rsvp .eyebrow','rsvpEyebrow',lang);
    setHtml('#rsvp h2','rsvpTitle',lang);
    setText('#rsvp .lead','rsvpLead',lang);
    const nameLabel=document.querySelector('#rsvpForm > label:first-of-type');if(nameLabel){const input=nameLabel.querySelector('input');nameLabel.firstChild.nodeValue=translations[lang].nameLabel+'\n          ';if(input)input.placeholder=translations[lang].namePlaceholder}
    setText('#rsvpForm legend','attendingLegend',lang);
    setLabel('#rsvpForm .choice:nth-of-type(1)','attendingYes',lang);
    setLabel('#rsvpForm .choice:nth-of-type(2)','attendingNo',lang);
    const companion=document.querySelector('#companionsWrap');if(companion){if(companion.firstChild)companion.firstChild.nodeValue=translations[lang].companionsLabel+'\n          ';setText('#companionsWrap small','companionsHint',lang)}
    setText('#rsvpSubmit','submitRsvp',lang);
    setHtml('#missionSection h2','missionTitle',lang);
    setText('#missionSection > p','missionText',lang);
    setText('#missionButton','missionButton',lang);
    setText('#invitation > section:not(.alt) .drop-zone strong','chooseFiles',lang);
    setText('#invitation > section:not(.alt) .drop-zone span','chooseFilesHint',lang);
    setText('#invitation > section:not(.alt) .actions button','sendFiles',lang);
    setHtml('#voiceSection h2','voiceTitle',lang);
    setText('#voiceSection > p','voiceText',lang);
    setText('#recordStatus','voiceStatus',lang);
    setText('#shareRecording','shareVoice',lang);
    setText('#saveRecording','saveVoice',lang);
    setText('#deleteRecording','deleteVoice',lang);
    setHtml('#cameraSection h2','cameraTitle',lang);
    setText('#cameraSection > p','cameraText',lang);
    setText('#openWeddingCamera','openWeddingCamera',lang);
    setText('footer','footer',lang);
    const toggle=document.querySelector('#languageToggle');if(toggle){toggle.textContent=lang==='ar'?'EN':'عربي';toggle.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل للعربية')}
    window.weddingLanguage=lang;
    try{localStorage.setItem('wedding-language',lang)}catch(_){}
    window.dispatchEvent(new CustomEvent('wedding-language-change',{detail:{language:lang}}));
  }
  const toggle=document.querySelector('#languageToggle');
  toggle?.addEventListener('click',()=>applyLanguage(window.weddingLanguage==='ar'?'en':'ar'));
  let initial='ar';try{const saved=localStorage.getItem('wedding-language');if(saved)initial=saved;else if(/^en/i.test(navigator.language||''))initial='en'}catch(_){}
  window.weddingLanguage=initial;
  applyLanguage(initial);
})();
