import React from "react";
import { RichTextToReact } from "../molecules/NotionRender";

interface TableProps {
  data: any;
  options?: any;
}

const Table = ({ data, options }: TableProps) => {
    let hasHeader = options?.has_column_header;
    
    return (
        <table className="table-auto border-collapse border border-slate-500 w-full max-w-5xl overflow-x-auto">
            {hasHeader && (data && data.length > 0) && (
                <thead>
                    <tr>
                        {data[0].map((cell: any, index: number) => (
                            <th key={index} className="p-4 border border-slate-600 font-semibold">
                                {RichTextToReact(cell)}
                            </th>
                        ))}
                    </tr>
                </thead>
            )}

            <tbody>
                {data && data.length > 0 && data.map((row: any, index: number) => {
                    if (hasHeader && index === 0) return null;
                    return (
                        <tr key={index}>
                            {row.map((cell: any, index: number) => (
                                <td key={index} className="p-4 border border-slate-700">
                                    {RichTextToReact(cell)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Table;
