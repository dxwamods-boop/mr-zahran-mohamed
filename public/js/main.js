(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = o => { burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  // WhatsApp prefilled message
  const msg = 'السلام عليكم، أريد الاستفسار عن مجموعات مستر زهران محمد لمادة التاريخ والجغرافيا، ومعرفة المواعيد والأماكن المتاحة للصف الدراسي.';
  $('#wa').href = 'https://wa.me/201063759649?text=' + encodeURIComponent(msg);

  // Scroll reveals (skipped for reduced motion via CSS)
  const targets = document.querySelectorAll('.sec h2, .card, .steps li, .philosophy, .empty');
  targets.forEach(t => t.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('in'));

  // Interactive exploration. Text is editable placeholder copy.
  const places = [
    { n: 'الأقصر', x: 212.6, y: 64.3, tag: 'طيبة القديمة',
      h: 'الأقصر هي طيبة القديمة، عاصمة مصر في عصر الدولة الحديثة، وفيها معابد الكرنك والأقصر ووادي الملوك.',
      g: 'تقع الأقصر على ضفاف النيل في صعيد مصر، وتتميز بمناخ صحراوي حار وجاف وتعتمد الزراعة فيها على مياه النيل.' },
    { n: 'بلاد الرافدين', x: 224, y: 57, tag: 'بين دجلة والفرات',
      h: 'ظهرت هنا من أقدم الحضارات المعروفة، مثل السومريين والبابليين، وارتبطت بنشأة الكتابة المسمارية.',
      g: 'سهل رسوبي خصب بين نهري دجلة والفرات، يوضح كيف تصنع الأنهار الحضارات.' },
    { n: 'البحر المتوسط', x: 192.5, y: 48, tag: 'ملتقى القارات',
      h: 'كان طريقاً للتجارة والتواصل بين حضارات مصر واليونان وروما وغيرها.',
      g: 'بحر شبه مغلق بين أوروبا وأفريقيا وآسيا، ويتميز مناخ سواحله بصيف جاف وشتاء ممطر.' },
    { n: 'الصحراء الكبرى', x: 190, y: 67, tag: 'أكبر صحراء حارة',
      h: 'عبرتها قوافل التجارة قديماً وربطت شمال أفريقيا بغربها وجنوبها.',
      g: 'أكبر صحراء حارة في العالم، تمتد عبر شمال أفريقيا بمناخ شديد الجفاف.' },
    { n: 'جبال الهيمالايا', x: 266, y: 62, tag: 'سقف العالم',
      h: 'شكّلت حاجزاً طبيعياً أثّر في حركة الشعوب والتجارة بين جنوب آسيا وشرقها.',
      g: 'أعلى سلسلة جبال في العالم، نشأت من التقاء صفيحتين تكتونيتين، وتغذي أنهاراً كبرى.' },
    { n: 'الأمازون', x: 120, y: 93, tag: 'رئة الأرض',
      h: 'سكنتها شعوب أصلية منذ آلاف السنين قبل وصول الأوروبيين إلى الأمريكتين.',
      g: 'أكبر غابة مطيرة في العالم، يتميز مناخها بالحرارة والأمطار الغزيرة طوال العام.' }
  ];
  const g = $('.grat'), pins = $('#pins'), sec = $('#explore'), NS = 'http://www.w3.org/2000/svg';
  for (let x = 0; x <= 360; x += 30) g.insertAdjacentHTML('beforeend', `<line x1="${x}" y1="0" x2="${x}" y2="180"/>`);
  for (let y = 0; y <= 180; y += 30) g.insertAdjacentHTML('beforeend', `<line x1="0" y1="${y}" x2="360" y2="${y}"/>`);
  let mode = 'history', cur = 0;
  const btns = [];
  places.forEach((p, i) => {
    const el = document.createElementNS(NS, 'g');
    el.setAttribute('class', 'pin'); el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', p.n);
    el.innerHTML = `<circle class="ring" cx="${p.x}" cy="${p.y}" r="2.5"/><circle cx="${p.x}" cy="${p.y}" r="2.6"/><text x="${p.x}" y="${p.y - 4.5}" text-anchor="middle">${p.n}</text>`;
    const pick = () => { cur = i; render(); };
    el.addEventListener('click', pick);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    pins.appendChild(el); btns.push(el);
  });
  function render() {
    const p = places[cur];
    sec.dataset.mode = mode;
    btns.forEach((b, i) => b.setAttribute('aria-pressed', i === cur));
    $('#pTitle').textContent = (mode === 'history' ? 'تاريخياً: ' : 'جغرافياً: ') + p.n;
    $('#pText').textContent = mode === 'history' ? p.h : p.g;
    $('#pTag').textContent = p.tag;
  }
  document.querySelectorAll('.switch button').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    document.querySelectorAll('.switch button').forEach(x => x.setAttribute('aria-selected', x === b));
    render();
  }));
  render();
})();
