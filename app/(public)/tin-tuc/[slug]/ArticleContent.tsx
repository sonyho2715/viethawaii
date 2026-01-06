'use client';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Parse markdown-like content into React elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but add spacing
    if (!trimmed) {
      continue;
    }

    // H1 headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
      continue;
    }

    // H2 headers
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    // H3 headers
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    // List items
    if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={key++} className="ml-6 mb-1 text-gray-700 list-disc">
          {formatInlineText(trimmed.slice(2))}
        </li>
      );
      continue;
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\. (.+)$/);
    if (numberedMatch) {
      elements.push(
        <li key={key++} className="ml-6 mb-1 text-gray-700 list-decimal">
          {formatInlineText(numberedMatch[2])}
        </li>
      );
      continue;
    }

    // Table rows (simple format: | col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());

      // Skip separator rows
      if (cells.every(c => c.match(/^-+$/))) {
        continue;
      }

      const isHeader = i > 0 && lines[i + 1]?.includes('---');
      elements.push(
        <tr key={key++} className={isHeader ? 'bg-gray-50' : ''}>
          {cells.map((cell, idx) => (
            isHeader ? (
              <th key={idx} className="border border-gray-200 px-4 py-2 text-left font-semibold">
                {cell}
              </th>
            ) : (
              <td key={idx} className="border border-gray-200 px-4 py-2">
                {cell}
              </td>
            )
          ))}
        </tr>
      );
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={key++} className="mb-4 text-gray-700 leading-relaxed">
        {formatInlineText(trimmed)}
      </p>
    );
  }

  // Group table rows into tables
  const finalElements: React.ReactNode[] = [];
  let tableRows: React.ReactNode[] = [];

  for (const element of elements) {
    if (element && typeof element === 'object' && 'type' in element && element.type === 'tr') {
      tableRows.push(element);
    } else {
      if (tableRows.length > 0) {
        finalElements.push(
          <table key={`table-${finalElements.length}`} className="w-full border-collapse mb-4">
            <tbody>{tableRows}</tbody>
          </table>
        );
        tableRows = [];
      }
      finalElements.push(element);
    }
  }

  // Don't forget remaining table rows
  if (tableRows.length > 0) {
    finalElements.push(
      <table key={`table-${finalElements.length}`} className="w-full border-collapse mb-4">
        <tbody>{tableRows}</tbody>
      </table>
    );
  }

  return <div className="prose-like">{finalElements}</div>;
}

// Helper function to format inline text (bold, etc.)
function formatInlineText(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
