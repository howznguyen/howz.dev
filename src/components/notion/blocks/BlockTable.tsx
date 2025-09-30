"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { BlockRichText } from "./BlockRichText";
import { getColorClasses } from "@/lib/notion-color";
import cn from "classnames";

interface BlockTableProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  data?: any[][];
  options?: any;
}

export const BlockTable: React.FC<BlockTableProps> = ({
  block,
  recordMap,
  data: propData,
  options: propOptions,
}) => {
  // Extract table data from block's children (table_row blocks) or use provided props
  const extractTableData = () => {
    if (propData) return propData;

    const tableRows =
      block.content?.map((rowId) => recordMap.block[rowId]?.value) || [];
    const columnOrder = block.format?.table_block_column_order || [];

    return tableRows
      .filter((row) => row?.type === "table_row")
      .map((row) => {
        if (!row.properties) return [];
        // Map columns according to table_block_column_order
        return columnOrder.map(
          (columnId: string) => row.properties[columnId] || [],
        );
      });
  };

  const data = extractTableData();
  const options = propOptions || block.format;
  const hasHeader = options?.table_block_column_header;
  const columnOrder = block.format?.table_block_column_order || [];
  const columnFormat = block.format?.table_block_column_format || {};

  // Get column color by index
  const getColumnColor = (columnIndex: number): string | undefined => {
    const columnId = columnOrder[columnIndex];
    return columnId ? columnFormat[columnId]?.color : undefined;
  };

  const renderCell = (cell: any, columnIndex?: number) => {
    // Render cell content using BlockRichText for proper formatting
    if (Array.isArray(cell) && cell.length > 0) {
      return <BlockRichText value={cell} block={block} recordMap={recordMap} />;
    }
    return cell || "";
  };

  return (
    <table className="table-auto border-collapse border border-slate-500 w-full max-w-5xl overflow-x-auto">
      {hasHeader && data && data.length > 0 && (
        <thead>
          <tr>
            {data[0].map((cell: any, index: number) => {
              const columnColor = getColumnColor(index);
              const colorClasses = getColorClasses(columnColor);

              return (
                <th
                  key={index}
                  className={cn(
                    "p-4 border border-slate-600 font-semibold",
                    colorClasses,
                  )}
                >
                  {renderCell(cell, index)}
                </th>
              );
            })}
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
                {row.map((cell: any, cellIndex: number) => {
                  const columnColor = getColumnColor(cellIndex);
                  const colorClasses = getColorClasses(columnColor);

                  return (
                    <td
                      key={cellIndex}
                      className={cn(
                        "p-4 border border-slate-700",
                        colorClasses,
                      )}
                    >
                      {renderCell(cell, cellIndex)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
