import React, { useEffect, useRef } from "react";

const Canvas = ({ sendMsg, lastMessage, tool, strokeColor, strokeSize, opacity, clearNonce }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const applyStrokeStyle = () => {
    const ctx = ctxRef.current;
    if (!ctx) {
      return;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeSize;
    ctx.globalAlpha = opacity / 100;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "#000000";
      return;
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeColor;
  };

  const drawLineSegment = (x1, y1, x2, y2, style = null) => {
    const ctx = ctxRef.current;
    if (!ctx) {
      return;
    }
    if (style) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = style.size;
      ctx.globalAlpha = style.opacity / 100;
      if (style.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "#000000";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = style.color;
      }
    } else {
      applyStrokeStyle();
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const handleMouseDown = (event) => {
    if (tool === "select") {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    isDrawingRef.current = true;
    const point = getPoint(event);
    startPointRef.current = point;

    if (tool === "line") {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return;
    }
    drawLineSegment(point.x, point.y, point.x + 0.001, point.y + 0.001);
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    const point = getPoint(event);
    const lastPoint = startPointRef.current;

    if (tool === "line") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      drawLineSegment(lastPoint.x, lastPoint.y, point.x, point.y);
      return;
    }
    drawLineSegment(lastPoint.x, lastPoint.y, point.x, point.y);
    sendMsg?.({
      type: "draw",
      payload: {
        tool,
        color: strokeColor,
        size: strokeSize,
        opacity,
        from: lastPoint,
        to: point,
      },
    });
    startPointRef.current = point;
  };

  const stopDrawing = (event) => {
    if (!isDrawingRef.current) {
      return;
    }
    isDrawingRef.current = false;
    if (tool === "line") {
      const point = getPoint(event);
      const start = startPointRef.current;
      drawLineSegment(start.x, start.y, point.x, point.y);
      sendMsg?.({
        type: "draw",
        payload: {
          tool,
          color: strokeColor,
          size: strokeSize,
          opacity,
          from: start,
          to: point,
        },
      });
      snapshotRef.current = null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const updateSize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
    };

    ctxRef.current = ctx;
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [clearNonce]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    if (lastMessage.type === "clear") {
      clearCanvas();
      return;
    }
    if (lastMessage.type !== "draw") {
      return;
    }
    const payload = lastMessage.payload;
    if (!payload?.from || !payload?.to) {
      return;
    }
    drawLineSegment(payload.from.x, payload.from.y, payload.to.x, payload.to.y, {
      tool: payload.tool,
      color: payload.color,
      size: payload.size,
      opacity: payload.opacity,
    });
  }, [lastMessage]);

  const cursorClass = tool === "select" ? "cursor-default" : "cursor-crosshair";

  return (
    <main className="relative min-h-[calc(100vh-10rem)] w-full overflow-hidden px-4 pb-8 pt-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(6,182,212,0.25),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.22),transparent_38%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(15,23,42,0.95))]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-cyan-100/15 bg-slate-900/55 p-4 shadow-[0_25px_75px_-35px_rgba(34,211,238,0.85)] backdrop-blur-sm">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`h-[68vh] w-full rounded-2xl border border-cyan-200/20 bg-slate-100 shadow-inner shadow-slate-900/25 ${cursorClass}`}
        />
      </div>
    </main>
  );
};

export default Canvas;
