import React from "react";

const SettingBar = ({
  strokeColor,
  strokeSize,
  opacity,
  onStrokeColorChange,
  onStrokeSizeChange,
  onOpacityChange,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-cyan-300/25 bg-slate-950/80 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_12px_40px_-24px_rgba(34,211,238,0.8)]">
        <h1 className="mr-2 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-semibold tracking-wide text-cyan-200">
          Canvas Settings
        </h1>

        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-300">
          <span>Stroke</span>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded-md border border-cyan-200/30 bg-transparent p-0.5"
          />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-300">
          <span>Size {strokeSize}px</span>
          <input
            type="range"
            min="1"
            max="30"
            value={strokeSize}
            onChange={(e) => onStrokeSizeChange(Number(e.target.value))}
            className="h-1.5 w-32 cursor-pointer accent-cyan-400"
          />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-300">
          <span>Opacity {opacity}%</span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="h-1.5 w-32 cursor-pointer accent-cyan-400"
          />
        </label>
      </div>
    </header>
  );
};

export default SettingBar;
