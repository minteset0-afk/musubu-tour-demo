(() => {
'use strict';
const words = {
ko:{regionLabel:'지역 선택',nonsan:'논산',fukuoka:'후쿠오카',heroTitle:'지역의 이야기를 듣고\n후쿠오카를 더 가까이 만나보세요.',heroDescription:'일본 학생들과 함께 채워갈 후쿠오카 여행 공간입니다. 지역의 사진과 이야기, 음성, 주변 상점을 소개할 예정입니다.',pageTitle:'むすぶ | 후쿠오카 이야기 관광',storyTag:'STORY · 이야기 감상',storyTitle:'후쿠오카의 이야기를 만나보세요',storyIntro:'현지 학생들의 시선으로 후쿠오카의 장소와 일상을 소개합니다.',storyPending:'첫 번째 후쿠오카 이야기를 준비하고 있어요',storyNote:'장소가 정해지면 사진 → 소개글 → 한국어·일본어 음성 순서로 만나볼 수 있습니다.',authorNote:'학생들의 직접 등록 기능은 추후 제공됩니다.',shopsTag:'NEARBY · 주변 상점',shopsTitle:'이야기와 가까운 후쿠오카 상점',shopsNote:'현지 학생들이 소개할 상점을 준비하고 있습니다.',cafe:'☕ 카페 · 디저트',food:'🍜 지역 음식점',gift:'🎁 기념품',coming:'준비 중',reviewTag:'REVIEW · 후기 참여',reviewTitle:'후쿠오카에서의 경험을 나눠주세요',reviewNote:'후쿠오카 상점이 등록되면 해당 상점의 별점과 후기를 남길 수 있습니다.',reviewPending:'상점 등록 후 후기 작성 가능',voucherTag:'VOUCHER · 바우처',voucherTitle:'후쿠오카 지역 상점 데모 바우처',voucherNote:'후쿠오카 바우처의 금액과 사용 조건은 추후 안내합니다. 현재는 발급되지 않습니다.'},
ja:{regionLabel:'エリアを選択',nonsan:'論山',fukuoka:'福岡',heroTitle:'まちの声に出会う。\n福岡を、もっと身近に。',heroDescription:'日本の学生と一緒につくる福岡の旅案内。まちの写真や物語、音声ガイド、お店の情報をお届けする予定です。',pageTitle:'むすぶ | 福岡の物語をめぐる旅',storyTag:'STORY · まちの物語',storyTitle:'福岡の物語にふれてみませんか',storyIntro:'地元の学生の視点から、福岡のまちと日常をご紹介します。',storyPending:'福岡の最初の物語を準備しています',storyNote:'紹介する場所が決まったら、写真 → 紹介文 → 韓国語・日本語の音声ガイドの順にお楽しみいただけます。',authorNote:'学生向けの投稿機能は、今後公開予定です。',shopsTag:'NEARBY · まちのお店',shopsTitle:'物語の続きは、福岡のお店へ',shopsNote:'地元の学生が紹介するお店の情報を準備しています。',cafe:'☕ カフェ・スイーツ',food:'🍜 地元のグルメ',gift:'🎁 おみやげ',coming:'準備中',reviewTag:'REVIEW · 旅の感想',reviewTitle:'福岡での体験をシェアしませんか',reviewNote:'福岡のお店が掲載されたら、評価や感想を投稿できるようになります。',reviewPending:'お店の掲載後に投稿できます',voucherTag:'VOUCHER · クーポン',voucherTitle:'福岡のお店で使うデモクーポン',voucherNote:'福岡のクーポンの金額・利用条件は後日ご案内します。現在は発行していません。'}
};
const valid = x => ['nonsan','fukuoka'].includes(x);
const query = new URL(location.href).searchParams.get('region');
let region = valid(query) ? query : 'nonsan';
const I = window.MUSUBU_I18N;
function render() {
 const w=words[I.lang], fk=region==='fukuoka';
 document.querySelectorAll('[data-region-text]').forEach(el=>el.textContent=w[el.dataset.regionText]);
 document.querySelectorAll('[data-region-aria]').forEach(el=>el.setAttribute('aria-label',w[el.dataset.regionAria]));
 document.querySelectorAll('[data-region]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.region===region)));
 document.getElementById('nonsanContent').hidden=fk;
 document.getElementById('fukuokaContent').hidden=!fk;
 document.querySelector('.brand').textContent='むすぶ · '+(fk?'FUKUOKA':'NONSAN')+' STORY TOUR';
 ['heroTitle','heroDescription','pageTitle'].forEach(key=>document.querySelector('[data-i18n="'+key+'"]').textContent=fk?w[key]:I.t(key));
 document.querySelectorAll('.flow a').forEach((a,i)=>a.setAttribute('href','#'+(fk?'fukuoka-':'')+['story','shops','review','voucher'][i]));
 const qr=document.querySelector('.qrbtn');
 const url=new URL(qr.href);url.searchParams.set('region',region);qr.href=url.href;
}
function setRegion(next, update=true) {
 if(!valid(next))return;
 document.querySelectorAll('audio').forEach(a=>a.pause());
 region=next;
 if(update){const url=new URL(location.href);url.searchParams.set('region',region);
 if(url.hash){const section=url.hash.slice(1).replace(/^fukuoka-/,'');if(['story','shops','review','voucher'].includes(section))url.hash=(region==='fukuoka'?'fukuoka-':'')+section;}
 history.replaceState(null,'',url);}
 render();
}
document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>setRegion(b.dataset.region)));
document.addEventListener('musubu:languagechange',render);
window.addEventListener('popstate',()=>{const value=new URL(location.href).searchParams.get('region');setRegion(valid(value)?value:'nonsan',false);});
render();
})();