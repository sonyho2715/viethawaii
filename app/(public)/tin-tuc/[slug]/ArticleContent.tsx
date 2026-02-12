'use client';

import React from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal rule --- or ===
    if (/^(-{3,}|={3,})$/.test(trimmed)) {
      elements.push(
        <hr key={key++} className="my-8 border-t border-gray-200" />
      );
      i++;
      continue;
    }

    // H1 headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={key++} className="text-[22px] md:text-[26px] font-bold text-gray-900 mt-10 mb-4 leading-tight">
          {trimmed.slice(2)}
        </h2>
      );
      i++;
      continue;
    }

    // H2 headers
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-[20px] md:text-[22px] font-bold text-gray-900 mt-8 mb-3 leading-snug">
          {trimmed.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3 headers
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-[18px] md:text-[19px] font-semibold text-gray-900 mt-6 mb-2 leading-snug">
          {trimmed.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Image: ![caption](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const caption = imgMatch[1];
      const url = imgMatch[2];
      elements.push(
        <figure key={key++} className="my-6">
          <div className="relative w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={url}
              alt={caption}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-[13px] text-gray-500 italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Blockquote block (multi-line > ...)
    if (trimmed.startsWith('> ')) {
      const blockLines: string[] = [];
      let blockType: 'quote' | 'info' | 'warning' | 'tip' = 'quote';

      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        const bLine = lines[i].trim().slice(2);

        // Check for special block types
        if (bLine.startsWith('[!info]')) {
          blockType = 'info';
          const rest = bLine.slice(7).trim();
          if (rest) blockLines.push(rest);
        } else if (bLine.startsWith('[!warning]') || bLine.startsWith('[!cảnh báo]')) {
          blockType = 'warning';
          const rest = bLine.replace(/^\[!(warning|cảnh báo)\]/, '').trim();
          if (rest) blockLines.push(rest);
        } else if (bLine.startsWith('[!tip]') || bLine.startsWith('[!mẹo]')) {
          blockType = 'tip';
          const rest = bLine.replace(/^\[!(tip|mẹo)\]/, '').trim();
          if (rest) blockLines.push(rest);
        } else {
          blockLines.push(bLine);
        }
        i++;
      }

      const blockContent = blockLines.join('\n');

      if (blockType === 'info') {
        elements.push(
          <div key={key++} className="my-6 rounded-lg border border-blue-200 bg-blue-50 p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-blue-500 text-lg shrink-0">&#9432;</span>
              <div className="text-[15px] md:text-[16px] text-blue-900 leading-relaxed">
                {blockContent.split('\n').map((l, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                    {formatInlineText(l)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      } else if (blockType === 'warning') {
        elements.push(
          <div key={key++} className="my-6 rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-600 text-lg shrink-0">&#9888;</span>
              <div className="text-[15px] md:text-[16px] text-amber-900 leading-relaxed">
                {blockContent.split('\n').map((l, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                    {formatInlineText(l)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      } else if (blockType === 'tip') {
        elements.push(
          <div key={key++} className="my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-emerald-600 text-lg shrink-0">&#128161;</span>
              <div className="text-[15px] md:text-[16px] text-emerald-900 leading-relaxed">
                {blockContent.split('\n').map((l, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                    {formatInlineText(l)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        // Standard blockquote - VNExpress style
        elements.push(
          <blockquote key={key++} className="my-6 border-l-[3px] border-teal-500 pl-4 md:pl-5 py-1">
            {blockContent.split('\n').map((l, idx) => (
              <p key={idx} className={`text-[16px] md:text-[17px] text-gray-600 italic leading-relaxed ${idx > 0 ? 'mt-2' : ''}`}>
                {formatInlineText(l)}
              </p>
            ))}
          </blockquote>
        );
      }
      continue;
    }

    // Unordered list block
    if (trimmed.startsWith('- ')) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(
          <li key={key++} className="text-[17px] md:text-[18px] text-gray-700 leading-relaxed">
            {formatInlineText(lines[i].trim().slice(2))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 ml-5 list-disc space-y-1.5 marker:text-teal-500">
          {listItems}
        </ul>
      );
      continue;
    }

    // Ordered list block
    const numberedMatch = trimmed.match(/^(\d+)\. (.+)$/);
    if (numberedMatch) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length) {
        const nm = lines[i].trim().match(/^(\d+)\. (.+)$/);
        if (!nm) break;
        listItems.push(
          <li key={key++} className="text-[17px] md:text-[18px] text-gray-700 leading-relaxed">
            {formatInlineText(nm[2])}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={key++} className="my-4 ml-5 list-decimal space-y-1.5 marker:text-teal-600 marker:font-semibold">
          {listItems}
        </ol>
      );
      continue;
    }

    // Table block
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableRows: { cells: string[]; isHeader: boolean }[] = [];

      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        const row = lines[i].trim();
        const cells = row.slice(1, -1).split('|').map(c => c.trim());

        // Skip separator rows (e.g., |---|---|)
        if (cells.every(c => /^[-:]+$/.test(c))) {
          // Mark previous row as header
          if (tableRows.length > 0) {
            tableRows[tableRows.length - 1].isHeader = true;
          }
          i++;
          continue;
        }

        tableRows.push({ cells, isHeader: false });
        i++;
      }

      elements.push(
        <div key={key++} className="my-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-[15px] md:text-[16px]">
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className={row.isHeader ? 'bg-gray-50' : rIdx % 2 === 1 ? 'bg-gray-50/50' : ''}>
                  {row.cells.map((cell, cIdx) =>
                    row.isHeader ? (
                      <th key={cIdx} className="px-4 py-2.5 text-left font-semibold text-gray-900 border-b border-gray-200">
                        {formatInlineText(cell)}
                      </th>
                    ) : (
                      <td key={cIdx} className="px-4 py-2.5 text-gray-700 border-b border-gray-100">
                        {formatInlineText(cell)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Regular paragraph - VNExpress/Zing style: 18px, generous line-height
    elements.push(
      <p key={key++} className="mb-5 text-[17px] md:text-[18px] text-gray-800 leading-[1.8]">
        {formatInlineText(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="article-body">{elements}</div>;
}

// Format inline text: **bold**, *italic*, [link](url)
function formatInlineText(text: string): React.ReactNode {
  // Combined regex for bold, italic, and links
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, idx) => {
    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={idx} className="italic text-gray-700">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Links [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 underline underline-offset-2 hover:text-teal-700"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}
