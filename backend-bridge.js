(()=>{
  const scripts=[
    ['refinements.js?v=20260911y','refinements.js?v=20260911y'],
    ['large-upload.js?v=20260911z1','large-upload.js?v=20260911z1']
  ];
  for(const [src,marker] of scripts){
    if([...document.scripts].some(s=>String(s.src||'').includes(marker))) continue;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }
})();
