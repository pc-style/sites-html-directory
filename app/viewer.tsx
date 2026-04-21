"use client";

import { useState } from "react";

type ViewerProps = {
  name: string | null;
  date: string | null;
  html: string | null;
};

export function Viewer({ name, date, html }: ViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  if (!name || !html) {
    return (
      <section className="viewer">
        <div className="viewer-header">
          <span className="viewer-title">No file selected</span>
        </div>
        <div className="empty-state">
          <p>Select a file from the directory.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="viewer">
        <div className="viewer-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="viewer-title">{name}</span>
            {date && <span className="viewer-date">{date}</span>}
          </div>
          <div className="viewer-actions">
            <button
              className="fullscreen-btn"
              onClick={() => setFullscreen(true)}
              title="Fullscreen"
              aria-label="Enter fullscreen"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 1 1 1 1 6" />
                <polyline points="10 1 15 1 15 6" />
                <polyline points="6 15 1 15 1 10" />
                <polyline points="10 15 15 15 15 10" />
              </svg>
            </button>
          </div>
        </div>
        <iframe
          className="viewer-frame"
          title={name}
          srcDoc={html}
          sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        />
      </section>

      {fullscreen && (
        <div className="fullscreen-overlay">
          <button
            className="fullscreen-exit"
            onClick={() => setFullscreen(false)}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
            Exit
          </button>
          <iframe
            title={name}
            srcDoc={html}
            sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
          />
        </div>
      )}
    </>
  );
}
