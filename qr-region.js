(() => {
const region=new URL(location.href).searchParams.get('region')==='fukuoka'?'fukuoka':'nonsan';
function render(){
 const I=window.MUSUBU_I18N, ja=I.lang==='ja';
 const back=document.querySelector('.qr-top>a'), backUrl=new URL(back.href);backUrl.searchParams.set('region',region);back.href=backUrl.href;
 if(region!=='fukuoka')return;
 document.querySelector('[data-i18n="qrHeading"]').textContent=ja?'福岡の旅へ、QRコードから':'후쿠오카 QR로 바로 접속하세요';
 document.querySelector('[data-i18n="qrDescription"]').textContent=ja?'ログイン不要。表示する言語のQRコードをお選びください。':'로그인 없이 후쿠오카 공간으로 접속합니다. 원하는 언어의 QR을 선택하세요.';
 for(const [index,lang] of ['ko','ja'].entries()){
 const card=document.querySelectorAll('.qr-card')[index], url='https://minteset0-afk.github.io/musubu-tour-demo/?region=fukuoka&lang='+lang;
 const img=card.querySelector('img');img.src='assets/qr-fukuoka-'+lang+'.svg';img.alt='MUSUBU Fukuoka '+lang+' QR';
 card.querySelector('.qr-url').textContent=url;
 const links=card.querySelectorAll('.qr-actions a');links[0].href=url;links[1].href=img.src;links[1].download='MUSUBU-Fukuoka-QR-'+lang+'.svg';
 }
}
document.addEventListener('DOMContentLoaded',render);
document.addEventListener('musubu:languagechange',render);
render();
})();