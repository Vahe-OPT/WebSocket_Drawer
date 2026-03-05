import React from "react";

const tools = [
  { id: "select", label: "Select" },
  { id: "brush", label: "Brush" },
  { id: "line", label: "Line" },
  { id: "eraser", label: "Eraser" },
];

const ToolBar = ({ tool, onToolChange, onClear }) => {
  const buttonClass = (isActive) =>
    `rounded-xl border px-3 py-1.5 text-sm transition hover:-translate-y-0.5 ${
      isActive
        ? "border-cyan-300/40 bg-cyan-400/15 font-semibold text-cyan-200 hover:bg-cyan-300/25"
        : "border-white/15 bg-white/5 font-medium text-slate-200 hover:bg-white/10"
    }`;

  return (
    <section className="sticky top-[5.25rem] z-20 w-full px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 backdrop-blur-xl shadow-[0_16px_45px_-22px_rgba(14,165,233,0.85)]">
        <div className="flex flex-wrap items-center gap-2">
          {tools.map((item) => (
            <button key={item.id} className={buttonClass(tool === item.id)} onClick={() => onToolChange(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClear}
          className="rounded-xl border border-rose-300/40 bg-rose-400/20 px-4 py-1.5 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-400/30"
        >
          Clear
        </button>
      </div>
    </section>
  );
};

export default ToolBar;
