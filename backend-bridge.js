(()=>{
  const cfg=window.WEDDING_CONFIG||{};
  const endpoint=()=>cfg.uploadEndpoint||cfg.backendEndpoint||'';
  const toBase64=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]||'');r.onerror=reject;r.readAsDataURL(blob)});
  async function uploadCamera(blob){
    const url=endpoint();
    if(!url) return false;
    const data=await toBase64(blob);
    const payload={action:'upload',event:'David & Diana 24.09.2026',kind:'weddingCamera',name:`David-Diana-Wedding-${Date.now()}.jpg`,mimeType:'image/jpeg',data};
    const res=await fetch(url,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const body=await res.json().catch(()=>({ok:true}));
    if(body&&body.ok===false) throw new Error(body.error||'UPLOAD_FAILED');
    return true;
  }
  document.addEventListener('click',async e=>{
    const btn=e.target.closest?.('#shareWeddingPhoto,#sharePhoto');
    if(!btn||!endpoint()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const canvas=document.querySelector('#weddingCanvas');
    const status=document.querySelector('#weddingCameraStatus');
    if(!canvas){if(status)status.textContent='الصورة غير جاهزة.';return}
    btn.disabled=true;
    if(status)status.textContent='جارٍ رفع الصورة إلى Wedding Drive…';
    try{
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.92));
      if(!blob)throw new Error('NO_IMAGE');
      await uploadCamera(blob);
      if(status)status.textContent='تم رفع الصورة إلى Wedding Drive ❤️';
    }catch(err){
      console.error(err);
      if(status)status.textContent='تعذر رفع الصورة الآن. جرّب مرة أخرى.';
    }finally{btn.disabled=false}
  },true);
})();
