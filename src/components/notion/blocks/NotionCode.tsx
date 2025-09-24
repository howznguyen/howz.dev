"use client";

import { ReactNode, useState } from "react";
import { CodeBlock } from "react-code-block";
import { useCopyToClipboard } from "react-use";
import Icon from "@/components/atoms/Icon";

interface NotionCodeProps {
  children: ReactNode;
  language?: string;
}

export const NotionCode = ({ children, language }: NotionCodeProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const codeString = typeof children === "string" ? children : String(children);

  // Check if code has only one line
  const isSingleLine = codeString.split("\n").length === 1;

  const copyCode = () => {
    setIsCopied(true);
    copyToClipboard(codeString);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="pb-4">
      <CodeBlock code={codeString} language={language || "text"}>
        <div className="relative group">
          <CodeBlock.Code className="p-4 bg-gray-900 rounded-lg shadow-lg code-block-horizontal-scroll min-w-0">
            <div className="table-row">
              <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
              <CodeBlock.LineContent className="table-cell">
                <CodeBlock.Token />
              </CodeBlock.LineContent>
            </div>
          </CodeBlock.Code>

          {/* Copy Button */}
          <button
            className="absolute top-2 right-2 bg-gray-900 rounded border border-gray-600 p-2 text-sm transition-colors hover:bg-gray-700"
            onClick={copyCode}
          >
            {isCopied ? (
              <Icon icon="HiCheckCircle" className="text-white" />
            ) : (
              <Icon icon="HiClipboard" className="text-white" />
            )}
          </button>

          {/* Language Label - only show for multi-line code */}
          {!isSingleLine && (
            <div className="absolute bottom-4 right-2 text-sm bg-gray-700 rounded-lg text-gray-400 p-2 text-right lowercase select-none">
              {language}
            </div>
          )}
        </div>
      </CodeBlock>
    </div>
  );
};
