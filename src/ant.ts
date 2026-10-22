type Pose = [number, number, number]; // x, y, grados
type Seg = [number, (t: number) => Pose];

interface Geo { vw: number; vh: number; R: number; x0: number; y0: number; x1: number; y1: number; a: number; b: number; q: number; P: number }

const D = Math.PI / 180;

function geo(): Geo {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const m = 3;
  const R = Math.min(46, vw / 4, vh / 4);
  const x0 = m, y0 = m, x1 = vw - m, y1 = vh - m;
  const a = x1 - x0 - 2 * R, b = y1 - y0 - 2 * R, q = (Math.PI * R) / 2;
  return { vw, vh, R, x0, y0, x1, y1, a, b, q, P: 2 * (a + b) + 4 * q };
}

// Posición sobre el borde de la pantalla (rectángulo con esquinas redondeadas)
function at(g: Geo, dist: number): Pose {
  let d = ((dist % g.P) + g.P) % g.P;
  const { R, x0, y0, x1, y1, a, b, q } = g;
  const arc = (cx: number, cy: number, t0: number) => (t: number): Pose => {
    const th = t0 - (90 * t) / q;
    return [cx + R * Math.cos(th * D), cy + R * Math.sin(th * D), th - 90];
  };
  const segs: Seg[] = [
    [a, (t) => [x0 + R + t, y1, 0]], [q, arc(x1 - R, y1 - R, 90)],
    [b, (t) => [x1, y1 - R - t, -90]], [q, arc(x1 - R, y0 + R, 0)],
    [a, (t) => [x1 - R - t, y0, -180]], [q, arc(x0 + R, y0 + R, -90)],
    [b, (t) => [x0, y0 + R + t, -270]], [q, arc(x0 + R, y1 - R, -180)],
  ];
  for (const [len, fn] of segs) {
    if (d <= len) return fn(d);
    d -= len;
  }
  return segs[0][1](0);
}

export function initAnt(): void {
  const ant = document.getElementById('ant');
  if (!ant) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let s = 0;
  let k = reduce ? 1 : 0;      // 0 = caminando, 1 = detenida mirando al usuario
  let goal = reduce ? 1 : 0;
  let timer = 3.5;             // segundos hasta la primera parada
  let last = performance.now();
  let look = false;

  function frame(now: number): void {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const g = geo();

    if (!reduce) {
      timer -= dt;
      if (timer <= 0) {
        goal = goal ? 0 : 1;
        timer = goal ? 3.6 : 6 + Math.random() * 5; // pausa / tiempo caminando
      }
      k = Math.min(1, Math.max(0, k + (goal ? 1 : -1) * (dt / 0.9)));
      s += (g.vw < 700 ? 46 : 66) * (1 - k) * dt;   // velocidad en px/s
    }

    // La hormiga del logo mira a la izquierda, así que recorre el borde en sentido contrario
    const p = at(g, -s);
    const e = k * k * (3 - 2 * k);
    const w = ant!.offsetWidth, h = ant!.offsetHeight;

    // Al detenerse se endereza y se acerca un poco al contenido para mirar de frente
    const px = Math.min(Math.max(p[0], w * 0.625 + 8), g.vw - w * 0.625 - 8);
    const py = Math.min(Math.max(p[1], h * 1.25 + 8), g.vh - 8);
    const x = p[0] + (px - p[0]) * e;
    const y = p[1] + (py - p[1]) * e;
    const ang = ((((p[2] % 360) + 540) % 360) - 180) * (1 - e);
    ant!.style.transform = `translate(${x}px,${y}px) rotate(${ang}deg) scale(${1 + 0.25 * e})`;

    const lk = k > 0.55;
    if (lk !== look) {
      look = lk;
      ant!.classList.toggle('look', lk);
    }
    ant!.classList.toggle('still', k > 0.25);
    ant!.classList.add('on');
    requestAnimationFrame(frame);
  }

  if (look === false && reduce) ant.classList.add('look', 'still');
  requestAnimationFrame(frame);
}
