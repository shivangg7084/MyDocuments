import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  PictureInPicture2,
  Gauge,
} from "lucide-react";
import { clsx } from "clsx";

interface VideoPlayerProps {
  src: string;
  title: string;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pipSupported, setPipSupported] = useState(false);

  useEffect(() => {
    setPipSupported(typeof document !== "undefined" && "pictureInPictureEnabled" in document);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const video = videoRef.current;
      if (!video) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      } else if (e.key === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 5);
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "m") {
        toggleMute();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void container.requestFullscreen();
  }

  async function togglePip() {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP not available for this media — ignore.
    }
  }

  function changeSpeed(rate: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setSpeed(rate);
    setSpeedMenuOpen(false);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-xl bg-black"
      aria-label={title}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        className="aspect-video w-full bg-black"
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={(e) => {
            const video = videoRef.current;
            const value = Number(e.target.value);
            if (video) video.currentTime = value;
            setCurrent(value);
          }}
          className="h-1.5 w-full cursor-pointer accent-indigo-500"
          style={{
            background: `linear-gradient(to right, rgb(99 102 241) ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
          }}
          aria-label="Seek"
        />

        <div className="mt-2 flex items-center gap-2 text-white">
          <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const video = videoRef.current;
              const value = Number(e.target.value);
              if (video) {
                video.volume = value;
                video.muted = value === 0;
              }
            }}
            className="h-1.5 w-16 cursor-pointer accent-indigo-500"
            aria-label="Volume"
          />

          <span className="ml-1 text-xs tabular-nums text-white/90">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <span className="flex-1" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setSpeedMenuOpen((o) => !o)}
              aria-label="Playback speed"
              className="flex items-center gap-1 text-xs"
            >
              <Gauge className="h-4 w-4" />
              {speed}x
            </button>
            {speedMenuOpen && (
              <div className="absolute bottom-7 right-0 rounded-lg bg-slate-900 py-1 shadow-lg">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeSpeed(s)}
                    className={clsx(
                      "block w-full whitespace-nowrap px-3 py-1 text-left text-xs hover:bg-slate-800",
                      s === speed ? "text-indigo-400" : "text-white",
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {pipSupported && (
            <button type="button" onClick={togglePip} aria-label="Picture in picture">
              <PictureInPicture2 className="h-4 w-4" />
            </button>
          )}

          <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
