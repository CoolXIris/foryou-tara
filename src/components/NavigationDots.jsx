import React from 'react';

export default function NavigationDots({ activeId, memories, onSelectMemory }) {
  return (
    <nav 
      aria-label="Navigation progress" 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 p-2 rounded-full bg-neutral-950/40 border border-white/10 backdrop-blur-md shadow-xl"
    >
      {/* Hero Dot */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Back to top"
        className="group relative flex items-center justify-center p-1"
      >
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeId === 'hero'
              ? 'w-2.5 h-2.5 bg-pink-400 ring-4 ring-pink-500/20'
              : 'bg-neutral-600 group-hover:bg-neutral-400'
          }`}
        />
        <span className="absolute right-7 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          Opening
        </span>
      </button>

      {/* Memory Dots */}
      {memories.map((mem) => {
        const isActive = activeId === mem.id;
        return (
          <button
            key={mem.id}
            onClick={() => onSelectMemory(mem.id)}
            aria-label={mem.title}
            className="group relative flex items-center justify-center p-1"
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-2.5 h-2.5 bg-rose-400 ring-4 ring-rose-500/20 scale-125'
                  : 'bg-neutral-600 group-hover:bg-neutral-400'
              }`}
            />
            <span className="absolute right-7 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {mem.tag}
            </span>
          </button>
        );
      })}

      {/* Cake Wish Dot */}
      <button
        onClick={() => {
          document.getElementById('wish-cake')?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="Wish Cake"
        className="group relative flex items-center justify-center p-1"
      >
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeId === 'cake'
              ? 'w-2.5 h-2.5 bg-amber-400 ring-4 ring-amber-500/20'
              : 'bg-neutral-600 group-hover:bg-neutral-400'
          }`}
        />
        <span className="absolute right-7 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          Make A Wish 🎂
        </span>
      </button>

      {/* Finale Dot */}
      <button
        onClick={() => {
          document.getElementById('finale')?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="One more thing"
        className="group relative flex items-center justify-center p-1"
      >
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeId === 'finale'
              ? 'w-2.5 h-2.5 bg-purple-400 ring-4 ring-purple-500/20'
              : 'bg-neutral-600 group-hover:bg-neutral-400'
          }`}
        />
        <span className="absolute right-7 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          One More Thing... ♡
        </span>
      </button>
    </nav>
  );
}
