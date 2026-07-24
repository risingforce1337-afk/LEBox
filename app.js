/* ===== LEBox ===== */
(function () {
  "use strict";

  var IP = "LEBox.aternos.me";

  /* ---- copy to clipboard ---- */
  function copyIP() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(IP);
    }
    // fallback for file:// / older browsers
    return new Promise(function (resolve, reject) {
      try {
        var t = document.createElement("textarea");
        t.value = IP;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
        resolve();
      } catch (e) { reject(e); }
    });
  }

  var toast = document.getElementById("toast");
  var beam = document.querySelector(".beam");

  function flareBeam() {
    if (!beam) return;
    beam.classList.remove("flare");
    // force reflow so the animation can retrigger
    void beam.offsetWidth;
    beam.classList.add("flare");
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 1500);
  }

  function wireCopy(btnId, labelId) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    var label = labelId ? document.getElementById(labelId) : null;
    btn.addEventListener("click", function () {
      copyIP().then(function () {
        btn.classList.add("copied");
        if (label) label.textContent = "copied";
        flareBeam();
        showToast();
        clearTimeout(btn._t);
        btn._t = setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = "copy";
        }, 1600);
      }).catch(function () {
        if (label) label.textContent = "select + copy";
      });
    });
  }

  wireCopy("copyBtn", "copyLabel");
  wireCopy("copyBtn2", "copyLabel2");

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- graceful image fallback (before the .png files are dropped in) ---- */
  document.querySelectorAll(".shot img").forEach(function (img) {
    img.addEventListener("error", function () {
      var fig = img.closest(".shot");
      if (fig) fig.classList.add("missing");
    });
  });

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- live status (real data from the public mcsrvstat.us API) ----
     Honest by design: shows "online / asleep / status unavailable".
     Never invents a player count. If the API can't be reached, it says so. */
  var statusEl = document.getElementById("status");
  function setStatus(state, text) {
    if (!statusEl) return;
    statusEl.setAttribute("data-state", state);
    var t = statusEl.querySelector(".status-text");
    if (t) t.textContent = text;
  }

  function checkStatus() {
    if (!statusEl || !("fetch" in window)) { setStatus("unknown", "status unavailable"); return; }
    var ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, 10000);
    fetch("https://api.mcsrvstat.us/3/" + IP, { signal: ctrl.signal, cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        clearTimeout(to);
        if (d && d.online) {
          var n = d.players && typeof d.players.online === "number" ? d.players.online : null;
          if (n === null)      setStatus("online", "online");
          else if (n === 0)    setStatus("online", "online · empty");
          else if (n === 1)    setStatus("online", "1 playing");
          else                 setStatus("online", n + " playing");
        } else {
          setStatus("offline", "asleep, needs a wake-up");
        }
      })
      .catch(function () {
        clearTimeout(to);
        setStatus("unknown", "status unavailable");
      });
  }
  checkStatus();
})();
