import React, { useEffect, useRef, useState } from "react";
import SettingBar from "./components/SettingBar";
import ToolBar from "./components/Toolbar";
import Canvas from "./components/Canvas";

const App = () => {
  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);

  const [tool, setTool] = useState("brush");
  const [strokeColor, setStrokeColor] = useState("#06b6d4");
  const [strokeSize, setStrokeSize] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [clearNonce, setClearNonce] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("connecting to WebSocket");
    };

    ws.onmessage = (eventFromServer) => {
      try {
        const message = JSON.parse(eventFromServer.data);
        setLastMessage(message);
      } catch (err) {
        console.log(err);
      }
    };
    ws.onerror = () => {
      console.log("Error case");
    };
    ws.onclose = () => {
      console.log("Connection Closed!");
    };
    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  const sendMsg = (message) => {
    console.log("Sending msg");
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(JSON.stringify(message));
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <SettingBar
        strokeColor={strokeColor}
        strokeSize={strokeSize}
        opacity={opacity}
        onStrokeColorChange={setStrokeColor}
        onStrokeSizeChange={setStrokeSize}
        onOpacityChange={setOpacity}
      />
      <ToolBar
        tool={tool}
        onToolChange={setTool}
        onClear={() => setClearNonce((n) => n + 1)}
      />
      <Canvas
      lastMessage={lastMessage}
        sendMsg={sendMsg}
        tool={tool}
        strokeColor={strokeColor}
        strokeSize={strokeSize}
        opacity={opacity}
        clearNonce={clearNonce}
      />
    </div>
  );
};

export default App;
