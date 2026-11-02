import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

export default function AudioPlayer({ isFinaleActive, hasUserInteracted, setHasUserInteracted }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userVolume, setUserVolume] = useState(0.85);
  const [showNotification, setShowNotification] = useState(true);

  // Initialize and handle first scroll / interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = userVolume;

    const startAudioOnAction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowNotification(false);
          })
          .catch((err) => {
            console.log('Audio autoplay prevented, awaiting manual interaction:', err);
          });
      }
      window.removeEventListener('scroll', startAudioOnAction);
      window.removeEventListener('click', startAudioOnAction);
      window.removeEventListener('touchstart', startAudioOnAction);
    };

    window.addEventListener('scroll', startAudioOnAction, { passive: true, once: true });
    window.addEventListener('click', startAudioOnAction, { once: true });
    window.addEventListener('touchstart', startAudioOnAction, { passive: true, once: true });

    return () => {
      window.removeEventListener('scroll', startAudioOnAction);
      window.removeEventListener('click', startAudioOnAction);
      window.removeEventListener('touchstart', startAudioOnAction);
    };
  }, [hasUserInteracted, setHasUserInteracted, userVolume]);

  // Smoothly dim volume when Finale section is reached ("Musik sedikit mengecil...")
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || isMuted) return;

    let targetVolume = isFinaleActive ? 0.22 : userVolume;
    let currentVol = audio.volume;
    const step = (targetVolume - currentVol) / 25;
    let count = 0;

    const interval = setInterval(() => {
      count++;
      currentVol += step;
      if (
        (step > 0 && currentVol >= targetVolume) ||
        (step < 0 && currentVol <= targetVolume) ||
        count >= 25
      ) {
        audio.volume = Math.max(0, Math.min(1, targetVolume));
        clearInterval(interval);
      } else {
        audio.volume = Math.max(0, Math.min(1, currentVol));
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isFinaleActive, isPlaying, isMuted, userVolume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowNotification(false);
        })
        .catch(console.error);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="./assets/audio/bgm.mp3" preload="auto" />

      {/* Floating Audio Controller */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        {/* Soft hint if not playing yet */}
        {showNotification && !isPlaying && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-200 text-xs backdrop-blur-md animate-pulse">
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span>Scroll kebawah untuk musik 🎵</span>
          </div>
        )}

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-neutral-900/80 border border-neutral-700/60 hover:border-pink-500/50 backdrop-blur-xl shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Rotating vinyl icon */}
          <Disc
            className={`w-4 h-4 text-pink-400 transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          />

          {/* Equalizer bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-4">
            <span
              className={`w-0.5 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-full animate-bounce [animation-delay:-0.3s]' : 'h-1'
              }`}
            />
            <span
              className={`w-0.5 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-full animate-bounce [animation-delay:-0.15s]' : 'h-1'
              }`}
            />
            <span
              className={`w-0.5 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-full animate-bounce [animation-delay:-0.45s]' : 'h-1'
              }`}
            />
          </div>

          <span className="text-xs font-medium text-neutral-200 tracking-wide">
            {isFinaleActive ? 'Atmospheric BGM' : isPlaying ? 'BGM Playing' : 'BGM Paused'}
          </span>

          {/* Mute button */}
          <div
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-pink-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>
    </>
  );
}
