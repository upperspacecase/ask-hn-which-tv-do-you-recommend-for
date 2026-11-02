"use client";

import { useState, type FormEvent } from "react";

const SOURCE_DEVICES = ["Apple TV", "Shield", "Linux mini PC", "Other"];
const TARGET_SIZES = ["60-65", "70-75", "77-85"];

type Status = "idle" | "submitting" | "done" | "error";

function Pills({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-base text-muted">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <label
              key={opt}
              className={`cursor-pointer rounded-full border px-4 py-2 text-base font-medium transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg ${
                active
                  ? "border-ink-strong bg-ink-strong text-white"
                  : "border-line bg-surface text-ink hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={active}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const buttonClass =
  "cursor-pointer rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-ink-strong transition-colors duration-200 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50";

export default function Hero() {
  const [step, setStep] = useState<1 | 2>(1);
  const [sourceDevice, setSourceDevice] = useState("");
  const [targetSize, setTargetSize] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const stepOneReady = sourceDevice && targetSize;
  const sizeLabel = `${targetSize.split("-")[1]}in`;
  const deviceLabel = sourceDevice === "Other" ? "your source box" : sourceDevice;

  function handleStepOne(e: FormEvent) {
    e.preventDefault();
    if (!stepOneReady) return;
    setStep(2);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    const payload = { email, sourceDevice, targetSize };
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad response");
      try {
        const prior = JSON.parse(
          localStorage.getItem("offline_tv_waitlist") || "[]"
        ) as unknown[];
        prior.push(payload);
        localStorage.setItem("offline_tv_waitlist", JSON.stringify(prior));
      } catch {
        // localStorage unavailable; signal still recorded server-side
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-20 sm:pt-28 lg:pt-32">
      <h1 className="display max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)]">
        Which 65 to 85 inch 4K TVs still boot straight to HDMI when you never
        give them a network.
      </h1>

      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">
        For engineers who run Jellyfin off a NAS, feed the panel one Shield or
        Apple TV, and want to know before the box is upstairs whether the TV
        will nag, stall, or spy when it stays offline for life.
      </p>

      {status === "done" ? (
        <div className="mt-10 max-w-xl rounded-2xl border border-line bg-surface p-6">
          <p className="text-lg font-semibold text-ink-strong">
            You&rsquo;re on the list.
          </p>
          <p className="mt-1.5 text-base text-muted">
            One email when the {sizeLabel} panels tested with {deviceLabel} are
            published. Nothing in between, and no tracking.
          </p>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleStepOne} className="mt-10 max-w-2xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <Pills
              name="source"
              legend="Source device"
              options={SOURCE_DEVICES}
              value={sourceDevice}
              onChange={setSourceDevice}
            />
            <Pills
              name="size"
              legend="Target size, inches"
              options={TARGET_SIZES}
              value={targetSize}
              onChange={setTargetSize}
            />
          </div>

          <button
            type="submit"
            disabled={!stepOneReady}
            className={`mt-7 ${buttonClass}`}
          >
            Get the offline TV list
          </button>
        </form>
      ) : (
        <div className="mt-10 max-w-2xl">
          <p className="text-base text-muted">
            {sourceDevice} into a {targetSize} inch panel.{" "}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="cursor-pointer font-medium text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Change
            </button>
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-3 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3.5 text-base text-ink-strong placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className={buttonClass}
            >
              {status === "submitting"
                ? "Sending"
                : `Notify me about ${sizeLabel} panels tested with ${deviceLabel}`}
            </button>
          </form>
          <p className="mt-3 text-base text-muted">
            Email me when the tested list ships. One email. No tracking.
          </p>
          {status === "error" && (
            <p className="mt-2.5 text-base text-red-700">
              Something went wrong. Try again in a moment.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
