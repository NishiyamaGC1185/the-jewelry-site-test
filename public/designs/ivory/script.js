(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
        e.target.classList.add('seen');
        io.unobserve(e.target);
    } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(e => io.observe(e));
    const ivory = document.querySelector(".ivory-hero");
    if (ivory) {
        const photo = ivory.querySelector('.ivory-main-photo');
        const guide = document.createElement('div');
        guide.className = 'ivory-scroll-guide';
        guide.innerHTML = '<span>SCROLL TO DISCOVER</span><span>スクロールで、景色をひらく ↓</span>';
        ivory.append(guide);
        ivory.classList.add('ivory-aperture');
        ivory.parentElement.insertBefore(Object.assign(document.createElement('div'), { className: 'ivory-scroll-end' }), ivory.nextSibling);
        let frame = 0;
        const draw = () => { frame = 0; const rect = ivory.getBoundingClientRect(); const p = reduce ? 1 : Math.max(0, Math.min(1, -rect.top / (ivory.offsetHeight - innerHeight))); ivory.style.setProperty('--aperture', p.toFixed(4)); };
        const queue = () => { if (!frame)
            frame = requestAnimationFrame(draw); };
        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
        draw();
        const story = document.querySelector('.ivory-story');
        story.classList.add('ivory-editorial-stage');
        const runner = document.createElement('div');
        runner.className = 'ivory-running-type';
        runner.setAttribute('aria-hidden', 'true');
        runner.innerHTML = '<span>THE OCCASION.</span><span>YOURS TO CREATE.</span>';
        story.prepend(runner);
        const inset = document.createElement('figure');
        inset.className = 'ivory-story-photo';
        inset.innerHTML = '<img src="../../images/event-runway-1200.webp" alt="ファッションショーのイメージ" loading="lazy"><figcaption>AN OCCASION TO REMEMBER.</figcaption>';
        story.append(inset);
        const cards = document.querySelector('.ivory-cards');
        cards.classList.add('ivory-moving-cards');
        const track = () => { if (reduce)
            return; const r = story.getBoundingClientRect(), v = innerHeight; const p = Math.max(0, Math.min(1, (v - r.top) / (v + r.height))); story.style.setProperty('--editorial', p.toFixed(4)); const c = cards.getBoundingClientRect(); cards.style.setProperty('--cards-progress', Math.max(-1, Math.min(1, c.top / v)).toFixed(4)); };
        let tf = 0;
        const move = () => { if (!tf)
            tf = requestAnimationFrame(() => { tf = 0; track(); }); };
        window.addEventListener('scroll', move, { passive: true });
        window.addEventListener('resize', move);
        track();
        requestAnimationFrame(() => ivory.classList.add('ivory-ready'));
    }
})();
