(()=>{
  /* Compatibility bridge only. Camera/voice upload behavior now lives in refinements.js.
     Load the current build explicitly so older cached HTML still receives the fixes. */
  const marker='20260911y';
  const already=[...document.scripts].some(s=>String(s.src||'').includes(`refinements.js?v=${marker}`));
  if(!already){
    const script=document.createElement('script');
    script.src=`refinements.js?v=${marker}`;
    script.async=false;
    document.head.appendChild(script);
  }
})();
