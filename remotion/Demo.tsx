import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";

export const DEMO_FPS = 30;
export const DEMO_DURATION = 222;
export const DEMO_WIDTH = 1280;
export const DEMO_HEIGHT = 800;

const C = {
  bg: "#0b1220",
  panel: "#111a2b",
  bezel: "#1c2638",
  screen: "#000000",
  screenUi: "#0f1a2e",
  ink: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#64748b",
  line: "rgba(148,163,184,0.18)",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa",
  sans: "var(--font-inter, Inter), system-ui, -apple-system, sans-serif",
};

// Timeline (frames at 30fps)
const SKIP_CLICK = 42;
const NAG_IN = 60;
const NAG_OUT = 84;
const HDMI_IN = 92;
const SETTINGS_IN = 118;
const TOGGLES_DONE = 150;
const POWER_CUT = 158;
const POWER_BACK = 172;
const ROW_IN = 190;
const FADE_OUT = 212;

function clamp(frame: number, from: number, to: number, a: number, b: number) {
  return interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function Cursor({ x, y, pressed }: { x: number; y: number; pressed: boolean }) {
  const s = pressed ? 0.85 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 18,
        top: y - 18,
        width: 36,
        height: 36,
        borderRadius: 18,
        background: "rgba(241,245,249,0.16)",
        border: "2px solid rgba(241,245,249,0.7)",
        transform: `scale(${s})`,
      }}
    />
  );
}

function Check({ on, color }: { on: boolean; color: string }) {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        border: `2px solid ${on ? color : C.dim}`,
        background: on ? color : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {on ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.5l2.2 2.2L9.5 3.7"
            stroke={C.bg}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
}

function ScoreLine({
  label,
  value,
  on,
  color = C.green,
  delayFrom,
  frame,
}: {
  label: string;
  value: string;
  on: boolean;
  color?: string;
  delayFrom: number;
  frame: number;
}) {
  const reveal = on ? clamp(frame, delayFrom, delayFrom + 10, 0, 1) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 0",
        borderBottom: `1px solid ${C.line}`,
        fontSize: 19,
      }}
    >
      <Check on={on} color={color} />
      <span style={{ color: on ? C.ink : C.dim, flex: 1 }}>{label}</span>
      <span
        style={{
          color,
          fontWeight: 600,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 6}px)`,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Toggle({ on, label, frame, at }: { on: boolean; label: string; frame: number; at: number }) {
  const t = spring({ frame: frame - at, fps: DEMO_FPS, config: { damping: 18, stiffness: 160 } });
  const knob = on ? 1 - t : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 22px",
        borderBottom: `1px solid ${C.line}`,
        fontSize: 22,
        color: C.ink,
      }}
    >
      <span>{label}</span>
      <div
        style={{
          width: 58,
          height: 32,
          borderRadius: 16,
          background: knob > 0.5 ? C.blue : "#334155",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3 + knob * 26,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: C.ink,
          }}
        />
      </div>
    </div>
  );
}

function TvScreen({ frame }: { frame: number }) {
  const setupVisible = frame < NAG_IN;
  const nagVisible = frame >= NAG_IN && frame < NAG_OUT;
  const hdmiVisible = frame >= HDMI_IN && frame < SETTINGS_IN;
  const settingsVisible = frame >= SETTINGS_IN && frame < POWER_CUT;
  const dark = frame >= POWER_CUT && frame < POWER_BACK;
  const hdmiAgain = frame >= POWER_BACK;

  const skipPressed = frame >= SKIP_CLICK && frame < SKIP_CLICK + 6;
  const cursorX = clamp(frame, 10, SKIP_CLICK - 4, 300, 585);
  const cursorY = clamp(frame, 10, SKIP_CLICK - 4, 300, 398);

  const hdmiFade = clamp(frame, HDMI_IN, HDMI_IN + 8, 0, 1);
  const backFade = clamp(frame, POWER_BACK, POWER_BACK + 10, 0, 1);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.screen,
        overflow: "hidden",
        fontFamily: C.sans,
      }}
    >
      {setupVisible ? (
        <div style={{ position: "absolute", inset: 0, background: C.screenUi, padding: "46px 56px" }}>
          <div style={{ color: C.muted, fontSize: 18, letterSpacing: 1 }}>SETUP 2 OF 7</div>
          <div style={{ color: C.ink, fontSize: 36, fontWeight: 700, marginTop: 10 }}>
            Connect to a network
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Home-5G", "Home-IoT", "Guest"].map((n) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  color: C.ink,
                  fontSize: 22,
                }}
              >
                <span>{n}</span>
                <span style={{ color: C.muted }}>Locked</span>
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              right: 56,
              bottom: 44,
              padding: "12px 26px",
              borderRadius: 10,
              border: `2px solid ${skipPressed ? C.ink : C.muted}`,
              color: C.ink,
              fontSize: 22,
              fontWeight: 600,
              background: skipPressed ? "rgba(255,255,255,0.12)" : "transparent",
            }}
          >
            Skip
          </div>
          <Cursor x={cursorX} y={cursorY} pressed={skipPressed} />
        </div>
      ) : null}

      {nagVisible ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C.screenUi,
          }}
        >
          <div
            style={{
              width: 520,
              padding: "30px 34px",
              borderRadius: 14,
              background: "#1e293b",
              color: C.ink,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700 }}>No network connected</div>
            <div style={{ color: C.muted, fontSize: 20, marginTop: 8 }}>
              Some features will be unavailable.
            </div>
            <div style={{ marginTop: 20, color: C.blue, fontSize: 20, fontWeight: 600 }}>
              Continue without network
            </div>
          </div>
        </div>
      ) : null}

      {hdmiVisible || hdmiAgain ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: hdmiAgain ? backFade : hdmiFade,
            background:
              "radial-gradient(ellipse at 50% 40%, #1d2a44 0%, #0b1220 60%, #000 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 36,
              padding: "6px 14px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.1)",
              color: C.ink,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            HDMI 1
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, padding: "0 60px" }}>
            <div style={{ color: C.ink, fontSize: 34, fontWeight: 700 }}>Jellyfin</div>
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 120,
                    height: 72,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, rgba(96,165,250,${0.25 + i * 0.08}), rgba(15,23,42,0.6))`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {settingsVisible ? (
        <div style={{ position: "absolute", inset: 0, background: C.screenUi, padding: "40px 56px" }}>
          <div style={{ color: C.muted, fontSize: 18, letterSpacing: 1 }}>SETTINGS / PRIVACY</div>
          <div style={{ marginTop: 18, borderTop: `1px solid ${C.line}` }}>
            <Toggle label="Viewing information (ACR)" on frame={frame} at={SETTINGS_IN + 8} />
            <Toggle label="Voice recognition" on frame={frame} at={SETTINGS_IN + 16} />
            <Toggle label="Usage and diagnostics" on frame={frame} at={SETTINGS_IN + 24} />
            <Toggle label="Interest-based ads" on frame={frame} at={SETTINGS_IN + 32} />
          </div>
        </div>
      ) : null}

      {dark ? <div style={{ position: "absolute", inset: 0, background: "#000" }} /> : null}
    </div>
  );
}

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();

  const bootSeconds = Math.round(clamp(frame, NAG_IN, HDMI_IN + 6, 0, 14));
  const rowT = spring({ frame: frame - ROW_IN, fps: DEMO_FPS, config: { damping: 20, stiffness: 120 } });
  const fade = clamp(frame, FADE_OUT, DEMO_DURATION, 1, 0);
  const powerFlicker = frame >= POWER_CUT && frame < POWER_CUT + 4 ? 0.2 : 1;

  const stepLabel =
    frame < NAG_IN
      ? "Step 1. Setup with no network entered"
      : frame < SETTINGS_IN
        ? "Step 2. Boot to HDMI and count nags"
        : frame < POWER_CUT
          ? "Step 3. Settings teardown"
          : frame < ROW_IN
            ? "Step 4. Power cut, then re-check"
            : "Scored and added to the list";

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: C.sans, opacity: fade }}>
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: C.muted,
          fontSize: 18,
        }}
      >
        <span style={{ color: C.ink, fontWeight: 600 }}>{stepLabel}</span>
        <span>77in OLED, 2026 firmware. Wifi: never entered. Ethernet: empty.</span>
      </div>

      {/* TV */}
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 86,
          width: 760,
          height: 440,
          borderRadius: 14,
          background: C.bezel,
          padding: 10,
          boxShadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
          opacity: powerFlicker,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 8, overflow: "hidden" }}>
          <TvScreen frame={frame} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 48 + 300,
          top: 526,
          width: 160,
          height: 12,
          borderRadius: 6,
          background: C.bezel,
        }}
      />

      {/* Source box and cable */}
      <div
        style={{
          position: "absolute",
          left: 48 + 560,
          top: 560,
          width: 110,
          height: 28,
          borderRadius: 7,
          background: "#1f2937",
          border: `1px solid ${C.line}`,
          color: C.muted,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Source box
      </div>
      <div
        style={{
          position: "absolute",
          left: 48 + 663,
          top: 538,
          width: 2,
          height: 24,
          background: C.dim,
        }}
      />

      {/* Scorecard */}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 86,
          width: 400,
          padding: "22px 26px 6px",
          borderRadius: 14,
          background: C.panel,
          border: `1px solid ${C.line}`,
        }}
      >
        <div style={{ color: C.muted, fontSize: 16, letterSpacing: 1 }}>OFFLINE SCORECARD</div>
        <div style={{ marginTop: 8 }}>
          <ScoreLine
            frame={frame}
            label="Setup without network"
            value="Skip allowed"
            on={frame >= SKIP_CLICK + 4}
            delayFrom={SKIP_CLICK + 4}
          />
          <ScoreLine
            frame={frame}
            label="Nag screens on boot"
            value="1, dismissable"
            on={frame >= NAG_OUT}
            color={C.amber}
            delayFrom={NAG_OUT}
          />
          <ScoreLine
            frame={frame}
            label="Boot to HDMI 1"
            value={frame >= HDMI_IN + 6 ? "14s" : `${bootSeconds}s`}
            on={frame >= NAG_IN}
            delayFrom={NAG_IN}
          />
          <ScoreLine
            frame={frame}
            label="ACR, voice, telemetry toggles"
            value="4 found, all off"
            on={frame >= TOGGLES_DONE}
            delayFrom={TOGGLES_DONE}
          />
          <ScoreLine
            frame={frame}
            label="Remembers HDMI 1 after power cut"
            value="Yes"
            on={frame >= POWER_BACK + 8}
            delayFrom={POWER_BACK + 8}
          />
        </div>
      </div>

      {/* Result row */}
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 626,
          height: 110,
          borderRadius: 14,
          background: C.panel,
          border: `1px solid ${C.line}`,
          opacity: rowT,
          transform: `translateY(${(1 - rowT) * 24}px)`,
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          gap: 34,
          color: C.ink,
          fontSize: 20,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: C.green,
            color: C.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>77in OLED added to the offline TV list</div>
          <div style={{ color: C.muted, fontSize: 18, marginTop: 4 }}>
            Boot to HDMI 14s. 1 nag, dismissable. 4 privacy toggles, all off and kept after power cut.
          </div>
        </div>
        <div style={{ textAlign: "right", color: C.muted, fontSize: 17, lineHeight: 1.4 }}>
          <div>Firmware recorded</div>
          <div>Test date recorded</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
