/* AROMA LAB - 3D scenes (Three.js r128). Plain JS, loaded before script.js.
   Exposes window.AromaScene = { mountHero, mountShowcase }.
   Every bottle is generated from the product data (name, image, accent),
   so products added in the admin panel (Supabase) appear in 3D automatically. */
(function () {
  if (!window.THREE) return;
  var TAU = Math.PI * 2;

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  /* ---------- label texture (product image + name) ---------- */
  function drawLabel(ctx, S, p, img) {
    ctx.fillStyle = '#FFFBF5'; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = '#B8963E'; ctx.lineWidth = 6; ctx.strokeRect(14, 14, S - 28, S - 28);
    var ix = 36, iy = 36, iw = S - 72, ih = Math.round(S * 0.56);
    if (img) {
      var r = Math.max(iw / img.width, ih / img.height), w = img.width * r, h = img.height * r;
      ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, ih); ctx.clip();
      ctx.drawImage(img, ix + (iw - w) / 2, iy + (ih - h) / 2, w, h); ctx.restore();
    } else {
      ctx.fillStyle = p.accent || '#B8963E'; ctx.fillRect(ix, iy, iw, ih);
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#B8963E';
    ctx.font = '600 22px Inter, sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
    ctx.fillText('AROMA LAB', S / 2, iy + ih + 44);
    ctx.fillStyle = '#0A2E1F'; ctx.font = '600 44px "Cormorant Garamond", serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
    var name = String(p.name || ''); if (name.length > 18) name = name.slice(0, 17) + '…';
    ctx.fillText(name, S / 2, iy + ih + 92);
  }

  function labelTexture(p) {
    var S = 512, c = document.createElement('canvas'); c.width = c.height = S;
    var ctx = c.getContext('2d'), tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4; drawLabel(ctx, S, p, null);
    if (p.image) {
      var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () { drawLabel(ctx, S, p, im); tex.needsUpdate = true; };
      im.src = p.image;
    }
    return tex;
  }

  /* ---------- one perfume bottle ---------- */
  var gold = null;
  function buildBottle(p) {
    if (!gold) gold = new THREE.MeshStandardMaterial({ color: 0xB8963E, metalness: 0.7, roughness: 0.28 });
    var g = new THREE.Group();
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.05 });
    var body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.7, 0.8), glass);
    var liquid = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.3, 0.68),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(p.accent || '#B8963E'), transparent: true, opacity: 0.85, roughness: 0.2 }));
    liquid.position.y = -0.1;
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 24), gold); neck.position.y = 0.95;
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.55, 32), gold); cap.position.y = 1.3;
    var label = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), new THREE.MeshBasicMaterial({ map: labelTexture(p) }));
    label.position.set(0, -0.05, 0.41);
    g.add(liquid, body, neck, cap, label);
    g.position.y = -0.2;
    return g;
  }

  function disposeGroup(grp) {
    grp.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material && o.material !== gold) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    });
  }

  /* ---------- shared renderer / loop ---------- */
  function stage(canvas, opts, tick) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(opts.fov, 1, 0.1, 100);
    camera.position.set(0, opts.camY, opts.camZ);
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(3, 5, 6); scene.add(key);
    var warm = new THREE.PointLight(0xB8963E, 1.3, 30); warm.position.set(-4, 2, 4); scene.add(warm);
    var rim = new THREE.PointLight(0xffffff, 0.6, 30); rim.position.set(4, -2, -3); scene.add(rim);

    function resize() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    
    var visible = true, raf = 0, last = performance.now();
    var ro = null, io = null;

    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; });
      io.observe(canvas);
    }

    function loop(t) {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = t; return; }
      var dt = Math.min((t - last) / 1000, 0.05); last = t;
      tick(dt, t / 1000); renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    return {
      scene: scene, camera: camera,
      dispose: function () {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        if (io) io.disconnect();
        window.removeEventListener('resize', resize);
        disposeGroup(scene);
        renderer.dispose();
      }
    };
  }

  /* ---------- HERO: gold dust + floating bottles ---------- */
  function mountHero(canvas) {
    if (!webglOK()) return null;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mouse = { x: 0, y: 0 }, bottles = new THREE.Group(), items = [], FOV = 45, CZ = 8;
    function onMove(e) { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = (e.clientY / window.innerHeight) * 2 - 1; }
    window.addEventListener('mousemove', onMove);

    var st = stage(canvas, { fov: FOV, camY: 0, camZ: CZ }, function (dt, t) {
      var cam = st.camera;
      cam.position.x += (mouse.x * 0.8 - cam.position.x) * 0.05;
      cam.position.y += (-mouse.y * 0.5 - cam.position.y) * 0.05;
      cam.lookAt(0, 0, 0);
      var wide = window.innerWidth >= 768; bottles.visible = wide;
      var hw = Math.tan(FOV * Math.PI / 360) * CZ * cam.aspect;
      items.forEach(function (it, i) {
        it.mesh.position.x = hw * (0.38 + i * 0.26);
        it.mesh.position.y = Math.sin(t * 0.9 + i * 1.7) * 0.25 + it.y;
        if (!reduce) it.mesh.rotation.y = Math.sin(t * 0.5 + i) * 0.6 + 0.3;
      });
      if (!reduce) { dust.rotation.y += dt * 0.03; dust.position.y = Math.sin(t * 0.2) * 0.2; }
    });

    var N = 220, pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 18; pos[i * 3 + 1] = (Math.random() - 0.5) * 9; pos[i * 3 + 2] = (Math.random() - 0.5) * 8; }
    var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xE6C679, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false }));
    st.scene.add(dust, bottles);

    return {
      setProducts: function (list) {
        items.forEach(function (it) { bottles.remove(it.mesh); disposeGroup(it.mesh); }); items = [];
        (list || []).slice(0, 3).forEach(function (p, i) {
          var m = buildBottle(p); m.scale.setScalar(1.15 - i * 0.12);
          bottles.add(m); items.push({ mesh: m, y: i % 2 ? -0.6 : 0.4 });
        });
      },
      dispose: function () { window.removeEventListener('mousemove', onMove); st.dispose(); }
    };
  }

  /* ---------- SHOWCASE: draggable 3D ring of all products ---------- */
  function mountShowcase(canvas, onSelect) {
    if (!webglOK()) return null;
    var ring = new THREE.Group(), bottles = [], list = [], N = 0, step = TAU, R = 0;
    var rot = 0, target = 0, dragging = false, moved = 0, startX = 0, startRot = 0, lastIdx = -1;
    var ray = new THREE.Raycaster(), ptr = new THREE.Vector2();

    function idxOf(r) { return ((Math.round(-r / step) % N) + N) % N; }
    function goTo(i) {
      if (!N) return;
      var d = (((-i * step - rot) % TAU) + TAU * 1.5) % TAU - Math.PI; // shortest turn
      target = rot + d;
    }

    var st = stage(canvas, { fov: 38, camY: 0.5, camZ: 7.5 }, function (dt, t) {
      if (!N) return;
      if (!dragging) rot += (target - rot) * Math.min(1, dt * 6);
      ring.rotation.y = rot;
      bottles.forEach(function (b, i) {
        var a = i * step + rot, f = Math.max(0, Math.cos(a));
        b.scale.setScalar(0.62 + 0.38 * f);
        b.position.y = -0.2 + Math.sin(t * 1.1 + i) * 0.06 * f;
      });
      var idx = idxOf(dragging ? rot : target);
      if (idx !== lastIdx) { lastIdx = idx; if (onSelect) onSelect(idx); }
    });
    st.camera.lookAt(0, 0.1, 0);
    st.scene.add(ring);

    function down(e) { dragging = true; moved = 0; startX = e.clientX; startRot = rot; canvas.setPointerCapture(e.pointerId); }
    function move(e) { if (!dragging) return; var dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx)); rot = startRot + dx * 0.006; }
    function up(e) {
      if (!dragging) return; dragging = false;
      if (moved < 6) { // tap = pick bottle under the finger
        var r = canvas.getBoundingClientRect();
        ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ptr, st.camera);
        var hit = ray.intersectObjects(bottles, true)[0];
        if (hit) { var o = hit.object; while (o.parent && bottles.indexOf(o) < 0) o = o.parent; var i = bottles.indexOf(o); if (i >= 0) { goTo(i); return; } }
      }
      goTo(idxOf(rot));
    }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    return {
      setProducts: function (arr) {
        bottles.forEach(function (b) { ring.remove(b); disposeGroup(b); });
        bottles = []; list = arr || []; N = list.length; lastIdx = -1; rot = target = 0;
        step = N > 1 ? TAU / N : TAU; R = N > 1 ? Math.max(2.6, N * 0.8) : 0;
        ring.position.z = -R;
        list.forEach(function (p, i) {
          var b = buildBottle(p), a = i * step;
          b.position.x = Math.sin(a) * R; b.position.z = Math.cos(a) * R; b.rotation.y = a;
          ring.add(b); bottles.push(b);
        });
      },
      next: function () { goTo((idxOf(target) + 1) % Math.max(N, 1)); },
      prev: function () { goTo((idxOf(target) - 1 + N) % Math.max(N, 1)); },
      dispose: function () {
        canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); st.dispose();
      }
    };
  }

  window.AromaScene = { mountHero: mountHero, mountShowcase: mountShowcase };
})();
