(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const shops = window.MUSUBU_SHOPS;
  const labels = { dessert: '논산 딸기 디저트', meal: '논산 로컬 밥상', gift: '논산 기념품 상점' };
  const dialog = $('shopDialog');
  let client = null, activeShop = null, channel = null, stats = new Map();
  let requestVersion = 0, pending = false, lastSubmission = null, voucherUsed = false;
  const fallback = 'assets/shop-placeholder.svg';
  function imageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
  $('detailImage').onerror = imageError;
  function summary(id) {
    const row = stats.get(id);
    if (!row) return '별점 · 후기 수 확인 중';
    return Number(row.review_count) ? '★ ' + Number(row.average_rating).toFixed(1) + ' · 후기 ' + row.review_count + '개' : '아직 별점 없음 · 후기 0개';
  }
  function updateStatsUI() {
    document.querySelectorAll('[data-stats]').forEach(el => { el.textContent = summary(el.dataset.stats); });
    if (activeShop) $('detailStats').textContent = summary(activeShop.shop_id);
  }
  async function loadStats() {
    if (!client) return;
    const { data, error } = await client.rpc('shop_review_stats');
    if (error) throw error;
    stats = new Map(data.map(row => [row.shop_id, row]));
    updateStatsUI();
  }
  function showCategory(category, focus = true) {
    $('shopResults').hidden = false;
    $('categoryTitle').textContent = labels[category] + ' · 2곳';
    document.querySelectorAll('.category').forEach(button => button.setAttribute('aria-expanded', String(button.dataset.category === category)));
    $('shopList').replaceChildren();
    shops.filter(shop => shop.category === category).forEach(shop => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'place-card'; button.dataset.shop = shop.shop_id;
      const img = document.createElement('img'); img.src = shop.image_url; img.alt = shop.name + ' 참고 이미지'; img.loading = 'lazy'; img.onerror = imageError;
      const content = document.createElement('div'); content.className = 'place-copy';
      const demo = document.createElement('span'); demo.className = 'demo-pill'; demo.textContent = 'DEMO · 가상 업체';
      const name = document.createElement('strong'); name.textContent = shop.name;
      const sub = document.createElement('small'); sub.textContent = shop.products[0].name;
      const rating = document.createElement('span'); rating.className = 'place-stats'; rating.dataset.stats = shop.shop_id; rating.textContent = summary(shop.shop_id);
      content.append(demo, name, sub, rating); button.append(img, content);
      button.addEventListener('click', () => openShop(shop));
      $('shopList').append(button);
    });
    if (focus) $('categoryTitle').focus({ preventScroll: true });
  }
  function renderReviews(rows) {
    $('reviewList').replaceChildren();
    if (!rows.length) {
      const empty = document.createElement('p'); empty.className = 'review-empty'; empty.textContent = '아직 후기가 없어요. 첫 번째 이야기를 남겨주세요.';
      $('reviewList').append(empty); return;
    }
    rows.forEach(row => {
      const article = document.createElement('article'); article.className = 'review-entry'; article.dataset.reviewId = row.id;
      const header = document.createElement('header');
      const rating = document.createElement('b'); rating.textContent = '★'.repeat(row.rating) + ' · ' + row.rating + '점';
      const time = document.createElement('time'); time.dateTime = row.created_at;
      time.textContent = new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date(row.created_at));
      const body = document.createElement('p'); body.textContent = row.review_text;
      header.append(rating, time); article.append(header, body); $('reviewList').append(article);
    });
  }
  async function refreshReviews() {
    if (!client || !activeShop) return;
    const shopId = activeShop.shop_id, version = ++requestVersion;
    try {
      const [{ data, error }] = await Promise.all([
        client.from('reviews').select('id,shop_id,rating,review_text,created_at').eq('shop_id', shopId).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(20),
        loadStats()
      ]);
      if (error) throw error;
      if (activeShop?.shop_id !== shopId || version !== requestVersion) return;
      renderReviews(data); $('retryReviews').hidden = true;
    } catch {
      if (activeShop?.shop_id !== shopId || version !== requestVersion) return;
      $('reviewList').textContent = '후기를 불러오지 못했습니다. 연결을 확인하고 다시 시도해주세요.';
      $('detailStats').textContent = '별점 · 후기 수를 불러오지 못했습니다';
      $('retryReviews').hidden = false;
    }
  }
  function stopChannel() {
    if (channel && client) client.removeChannel(channel);
    channel = null;
  }
  function subscribeShop(shopId) {
    if (!client) {
      $('liveStatus').textContent = '연결 불가'; $('reviewList').textContent = '리뷰 서비스가 로드되지 않았습니다. 새로고침 후 다시 시도해주세요.'; return;
    }
    $('liveStatus').textContent = '실시간 연결 중…'; $('liveStatus').classList.remove('connected');
    channel = client.channel('reviews-' + shopId + '-' + crypto.randomUUID())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews', filter: 'shop_id=eq.' + shopId }, () => {
        if (activeShop?.shop_id === shopId) refreshReviews();
      })
      .subscribe(status => {
        if (activeShop?.shop_id !== shopId) return;
        const connected = status === 'SUBSCRIBED';
        $('liveStatus').classList.toggle('connected', connected);
        $('liveStatus').textContent = connected ? '● 실시간 연결됨' : '재연결 중 · 직접 새로고침 가능';
        $('retryReviews').hidden = connected;
        if (connected) refreshReviews();
      });
  }
  function openShop(shop, reviewFocus = false) {
    stopChannel(); activeShop = shop; ++requestVersion;
    $('detailImage').src = shop.image_url; $('detailImage').alt = shop.name + ' 분위기 참고 이미지';
    $('detailName').textContent = shop.name; $('detailCategory').textContent = labels[shop.category] + ' · 가상 업체';
    $('detailDescription').textContent = shop.description;
    $('detailAddress').textContent = shop.address; $('detailHours').textContent = shop.business_hours; $('detailPhone').textContent = shop.phone;
    $('officialLink').href = shop.external_url; $('mapLink').href = shop.map_url;
    $('detailStats').textContent = summary(shop.shop_id);
    $('detailProducts').replaceChildren();
    shop.products.forEach(product => {
      const li = document.createElement('li'), name = document.createElement('span'), price = document.createElement('b');
      name.textContent = product.name; price.textContent = product.price; li.append(name, price); $('detailProducts').append(li);
    });
    $('reviewForm').reset(); $('submitStatus').textContent = ''; $('submitStatus').classList.remove('error'); $('goVoucher').hidden = true;
    $('reviewList').textContent = '후기 불러오는 중…'; $('retryReviews').hidden = true;
    $('submitReview').disabled = pending || !client;
    $('reviewShop').value = shop.shop_id;
    document.body.classList.add('modal-open'); dialog.showModal();
    dialog.querySelector('.sheet-scroll').scrollTop = 0;
    subscribeShop(shop.shop_id); refreshReviews();
    if (reviewFocus) requestAnimationFrame(() => $('reviewsHeading').focus());
  }
  function activateVoucher(review, shop) {
    $('voucherBox').classList.remove('locked');
    $('voucherBox').dataset.reviewId = review.id;
    $('voucherBox').firstElementChild.textContent = shop.name + ' · 후기 저장 완료';
    $('useVoucher').disabled = voucherUsed;
    $('reviewMsg').textContent = shop.name + ' 후기가 저장되었습니다. ₩1,000 데모 바우처가 활성화되었습니다.';
  }
  document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => showCategory(button.dataset.category)));
  shops.forEach(shop => {
    const option = document.createElement('option'); option.value = shop.shop_id; option.textContent = shop.name + ' · ' + labels[shop.category]; $('reviewShop').append(option);
  });
  $('openReview').addEventListener('click', () => {
    const shop = shops.find(item => item.shop_id === $('reviewShop').value);
    if (!shop) { $('reviewMsg').textContent = '먼저 후기를 남길 상점을 선택해주세요.'; $('reviewShop').focus(); return; }
    openShop(shop, true);
  });
  $('closeDetail').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeShop = null; ++requestVersion; stopChannel(); document.body.classList.remove('modal-open');
    loadStats().catch(() => {});
  });
  $('showReviews').addEventListener('click', () => $('reviewsHeading').focus());
  $('retryReviews').addEventListener('click', refreshReviews);
  $('goVoucher').addEventListener('click', () => { dialog.close(); $('voucher').scrollIntoView({ behavior: 'smooth' }); });
  $('useVoucher').addEventListener('click', () => {
    if (!$('voucherBox').dataset.reviewId || voucherUsed) return;
    voucherUsed = true; $('useVoucher').textContent = '사용 완료'; $('useVoucher').disabled = true;
  });
  $('reviewForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !client || !activeShop) return;
    const shop = activeShop;
    const rating = Number(new FormData(event.currentTarget).get('rating')), reviewText = $('reviewText').value.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || [...reviewText].length < 2 || [...reviewText].length > 500) {
      $('submitStatus').textContent = '별점과 2~500자의 후기를 입력해주세요.'; return;
    }
    const signature = JSON.stringify([shop.shop_id, rating, reviewText]);
    if (lastSubmission?.signature !== signature) lastSubmission = { signature, requestId: crypto.randomUUID() };
    const payload = { shop_id: shop.shop_id, rating, review_text: reviewText, request_id: lastSubmission.requestId };
    pending = true; $('submitReview').disabled = true; $('submitReview').textContent = 'DB에 저장 중…';
    $('submitStatus').textContent = '저장이 완료될 때까지 잠시 기다려주세요.'; $('submitStatus').classList.remove('error');
    try {
      let { data, error } = await client.from('reviews').insert(payload).select('id,shop_id,rating,review_text,created_at').single();
      if (error?.code === '23505') {
        const previous = await client.from('reviews').select('id,shop_id,rating,review_text,created_at').eq('request_id', payload.request_id).single();
        data = previous.data; error = previous.error;
      }
      if (error || !data?.id) throw error || new Error('저장 확인 실패');
      activateVoucher(data, shop); lastSubmission = null;
      if (activeShop?.shop_id === shop.shop_id) {
        $('submitStatus').textContent = '✓ 후기가 DB에 저장되었습니다. 데모 바우처가 열렸습니다.';
        $('goVoucher').hidden = false; $('reviewForm').reset(); await refreshReviews();
      }
    } catch {
      if (activeShop?.shop_id === shop.shop_id) {
        $('submitStatus').textContent = '저장 완료를 확인하지 못했습니다. 바우처는 발급되지 않았습니다. 연결을 확인한 뒤 다시 등록해주세요.';
        $('submitStatus').classList.add('error');
      }
    } finally {
      pending = false; $('submitReview').disabled = !client; $('submitReview').textContent = '후기 등록하고 바우처 받기';
    }
  });
  if (window.supabase) {
    client = window.supabase.createClient('https://fzynbjgkictmlmuxfldl.supabase.co', 'sb_publishable_x08dJFDQ_zuP0IKJ83jFYg_1so-HCCN', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    loadStats().catch(() => { $('reviewMsg').textContent = '리뷰 서버 연결을 확인해주세요. 저장에 성공한 후기만 바우처가 발급됩니다.'; });
  } else {
    $('reviewMsg').textContent = '리뷰 서비스를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.';
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && activeShop) refreshReviews();
  });
  window.addEventListener('online', () => { if (activeShop) refreshReviews(); });
})();
