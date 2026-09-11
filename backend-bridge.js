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

  const scripts=[
    ['refinements.js?v=20260911y','refinements.js?v=20260911y'],
    ['large-upload.js?v=20260911z2','large-upload.js?v=20260911z2']
  ];
  for(const [src,marker] of scripts){
    if([...document.scripts].some(s=>String(s.src||'').includes(marker))) continue;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }
})();
