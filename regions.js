(() => {
'use strict';
const words = {
ko:{regionLabel:'지역 선택',nonsan:'논산',fukuoka:'후쿠오카',heroTitle:'지역의 이야기를 듣고\n후쿠오카를 더 가까이 만나보세요.',heroDescription:'일본 학생들과 함께 채워갈 후쿠오카 여행 공간입니다. 지역의 사진과 이야기, 음성, 주변 상점을 소개할 예정입니다.',pageTitle:'むすぶ | 후쿠오카 이야기 관광',storyTag:'STORY · 이야기 감상',storyTitle:'후쿠오카의 이야기를 만나보세요',storyIntro:'현지 학생들의 시선으로 후쿠오카의 장소와 일상을 소개합니다.',storyPending:'첫 번째 후쿠오카 이야기를 준비하고 있어요',storyNote:'장소가 정해지면 사진 → 소개글 → 한국어·일본어 음성 순서로 만나볼 수 있습니다.',authorNote:'학생들의 직접 등록 기능은 추후 제공됩니다.',shopsTag:'NEARBY · 주변 상점',shopsTitle:'이야기와 가까운 후쿠오카 상점',shopsNote:'현지 학생들이 소개할 상점을 준비하고 있습니다.',cafe:'☕ 카페 · 디저트',food:'🍜 지역 음식점',gift:'🎁 기념품',coming:'준비 중',reviewTag:'REVIEW · 후기 참여',reviewTitle:'후쿠오카에서의 경험을 나눠주세요',reviewNote:'후쿠오카 상점이 등록되면 해당 상점의 별점과 후기를 남길 수 있습니다.',reviewPending:'상점 등록 후 후기 작성 가능',voucherTag:'VOUCHER · 바우처',voucherTitle:'후쿠오카 지역 상점 데모 바우처',voucherNote:'후쿠오카 바우처의 금액과 사용 조건은 추후 안내합니다. 현재는 발급되지 않습니다.'},
ja:{regionLabel:'エリアを選択',nonsan:'論山',fukuoka:'福岡',heroTitle:'まちの声に出会う。\n福岡を、もっと身近に。',heroDescription:'日本の学生と一緒につくる福岡の旅案内。まちの写真や物語、音声ガイド、お店の情報をお届けする予定です。',pageTitle:'むすぶ | 福岡の物語をめぐる旅',storyTag:'STORY · まちの物語',storyTitle:'福岡の物語にふれてみませんか',storyIntro:'地元の学生の視点から、福岡のまちと日常をご紹介します。',storyPending:'福岡の最初の物語を準備しています',storyNote:'紹介する場所が決まったら、写真 → 紹介文 → 韓国語・日本語の音声ガイドの順にお楽しみいただけます。',authorNote:'学生向けの投稿機能は、今後公開予定です。',shopsTag:'NEARBY · まちのお店',shopsTitle:'物語の続きは、福岡のお店へ',shopsNote:'地元の学生が紹介するお店の情報を準備しています。',cafe:'☕ カフェ・スイーツ',food:'🍜 地元のグルメ',gift:'🎁 おみやげ',coming:'準備中',reviewTag:'REVIEW · 旅の感想',reviewTitle:'福岡での体験をシェアしませんか',reviewNote:'福岡のお店が掲載されたら、評価や感想を投稿できるようになります。',reviewPending:'お店の掲載後に投稿できます',voucherTag:'VOUCHER · クーポン',voucherTitle:'福岡のお店で使うデモクーポン',voucherNote:'福岡のクーポンの金額・利用条件は後日ご案内します。現在は発行していません。'}
};
Object.assign(words.ko, {"heroDescription":"사진과 이야기, 한국어·일본어 음성으로 후쿠오카와 근교 여행지를 만나보세요.","storyIntro":"오호리공원과 유후인을 사진 → 소개글 → 음성 순서로 소개합니다. 유후인은 오이타현에 있는 근교 여행지입니다.","ohoriTitle":"오호리공원","ohoriLocation":"일본 · 후쿠오카현 후쿠오카시","ohoriAlt":"호수와 다리, 도시 풍경이 어우러진 오호리공원","ohoriText":"오호리공원의 이름은 후쿠오카성을 둘러싸던 큰 해자에서 유래했습니다. 해자는 성을 보호하기 위해 둘레에 판 물길을 뜻합니다. 후쿠오카의 영주 구로다 나가마사가 성을 쌓을 당시, 바다와 이어져 있던 구사가에 일대를 정비해 성의 바깥 해자로 활용했습니다. 이 '오호리(큰 해자)'라는 이름이 오늘날 공원의 이름으로 이어졌습니다.","yufuinTitle":"유후인","yufuinLocation":"일본 · 오이타현 유후시 · 후쿠오카 근교 여행","yufuinAlt":"산을 바라보며 즐기는 유후인의 노천온천 풍경","yufuinText":"유후인은 오이타현의 유후다케 기슭, 산으로 둘러싸인 분지에 자리한 온천마을입니다. 예부터 풍부한 온천수가 솟아나는 곳으로 알려져 왔습니다. 유후다케를 중심으로 한 자연환경과 고즈넉한 마을 풍경을 간직하면서, 온천과 휴식을 즐기는 여행지로 발전했습니다."});
Object.assign(words.ja, {"heroDescription":"写真と物語、韓国語・日本語の音声ガイドで、福岡と周辺の旅先をめぐりましょう。","storyIntro":"大濠公園と由布院を、写真 → 紹介文 → 音声ガイドの順にご紹介します。由布院は大分県にある、福岡から足を延ばして訪れたい旅先です。","ohoriTitle":"大濠公園（オホリ公園）","ohoriLocation":"日本 · 福岡県福岡市","ohoriAlt":"湖と橋、その向こうに街並みが広がる大濠公園","ohoriText":"大濠公園の名前は、福岡城を守るための大きな外堀に由来します。福岡藩主・黒田長政が福岡城を築いた際、海につながっていた草ヶ江の一帯を整備し、城の外堀として利用しました。この「大濠」という名前が、現在の公園にも受け継がれています。","yufuinTitle":"由布院（ユフイン）","yufuinLocation":"日本 · 大分県由布市 · 福岡から足を延ばす旅","yufuinAlt":"山を眺めながらくつろげる由布院の露天風呂","yufuinText":"由布院は、大分県の由布岳のふもと、山々に囲まれた盆地に広がる温泉地です。古くから豊かな温泉に恵まれてきました。由布岳を望む自然と落ち着いたまちの風景を大切にしながら、温泉に浸かってゆったり過ごせる旅先として親しまれています。"});
const valid = x => ['nonsan','fukuoka'].includes(x);
const query = new URL(location.href).searchParams.get('region');
let region = valid(query) ? query : 'nonsan';
const I = window.MUSUBU_I18N;
function render() {
 const w=words[I.lang], fk=region==='fukuoka';
 document.querySelectorAll('[data-region-alt]').forEach(el=>el.alt=w[el.dataset.regionAlt]);
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
document.addEventListener('DOMContentLoaded',render);
window.addEventListener('popstate',()=>{const value=new URL(location.href).searchParams.get('region');setRegion(valid(value)?value:'nonsan',false);});
render();
})();
