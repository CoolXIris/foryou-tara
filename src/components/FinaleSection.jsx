import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, RotateCcw, Gift, Play, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinaleSection({ onFinaleVisible, onRestart, onVideoPlay, hasLikedAllMemories }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const flashTimerRef = useRef(null);
  const [stage, setStage] = useState(0); // 0: unrevealed, 1: "Before you leave...", 2: Full letter
  const [loveCount, setLoveCount] = useState(0);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [isGiftCompleted, setIsGiftCompleted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = `${import.meta.env.BASE_URL}assets/video/birthday-message.mp4`;

  const closeGiftDialog = useCallback(() => {
    if (hasVideoStarted) return;
    setIsGiftDialogOpen(false);
    setVideoError(false);
  }, [hasVideoStarted]);

  useEffect(() => () => window.clearTimeout(flashTimerRef.current), []);

  useEffect(() => {
    if (!isGiftDialogOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !hasVideoStarted) closeGiftDialog();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeGiftDialog, isGiftDialogOpen, hasVideoStarted]);

  const openGift = () => {
    if (isGiftCompleted) return;
    setIsFlashActive(true);
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setIsGiftDialogOpen(true);
      setIsFlashActive(false);
    }, 520);
  };

  const startVideo = async () => {
    if (!videoRef.current) return;
    setVideoError(false);
    onVideoPlay?.();
    try {
      await videoRef.current.play();
      setHasVideoStarted(true);
    } catch {
      setVideoError(true);
    }
  };

  const handleVideoEnded = () => {
    setIsGiftDialogOpen(false);
    setIsGiftCompleted(true);
    setHasVideoStarted(false);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onFinaleVisible(true);
          // Automatically transition to stage 1
          if (stage === 0) {
            setStage(1);
            // After 3 seconds, transition to stage 2 (full emotional letter)
            setTimeout(() => {
              setStage(2);
            }, 3200);
          }
        } else {
          onFinaleVisible(false);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [stage, onFinaleVisible]);

  const handleHeartClick = () => {
    setLoveCount((prev) => prev + 1);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#cbd5e1'],
      shapes: ['circle']
    });
  };

  return (
    <section
      ref={sectionRef}
      id="finale"
      className="relative min-h-[110svh] w-full flex flex-col items-center justify-center px-5 sm:px-8 py-28 bg-[#050308] text-white overflow-hidden transition-colors duration-1000"
    >
      {/* Deep velvet night backdrop with subtle cosmic nebula */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0714]/80 to-[#050308] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-950/20 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full mx-auto flex flex-col items-center text-center">
        {/* Stage 1: The subtle teaser sentence */}
        <div
          className={`transition-all duration-1000 ${
            stage >= 1
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-6 blur-xs'
          } mb-12`}
        >
          <p className="font-serif-romantic italic text-sm sm:text-base md:text-lg text-neutral-400 tracking-wide">
            Before you leave, there's one more thing I want you to know...
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent mx-auto mt-4" />
        </div>

        {/* Stage 2: The Heartfelt Letter */}
        <div
          className={`space-y-7 transition-all duration-1000 delay-300 max-w-2xl text-left ${
            stage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          {/* Paragraph 1 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
            Di antara banyak hal baik yang ane harapkan datang ke hidupmu, ada satu hal yang mungkin belum pernah ane sampaikan.
          </p>

          {/* Paragraph 2 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
            Ane nggak tahu bakal sejauh apa perjalanan kamu setelah hari ini, berapa banyak mimpi yang nantinya berhasil kamu wujudkan, atau berapa banyak hal baru yang akan kamu temui.
          </p>

          {/* Paragraph 3 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
            Tapi kalau boleh jujur, ane berharap bisa melihat lebih banyak cerita tentangmu. Ngeliat kamu tumbuh, merayakan pencapaian kecil maupun besarmu, dan menyaksikan bagaimana kamu perlahan menjadi seseorang yang selama ini kamu usahakan.
          </p>

          {/* Paragraph 4 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-200/95 leading-relaxed font-normal">
            Dan mungkin, tanpa kamu sadari, mengenalmu sudah menjadi salah satu hal sederhana yang membuat hari-hari diri ini terasa lebih berwarna.
          </p>

          {/* Paragraph 5 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-pink-300 leading-relaxed font-light italic">
            So, here's to another chapter of your life. I hope it will be as beautiful as the person who's living it.
          </p>

          {/* Final Emotional Signature */}
          <div className="pt-8 text-center space-y-3">
            <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-rose-300 tracking-wide">
              Happy birthday, Taraa. ♡
            </h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
              Always wishing you the very best
            </p>
            {hasLikedAllMemories && !isGiftCompleted && (
              <div className="mt-7 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={openGift}
                  aria-label="Buka hadiah ulang tahun"
                  className="gift-box-button group relative flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200/25 bg-gradient-to-br from-rose-400/20 via-pink-500/15 to-amber-300/10 text-amber-100 shadow-[0_0_35px_rgba(244,114,182,0.12)] transition hover:border-amber-100/50 hover:shadow-[0_0_45px_rgba(251,191,36,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
                >
                  <span className="gift-box-lid" />
                  <Gift className="relative z-10 h-9 w-9 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] transition-transform group-hover:scale-110" />
                  <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-amber-200" />
                </button>
                <span className="text-[10px] uppercase tracking-[0.28em] text-amber-100/60">ketauan tuhh semua fotonya kamu like</span>
              </div>
            )}
          </div>

          {/* Interactive Closing Actions */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            {/* Love tap button */}
            <button
              onClick={handleHeartClick}
              className="px-6 py-3 rounded-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-200 text-sm font-medium tracking-wide flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
              <span>Kirimkan Doa Tulus</span>
              {loveCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-xs">
                  +{loveCount}
                </span>
              )}
            </button>

            {/* Replay button */}
            <button
              onClick={onRestart}
              className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" />
              <span>Putar Kembali Cerita ↺</span>
            </button>
          </div>
        </div>
      </div>

      {isFlashActive && <div className="birthday-flash fixed inset-0 z-[100]" aria-hidden="true" />}

      {isGiftDialogOpen && (
        <div className="video-gift-overlay fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-8" role="presentation">
          <button
            type="button"
            aria-label="Tutup video hadiah"
            onClick={closeGiftDialog}
            disabled={hasVideoStarted}
            className="absolute inset-0 bg-[#07040b]/90 backdrop-blur-xl disabled:cursor-default"
          />
          <div
            className="video-gift-card relative z-10 my-auto w-full max-w-[350px] rounded-[2rem] border border-white/15 bg-[#130f19] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.75)] sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-gift-title"
          >
            {!hasVideoStarted && (
              <button
                type="button"
                onClick={closeGiftDialog}
                aria-label="Tutup hadiah"
                className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {!hasVideoStarted && (
              <div className="mb-3 px-3 pt-3 text-center">
                <p className="mb-1 text-[10px] uppercase tracking-[0.32em] text-pink-200/60">A little something for you</p>
              </div>
            )}
            <h2 id="video-gift-title" className={hasVideoStarted ? 'sr-only' : 'mb-3 px-3 pt-3 text-center font-serif-romantic text-xl text-white'}>
              Pake acara ketauan pulaa, jangan diliat pliss...
            </h2>
            <div className="video-portrait-frame relative mx-auto aspect-[9/16] max-h-[68svh] w-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(236,72,153,0.22),transparent_58%),linear-gradient(160deg,#28152a,#0c0a12_75%)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-pink-100/70" aria-hidden="true">
                <Sparkles className="h-8 w-8 text-amber-200/80" />
                <span className="font-script text-2xl">Sebuah pesan kecil untukmu</span>
              </div>
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                preload="metadata"
                controls={hasVideoStarted}
                onPlay={() => setHasVideoStarted(true)}
                onEnded={handleVideoEnded}
                onError={() => setVideoError(true)}
                className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300 ${hasVideoStarted ? 'opacity-100' : 'opacity-0'}`}
              />
              {!hasVideoStarted && (
                <button
                  type="button"
                  onClick={startVideo}
                  aria-label="Putar video ucapan ulang tahun"
                  className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-black/15 text-white transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.25)] backdrop-blur-md transition hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-white" />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-white/90">Klik untuk menonton</span>
                </button>
              )}
            </div>
            {!hasVideoStarted && (
              <p className="px-3 pb-2 pt-4 text-center text-xs leading-relaxed text-neutral-400">
                {videoError
                  ? 'Video belum tersedia. Tambahkan file birthday-message.mp4 ke public/assets/video lalu muat ulang halaman.'
                  : 'Tekan tombol play untuk mendengar ucapan spesial dariku.'}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
