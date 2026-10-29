// Confetti burst (newsletter confirmed page): pieces shoot up from both lower corners, tumble and fall, gone after ~4 s.
// Own small script, nothing loaded from elsewhere; skipped for visitors who turned off animations.
(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize);
    const COLORS = ["#1554c0", "#f5c542", "#ffffff", "#8fc1f2", "#0d2f82", "#ffd978"];
    const pieces = [];
    const burst = (x, dir) => {
        for (let i = 0; i < 110; i++) {
            const angle = (-Math.PI / 2) + dir * (Math.random() * 0.75 + 0.1); // up and inwards
            const speed = 9 + Math.random() * 9;
            pieces.push({ x, y: innerHeight + 10, vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.6), vy: Math.sin(angle) * speed,
                w: 6 + Math.random() * 7, h: 8 + Math.random() * 10, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
                color: COLORS[Math.floor(Math.random() * COLORS.length)], round: Math.random() < 0.25, life: 0 });
        }
    };
    burst(innerWidth * 0.05, 1);
    burst(innerWidth * 0.95, -1);
    setTimeout(() => burst(innerWidth * 0.5, Math.random() < 0.5 ? 1 : -1), 350); // a smaller second pop from the middle
    const t0 = performance.now();
    const frame = (now) => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        const age = (now - t0) / 1000;
        pieces.forEach((p) => {
            p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;      // gravity + air
            p.x += p.vx + Math.sin(p.life / 9) * 0.6; p.y += p.vy; p.rot += p.vr; p.life += 1;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.globalAlpha = Math.max(0, Math.min(1, 4.2 - age));
            ctx.fillStyle = p.color;
            if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
            else ctx.fillRect(-p.w / 2, -p.h / 2 * Math.abs(Math.cos(p.life / 6)), p.w, p.h * Math.abs(Math.cos(p.life / 6)) + 1); // flutter
            ctx.restore();
        });
        if (age < 4.4) requestAnimationFrame(frame); else canvas.remove();
    };
    requestAnimationFrame(frame);
})();
