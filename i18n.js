(() => {
  const dict = {
    ar: {
      dir:"rtl", lang:"ar",
      gateEyebrow:"SMILE TO UNLOCK 💍",
      gateTitleSub:"الدعوة دي ما بتفتحش بالمجاملة 😏",
      gateBody:"عايزين ضحكة حقيقية للكاميرا… ولما نصدقك، الدعوة تفتح 😄",
      startCamera:"📷 افتح الكاميرا",
      manualUnlock:"الكاميرا مش متعاونة؟ افتح الدعوة يدويًا",
      privacy:"الكاميرا تُستخدم على جهازك فقط لاكتشاف الابتسامة، ولا يتم رفع أو حفظ صورتك.",
      officialTitle:"أوكيه… رسميًّا؟",
      officialBody:"وأخيرًا جه اليوم 😄 مستنيينكم تشاركونا بداية أحلى فصل في حكايتنا وتخلّوا اليوم أحلى بوجودكم.",
      attendanceLabel:"حضوركم",
      rsvpTitle:"جايين نفرح سوا؟",
      rsvpLead:"أكدوا حضوركم قبل يوم الخميس 17 سبتمبر 2026.",
      success:"تم تسجيل ردك بنجاح ❤️",
      yes:"فرحتنا هتكمل بيكم! هنستناكم منورين ✨",
      no:"زعلنا إنكم مش هتقدروا تيجوا، بس أنتم معانا بقلوبكم. إن شاء الله نتجمع في مناسبتنا الجاية 🤍"
    },
    en: {
      dir:"ltr", lang:"en",
      gateEyebrow:"SMILE TO UNLOCK 💍",
      gateTitleSub:"This invitation opens with a real smile 😏",
      gateBody:"Give the camera a genuine smile… and the invitation is yours 😄",
      startCamera:"📷 Open camera",
      manualUnlock:"Camera not cooperating? Open the invitation manually",
      privacy:"Your camera stays on this device to detect your smile. Nothing is uploaded or saved.",
      officialTitle:"Okay… it’s official!",
      officialBody:"The day is finally here 😄 We can’t wait to celebrate the next chapter with you.",
      attendanceLabel:"Your attendance",
      rsvpTitle:"Will you celebrate with us?",
      rsvpLead:"Please confirm your attendance by Thursday, 17 September 2026.",
      success:"Your response was saved successfully ❤️",
      yes:"Our celebration will be brighter with you! We’ll be waiting for you ✨",
      no:"We’re sorry you can’t make it, but you’ll be with us in spirit. We hope to celebrate together at our next occasion 🤍"
    }
  };
  let current = localStorage.getItem("wedding-language") || "ar";
  const $all = s => [...document.querySelectorAll(s)];
  function setLanguage(lang) {
    current = dict[lang] ? lang : "ar";
    const t = dict[current];
    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    document.body.dataset.language = current;
    localStorage.setItem("wedding-language", current);
    $all("[data-i18n]").forEach(el => { if(t[el.dataset.i18n]) el.textContent = t[el.dataset.i18n]; });
    $all(".language-toggle").forEach(btn => {
      const active = btn.dataset.lang === current;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    updateRsvpFeedback();
  }
  function updateRsvpFeedback() {
    const feedback = document.getElementById("rsvpFeedback");
    const checked = document.querySelector('input[name="attending"]:checked');
    if (!feedback || !checked) return;
    feedback.textContent = checked.value === "yes" ? dict[current].yes : dict[current].no;
    feedback.className = "rsvp-feedback " + (checked.value === "yes" ? "is-yes" : "is-no");
  }
  function addCelebration() {
    const box = document.getElementById("rsvpFeedback");
    if (!box || document.body.dataset.language !== "en" && !box.textContent) return;
    box.animate?.([{transform:"scale(.96)",opacity:.4},{transform:"scale(1)",opacity:1}],{duration:420,easing:"cubic-bezier(.2,.8,.2,1)"});
    if (document.querySelector('input[name="attending"]:checked')?.value === "yes") {
      for (let i=0;i<12;i++) {
        const piece=document.createElement("i");
        piece.className="confetti-piece";
        piece.style.setProperty("--i", i);
        piece.textContent = ["✦","·","♥"][i%3];
        box.append(piece);
        setTimeout(()=>piece.remove(),900);
      }
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    $all(".language-toggle").forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));
    $all('input[name="attending"]').forEach(input => input.addEventListener("change", () => { updateRsvpFeedback(); addCelebration(); }));
    document.getElementById("rsvpForm")?.addEventListener("submit", () => setTimeout(addCelebration, 40));
    setLanguage(current);
  });
  window.WEDDING_I18N = { get language(){return current;}, setLanguage };
})();