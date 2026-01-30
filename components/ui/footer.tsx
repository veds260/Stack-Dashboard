"use client";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/40 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600">
        <span>Stack Daily Talent Pool</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
