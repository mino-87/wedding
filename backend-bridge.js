(()=>{
  const current=window.WEDDING_CONFIG||{};
  window.WEDDING_CONFIG=Object.freeze({
    ...current,
    maxUploadBytes:500*1024*1024,
    maxImageUploadBytes:25*1024*1024,
    maxVoiceUploadBytes:25*1024*1024,
    maxVideoUploadBytes:500*1024*1024,
    maxCentralUploadBytes:25*1024*1024
  });

  /* Reliable RSVP transport.
     Vercel production uses the local /api/rsvp proxy.
     GitHub Pages test URLs talk directly to Apps Script so tests do not consume Vercel usage. */
  const rsvpForm=document.querySelector('#rsvpForm');
  if(rsvpForm){
    const rsvpStatus=document.querySelector('#rsvpStatus');
    const rsvpSubmit=document.querySelector('#rsvpSubmit');
    const companionsWrap=document.querySelector('#companionsWrap');
    const companionsInput=document.querySelector('#rsvpCompanions');
    const directUrl=window.WEDDING_CONFIG?.rsvpEndpoint||window.WEDDING_CONFIG?.backendEndpoint||'';
    const isVercel=/\.vercel\.app$/i.test(location.hostname);
    const primaryUrl=isVercel?'/api/rsvp':directUrl;
    const fallbackUrl=isVercel?directUrl:'';
    const isEnglish=()=>String(document.documentElement.lang||'').toLowerCase().startsWith('en');
    const text=(ar,en)=>isEnglish()?en:ar;
    const setStatus=value=>{if(rsvpStatus)rsvpStatus.textContent=value;};

    function updateCompanions(){
      const attending=rsvpForm.querySelector('input[name="attending"]:checked')?.value;
      companionsWrap?.classList.toggle('hidden',attending!=='yes');
      if(companionsInput)companionsInput.value=attending==='yes'?(companionsInput.value||'0'):'0';
    }
    rsvpForm.querySelectorAll('input[name="attending"]').forEach(input=>input.addEventListener('change',updateCompanions));
    updateCompanions();

    async function postRsvp(url,payload){
      if(!url)throw new Error('RSVP_ENDPOINT_MISSING');
      const response=await fetch(url,{
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify(payload),
        cache:'no-store'
      });
      const raw=await response.text();
      let result={};
      try{result=raw?JSON.parse(raw):{};}catch{result={};}
      if(!response.ok||result?.ok===false){
        const error=new Error(result?.error||`HTTP_${response.status}`);
        error.status=response.status;
        throw error;
      }
      return result;
    }

    rsvpForm.addEventListener('submit',async event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      const fd=new FormData(rsvpForm);
      const name=String(fd.get('name')||'').trim();
      const attending=String(fd.get('attending')||'');
      if(!name||!['yes','no'].includes(attending)){
        setStatus(text('اكتب اسمك واختار هتحضر ولا لأ.','Enter your name and choose whether you are attending.'));
        return;
      }

      const payload={
        action:'rsvp',
        event:'David & Diana 24.09.2026',
        name,
        attending,
        companions:attending==='yes'?Math.max(0,Math.min(10,Number.parseInt(String(fd.get('companions')||'0'),10)||0)):0,
        submittedAt:new Date().toISOString()
      };

      if(rsvpSubmit)rsvpSubmit.disabled=true;
      setStatus(text('جارٍ حفظ الرد…','Saving your response…'));
      try{
        try{
          await postRsvp(primaryUrl,payload);
        }catch(primaryError){
          console.warn('RSVP primary transport error',primaryError);
          if(!fallbackUrl||fallbackUrl===primaryUrl)throw primaryError;
          await postRsvp(fallbackUrl,payload);
        }
        setStatus(text('تم تسجيل ردك بنجاح ❤️','Your response has been saved successfully ❤️'));
        rsvpForm.reset();
        updateCompanions();
      }catch(error){
        console.error('RSVP save failed',error);
        setStatus(text('تعذر تسجيل الرد الآن. جرّب مرة أخرى بعد قليل.','Could not save your response. Please try again shortly.'));
      }finally{
        if(rsvpSubmit)rsvpSubmit.disabled=false;
      }
    },true);
  }

  const scripts=[
    ['refinements.js?v=20260911y','refinements.js'],
    ['large-upload.js?v=20260913b','large-upload.js'],
    ['camera-iphone-fix.js?v=20260911z3','camera-iphone-fix.js']
  ];
  for(const [src,fileName] of scripts){
    const alreadyLoaded=[...document.scripts].some(script=>{
      try{return new URL(script.src,location.href).pathname.endsWith('/'+fileName);}
      catch(_){return false;}
    });
    if(alreadyLoaded)continue;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }
})();