import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

export default function AudioPlayer({ audioRef, isFinaleActive, hasUserInteracted, setHasUserInteracted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const userVolume = 0.85;
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.loop = true;
    audio.volume = userVolume;

    const syncPlayback = () => setIsPlaying(!audio.paused);
    const syncMute = () => setIsMuted(audio.muted);
    const hideNotification = () => setShowNotification(false);
    audio.addEventListener('play', syncPlayback);
    audio.addEventListener('pause', syncPlayback);
    audio.addEventListener('volumechange', syncMute);
    audio.addEventListener('play', hideNotification);
    return () => {
      audio.removeEventListener('play', syncPlayback);
      audio.removeEventListener('pause', syncPlayback);
      audio.removeEventListener('volumechange', syncMute);
      audio.removeEventListener('play', hideNotification);
    };
  }, [audioRef, userVolume]);

  // Lower the background music gently while the finale is on screen.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused || isMuted) return undefined;

    const targetVolume = isFinaleActive ? 0.22 : userVolume;
    const startingVolume = audio.volume;
    const step = (targetVolume - startingVolume) / 25;
    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      const nextVolume = startingVolume + step * count;
      audio.volume = Math.max(0, Math.min(1, count >= 25 ? targetVolume : nextVolume));
      if (count >= 25) window.clearInterval(interval);
    }, 40);

    return () => window.clearInterval(interval);
  }, [audioRef, isFinaleActive, isPlaying, isMuted, userVolume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasUserInteracted) setHasUserInteracted(true);

    if (audio.paused) {
      audio.play().catch(() => setShowNotification(true));
    } else {
      audio.pause();
    }
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  };

  return (
    <>
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}assets/audio/bgm.mp3`} preload="auto" />

      {hasUserInteracted && (
        <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
          {showNotification && !isPlaying && (
            <div className="hidden animate-pulse items-center gap-1.5 rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1.5 text-xs text-pink-200 backdrop-blur-md sm:flex">
              <Music className="h-3.5 w-3.5 text-pink-400" />
              <span>Musik dimulai saat cerita dibuka</span>
            </div>
          )}

          <div className="group relative flex items-center gap-2.5 rounded-full border border-neutral-700/60 bg-neutral-900/80 px-3.5 py-2 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/50">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-300"
            >
              <Disc className={`h-4 w-4 text-pink-400 transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              <span className="flex h-3.5 w-4 items-end gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((bar) => (
                  <span
                    key={bar}
                    className={`w-0.5 rounded-full bg-gradient-to-t from-pink-500 to-rose-300 transition-all duration-300 ${
                      isPlaying ? 'h-full animate-bounce' : 'h-1'
                    }`}
                    style={{ animationDelay: `${bar * -0.15}s` }}
                  />
                ))}
              </span>
              <span className="text-xs font-medium tracking-wide text-neutral-200">
                {isFinaleActive ? 'Atmospheric BGM' : isPlaying ? 'BGM Playing' : 'BGM Paused'}
              </span>
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-pink-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-300"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
