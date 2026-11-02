"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const PlayerInner = dynamic(() => import("./PlayerInner"), {
  ssr: false,
  loading: () => <PlayerPoster />,
});

function PlayerPoster() {
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center bg-[#0b1220]"
    >
      <span className="text-sm tracking-widest text-white/60">
        LOADING DEMO
      </span>
    </div>
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export default function DemoPlayer() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  return (
    <div>
      <div
        className="relative w-full overflow-hidden rounded-[18px] ring-1 ring-ink-strong/10 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.35)]"
        style={{ aspectRatio: "1280 / 800" }}
      >
        <PlayerInner reducedMotion={reducedMotion} />
      </div>
      <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-muted">
        The test protocol, start to finish: wifi password never typed, ethernet
        port empty, then scored on setup roadblocks, boot-to-HDMI time, nag
        screens, and which ACR, voice, and telemetry toggles survive a power
        cut. Model results publish when testing ships; the panel above is a
        protocol walkthrough, not a verdict on any specific TV.
      </p>
    </div>
  );
}
