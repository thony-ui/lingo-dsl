import { useEffect, useRef } from "react";
import { generateSandboxHTML } from "@/utils/sandboxHTML";

export function useIframePreview(compiledCode: string) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !compiledCode) return;

    const sandboxHTML = generateSandboxHTML(compiledCode);
    iframeRef.current.srcdoc = sandboxHTML;
  }, [compiledCode]);

  return iframeRef;
}
