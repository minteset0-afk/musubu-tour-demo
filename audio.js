(() => {
  const I = window.MUSUBU_I18N;
  const audio = document.getElementById('storyAudio'), button = document.getElementById('playBtn'), status = document.getElementById('audioStatus');
  const message = (key) => I.message(status, key);
  const syncButton = () => I.message(button, audio.paused ? 'play' : 'playing');
  audio.addEventListener('loadedmetadata', () => message('audioLoaded'));
  audio.addEventListener('canplay', () => message('audioReady'));
  audio.addEventListener('error', () => message('audioError'));
  audio.addEventListener('play', syncButton);
  audio.addEventListener('pause', syncButton);
  audio.addEventListener('ended', syncButton);
  button.addEventListener('click', () => {
    if (!audio.paused) { audio.pause(); return; }
    audio.play().then(syncButton).catch(() => message('audioBlocked'));
  });
  if (audio.readyState >= 1) message('audioReady');
  document.addEventListener('musubu:languagechange', syncButton);
})();
