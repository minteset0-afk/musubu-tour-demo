(() => {
'use strict';
const I = window.MUSUBU_I18N;
const players = ['Donam','Tapjeong'].map(id => ({
audio: document.getElementById('storyAudio'+id),
button: document.getElementById('playBtn'+id),
status: document.getElementById('audioStatus'+id),
place: id === 'Donam' ? 'donam' : 'tapjeong'
})).filter(p => p.audio && p.button && p.status);
const message = (p,key) => I.message(p.status,key);
const sync = p => I.message(p.button,p.audio.paused ? 'play':'playing');
function source(p) {
p.audio.pause();
p.audio.src = 'assets/audio/'+p.place+'-'+I.lang+'.mp3';
p.audio.load();
message(p,'audioLoading');
sync(p);
}
players.forEach(p => {
p.audio.addEventListener('loadedmetadata',()=>message(p,'audioLoaded'));
p.audio.addEventListener('error',()=>message(p,'audioError'));
p.audio.addEventListener('play',()=>{players.forEach(other=>{if(other!==p)other.audio.pause();});sync(p);});
p.audio.addEventListener('pause',()=>sync(p));
p.audio.addEventListener('ended',()=>sync(p));
p.button.addEventListener('click',()=>{
if(!p.audio.paused){p.audio.pause();return;}
p.audio.play().catch(()=>message(p,'audioBlocked'));
});
source(p);
});
document.addEventListener('musubu:languagechange',()=>players.forEach(source));
})();