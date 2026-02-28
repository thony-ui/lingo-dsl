import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode } from "lucide-react";

interface CompiledCodeCardProps {
  compiledCode: string;
}

export function CompiledCodeCard({ compiledCode }: CompiledCodeCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <CardTitle className="text-sm">Compiled JavaScript</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-zinc-900 dark:bg-zinc-950 rounded-md p-3 max-h-75 overflow-auto">
          <pre className="text-xs text-zinc-100 font-mono whitespace-pre-wrap break-all">
            {compiledCode || "// No code compiled yet"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
