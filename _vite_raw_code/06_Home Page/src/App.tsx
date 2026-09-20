import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import RightPanel from "./components/RightPanel";

export default function App() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#F7F6F1", fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center + Right wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar spans main + right */}
        <TopBar />

        {/* Body row */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main scrollable content */}
          <MainContent />

          {/* Right panel */}
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
