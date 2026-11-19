/* THE GATES OF OLYMPUS — non-destructive visual enhancement */
(() => {
  'use strict';
  const pad = n => String(n).padStart(2, '0');
  const paths = name => [`assets/${name}`, name];
  const trySources = (img, candidates) => {
    let i = 0;
    img.addEventListener('error', () => {
      i += 1;
      if (i < candidates.length) img.src = candidates[i];
      else img.remove();
    });
    img.src = candidates[0];
  };
  function enhance() {
    const brand = document.querySelector('.brand');
    if (brand && brand.textContent.includes('MAXIMILIAN’S ODYSSEY')) {
      brand.textContent = '✦ THE LEGEND OF MAXIMILIAN ✦';
    }
    const mission = document.getElementById('mission');
    const missionText = document.getElementById('mission-text');
    if (!mission || !missionText) return;
    const title = document.getElementById('mission-title');
    const selected = location.hash.match(/(?:mission[-/ ]?|gate[-/ ]?)(\d{1,2})/i);
    const fromData = mission.dataset.mission || mission.dataset.number || missionText.dataset.mission;
    const heading = (title?.textContent || '').trim();
    const fromHeading = heading.match(/(?:MISSION|GATE|TRIAL)\s*0?(\d{1,2})/i);
    const num = Number(fromData || selected?.[1] || fromHeading?.[1]);
    const old = mission.querySelector('.olympus-mission-art');
    if (old) old.remove();
    if (!Number.isInteger(num) || num < 1 || num > 24) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'olympus-mission-art';
    const img = document.createElement('img');
    img.alt = `Illustration zu Mission ${pad(num)}`;
    img.loading = 'lazy';
    trySources(img, [...paths(`gate-${pad(num)}.webp`)]);
    wrapper.append(img);
    if (num === 24) {
      const finale = document.createElement('img');
      finale.className = 'olympus-finale-art';
      finale.alt = 'Maximilian mit den fünf Musen — das große Finale';
      finale.loading = 'lazy';
      trySources(finale, [...paths('mission-24-finale.png'), ...paths('mission-24-finale.jpg'), ...paths('mission-24-finale.webp')]);
      wrapper.append(finale);
    }
    missionText.before(wrapper);
  }
  // Existing script.js controls navigation; observe its view and title changes.
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; enhance(); });
  };
  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-view], #gates, .gate')) setTimeout(schedule, 0);
  });
  const start = () => {
    const title = document.getElementById('mission-title');
    if (title) new MutationObserver(schedule).observe(title, {childList:true, characterData:true, subtree:true});
    schedule();
    // Correct existing vase path if assets are in repository root.
    const vase = document.querySelector('.vase-wrap img');
    if (vase) {
      const fallback = [...paths('muses-vase.jpg'), ...paths('muses-vase.png'), ...paths('muses-vase.webp')];
      trySources(vase, fallback);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
