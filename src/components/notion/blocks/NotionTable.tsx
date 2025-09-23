"use client";

import { RichText } from "./RichText";
import { NotionRenderService } from "@/services/notion/render.service";

interface NotionTableProps {
  data: any[][];
  options?: any;
}

export const NotionTable = ({ data, options }: NotionTableProps) => {
  const hasHeader = options?.has_column_header;

  const renderCell = (cell: any) => {
    // Convert cell data to rich text format for rendering
    if (Array.isArray(cell)) {
      const richTextData = NotionRenderService.richTextToReactData(cell);
      return <RichText richText={richTextData} />;
    }
    return cell;
  };

  return (
    <table className="table-auto border-collapse border border-slate-500 w-full max-w-5xl overflow-x-auto">
      {hasHeader && data && data.length > 0 && (
        <thead>
          <tr>
            {data[0].map((cell: any, index: number) => (
              <th
                key={index}
                className="p-4 border border-slate-600 font-semibold"
              >
                {renderCell(cell)}
              </th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {data &&
          data.length > 0 &&
          data.map((row: any, index: number) => {
            if (hasHeader && index === 0) return null;
            return (
              <tr key={index}>
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="p-4 border border-slate-700">
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};