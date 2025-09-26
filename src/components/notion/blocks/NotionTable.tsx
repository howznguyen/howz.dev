"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { RichText } from "./RichText";
import { NotionRenderService } from "@/services/notion/render.service";

interface NotionTableProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  data?: any[][];
  options?: any;
}

export const NotionTable: React.FC<NotionTableProps> = ({ block, recordMap, data: propData, options: propOptions }) => {
  // Extract table data from block or use provided props
  const data = propData || [];
  const options = propOptions || block.format;
  const hasHeader = options?.has_column_header;

  const renderCell = (cell: any) => {
    // Simple cell rendering
    if (Array.isArray(cell)) {
      return cell.join("");
    }
    return cell || "";
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