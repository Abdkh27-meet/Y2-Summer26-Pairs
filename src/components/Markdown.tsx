import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function Markdown({ content, accent }: { content: string; accent: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");
            if (!inline && match) {
              return <CodeBlock code={code} language={match[1]} accent={accent} />;
            }
            return (
              <code
                className="inline-code"
                style={{ color: accent }}
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ children, href }) {
            return (
              <a href={href} target="_blank" rel="noreferrer" style={{ color: accent }}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({
  code,
  language,
  accent,
}: {
  code: string;
  language: string;
  accent: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span style={{ color: accent }}>{language}</span>
        <button onClick={copy} className="code-copy-btn" aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: "transparent",
          fontSize: 13,
          padding: "14px 16px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
