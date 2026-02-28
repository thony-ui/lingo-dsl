"use client";

import { useIframePreview } from "@/hooks/useIframePreview";
import { CompilationError } from "@/components/preview/CompilationError";

interface LivePreviewProps {
  compiledCode: string;
  error: string | null;
}

export default function LivePreview({ compiledCode, error }: LivePreviewProps) {
  const iframeRef = useIframePreview(compiledCode);

  return (
    <div className="h-full w-full flex flex-col border-r border-zinc-200 dark:border-zinc-800">
      <PreviewHeader />
      <PreviewContent
        iframeRef={iframeRef}
        error={error}
      />
    </div>
  );
}

function PreviewHeader() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
      <LiveIndicator />
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Live Preview
      </h2>
    </div>
  );
}

function LiveIndicator() {
  return <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>;
}

interface PreviewContentProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  error: string | null;
}

function PreviewContent({ iframeRef, error }: PreviewContentProps) {
  if (error) {
    return <CompilationError error={error} />;
  }

  return (
    <PreviewIframe iframeRef={iframeRef} />
  );
}

interface PreviewIframeProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

function PreviewIframe({ iframeRef }: PreviewIframeProps) {
  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full bg-white dark:bg-zinc-950"
      sandbox="allow-scripts allow-same-origin"
      title="Live Preview"
    />
  );
}
