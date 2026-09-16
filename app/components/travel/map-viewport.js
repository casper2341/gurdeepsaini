'use client';

import { useEffect, useRef, useState } from 'react';
import { MinusIcon, PlusIcon, ResetIcon } from '../icons';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const BUTTON_STEP = 1.8;
// a press only turns into a pan after moving this many px, so pins stay clickable
const DRAG_THRESHOLD = 4;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Pan/zoom around the server-rendered world map. The view lives in a ref and is
// written straight to the DOM, so dragging never re-renders the country paths.
export default function MapViewport({ width, height, label, children }) {
  const frameRef = useRef(null);
  const svgRef = useRef(null);
  const layerRef = useRef(null);
  const view = useRef({ k: 1, x: 0, y: 0 });
  const [level, setLevel] = useState('min'); // min | mid | max — drives the buttons
  const [tip, setTip] = useState(null);

  const apply = (next, animate = false) => {
    const k = clamp(next.k, MIN_ZOOM, MAX_ZOOM);
    // the map always covers the frame — it can't be flung off-screen
    const x = clamp(next.x, width - width * k, 0);
    const y = clamp(next.y, height - height * k, 0);
    view.current = { k, x, y };
    layerRef.current.classList.toggle('is-animating', animate);
    layerRef.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    svgRef.current.style.setProperty('--k', k);
    setLevel(k <= MIN_ZOOM ? 'min' : k >= MAX_ZOOM ? 'max' : 'mid');
    setTip(null);
  };

  // zoom by `factor` while keeping viewBox point (px, py) fixed on screen
  const zoomAt = (factor, px, py, animate) => {
    const { k, x, y } = view.current;
    const nextK = clamp(k * factor, MIN_ZOOM, MAX_ZOOM);
    const ratio = nextK / k;
    apply({ k: nextK, x: px - (px - x) * ratio, y: py - (py - y) * ratio }, animate);
  };

  useEffect(() => {
    const frame = frameRef.current;
    const svg = svgRef.current;
    const pointers = new Map(); // pointerId → last position, in viewBox units
    let start = null;
    let dragged = false;

    const toViewBox = (event) => {
      const rect = svg.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * width,
        y: ((event.clientY - rect.top) / rect.height) * height,
      };
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointers.set(event.pointerId, toViewBox(event));
      if (pointers.size === 1) {
        start = { x: event.clientX, y: event.clientY };
        dragged = false;
      }
    };

    const onPointerMove = (event) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      if (!dragged) {
        const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
        if (pointers.size < 2 && moved < DRAG_THRESHOLD) return;
        dragged = true;
        frame.classList.add('is-dragging');
      }
      // capture only once it's a drag — capturing on press would retarget pin clicks
      if (!svg.hasPointerCapture(event.pointerId)) svg.setPointerCapture(event.pointerId);

      const next = toViewBox(event);
      pointers.set(event.pointerId, next);
      const { k, x, y } = view.current;

      if (pointers.size === 1) {
        apply({ k, x: x + next.x - prev.x, y: y + next.y - prev.y });
        return;
      }

      // two fingers: scale by the change in spread, anchored on their midpoint
      const other = [...pointers].find(([id]) => id !== event.pointerId)[1];
      const spreadBefore = Math.hypot(prev.x - other.x, prev.y - other.y);
      const spreadAfter = Math.hypot(next.x - other.x, next.y - other.y);
      const midBefore = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
      const midAfter = { x: (next.x + other.x) / 2, y: (next.y + other.y) / 2 };
      const nextK = clamp(k * (spreadBefore ? spreadAfter / spreadBefore : 1), MIN_ZOOM, MAX_ZOOM);
      const ratio = nextK / k;
      apply({
        k: nextK,
        x: midBefore.x - (midBefore.x - x) * ratio + (midAfter.x - midBefore.x),
        y: midBefore.y - (midBefore.y - y) * ratio + (midAfter.y - midBefore.y),
      });
    };

    const endPointer = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size === 0) frame.classList.remove('is-dragging');
    };

    // a drag that happens to end over a pin must not also open it
    const swallowDragClick = (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };

    const onWheel = (event) => {
      // plain scrolling keeps scrolling the page; Ctrl/⌘ + wheel and trackpad pinch zoom
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const point = toViewBox(event);
      zoomAt(Math.exp(-clamp(delta, -60, 60) * 0.01), point.x, point.y);
    };

    const showTip = (event) => {
      const pin = event.target.closest?.('.map-pin');
      if (!pin || frame.classList.contains('is-dragging')) return;
      const box = frame.getBoundingClientRect();
      const dot = pin.querySelector('.map-pin-dot').getBoundingClientRect();
      const top = dot.top - box.top;
      const below = top < 80; // no room above: hang the balloon under the pin
      setTip({
        title: pin.dataset.title,
        meta: pin.dataset.meta,
        left: clamp(dot.left + dot.width / 2 - box.left, 96, box.width - 96),
        top: below ? dot.bottom - box.top : top,
        below,
      });
    };

    const hideTip = (event) => {
      const pin = event.target.closest?.('.map-pin');
      if (pin && !pin.contains(event.relatedTarget)) setTip(null);
    };

    const preventDefault = (event) => event.preventDefault();

    // pins are sized in screen px, so track how many viewBox units one px is
    const resize = new ResizeObserver(() => {
      svg.style.setProperty('--u', width / svg.getBoundingClientRect().width);
      setTip(null);
    });
    resize.observe(svg);

    const listeners = [
      ['pointerdown', onPointerDown],
      ['pointermove', onPointerMove],
      ['pointerup', endPointer],
      ['pointercancel', endPointer],
      ['click', swallowDragClick, true],
      ['wheel', onWheel, { passive: false }],
      ['dragstart', preventDefault],
      ['pointerover', showTip],
      ['pointerout', hideTip],
      ['focusin', showTip],
      ['focusout', hideTip],
    ];
    listeners.forEach(([type, fn, options]) => svg.addEventListener(type, fn, options));

    return () => {
      listeners.forEach(([type, fn, options]) => svg.removeEventListener(type, fn, options));
      resize.disconnect();
    };
  }, [width, height]);

  return (
    <figure className="map-figure">
      <div ref={frameRef} className="map-frame">
        <svg
          ref={svgRef}
          className={level === 'min' ? 'world-map' : 'world-map is-zoomed'}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={label}
        >
          <g ref={layerRef} className="map-layer">
            {children}
          </g>
        </svg>

        <div className="map-controls">
          <button
            type="button"
            className="icon-button map-control"
            aria-label="Zoom in"
            disabled={level === 'max'}
            onClick={() => zoomAt(BUTTON_STEP, width / 2, height / 2, true)}
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            className="icon-button map-control"
            aria-label="Zoom out"
            disabled={level === 'min'}
            onClick={() => zoomAt(1 / BUTTON_STEP, width / 2, height / 2, true)}
          >
            <MinusIcon />
          </button>
          <button
            type="button"
            className="icon-button map-control"
            aria-label="Reset map"
            disabled={level === 'min'}
            onClick={() => apply({ k: 1, x: 0, y: 0 }, true)}
          >
            <ResetIcon />
          </button>
        </div>

        {tip && (
          <div
            className={tip.below ? 'map-balloon is-below' : 'map-balloon'}
            style={{ left: tip.left, top: tip.top }}
            aria-hidden="true"
          >
            <strong>{tip.title}</strong>
            <span>{tip.meta}</span>
          </div>
        )}
      </div>
      <figcaption className="map-hint">
        Drag to pan · pinch or Ctrl/⌘ + scroll to zoom · pick a red pin
      </figcaption>
    </figure>
  );
}
