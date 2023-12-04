// Create reference instance
import katex from "katex";
import katexStyle from "katex/dist/katex.min.css";
import { marked } from "marked";
import React from "react";

const renderKatex = (text: string, displayMode: boolean) => {
  return katex.renderToString(text, {
    displayMode,
    macros: {
      "\\RR": "\\mathbb{R}",
      "\\ZZ": "\\mathbb{Z}",
      "\\f": "#1f(#2)",
    },
  });
};

export function links() {
  return [{ rel: "stylesheet", href: katexStyle }];
}

marked.use({
  renderer: {
    paragraph(text) {
      let result = text;
      result = result.replace(/(\$\$((.|\n)+?)\$\$)/gm, (match, p1, p2) => {
        return renderKatex(p2, true);
      });

      result = result.replace(/(\$((.|\n)+?)\$)/gm, (match, p1, p2) => {
        return renderKatex(p2, false);
      });
      return `<p>${result}</p>`;
    },
  },
});

const Render: React.FC<{ children: string }> = ({ children }) => {
  return (
    <div
      className="leading-normal"
      dangerouslySetInnerHTML={{ __html: marked(children) }}
    />
  );
};

export default React.memo(Render);
