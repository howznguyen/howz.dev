import { ReactNode, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components/prism-markup-templating.js";
import Icon from "./Icon";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
}

const CodeBlock = ({ children, language }: CodeBlockProps) => {
  let lang = language ? `language-${language}` : "language-markup";
  let textRef = useRef<HTMLDivElement>(null);
  let [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const renderFunc = async () => {
      let _language = language ?? "markup";
      try {
        await import(`prismjs/components/prism-${_language}.js`);
      } catch (error) {}

      await Prism.highlightAll();
    };

    renderFunc();
  }, [language]);

  return (
    <pre className="relative rounded-lg md:code-block">
      <CopyToClipboard
        text={textRef?.current?.textContent ?? ""}
        onCopy={() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1500);
        }}
      >
        <button title="Copy Code" className="absolute top-2 right-2 hidden rounded border border-gray-600 p-2 text-lg transition-colors hover:bg-gray-700 md:block">
          {isCopied ? (
            <Icon icon="HiCheckCircle" className="text-blue-400"/>
          ) : (
            <Icon icon="HiClipboard"/>
          )}
        </button>
      </CopyToClipboard>

      <div className="absolute top-2 left-2 hidden rounded p-2 text-lg font-semibold md:flex select-none items-center">
          <span>{language}</span> 
      </div>

      <code ref={textRef} className={lang}>
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;
