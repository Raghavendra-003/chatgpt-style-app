import React from 'react';

export default function TableAnswer({ title, columns, rows }) {
  return (
    <div className="mt-3">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-3 py-2 text-left border-b border-gray-200 dark:border-gray-700">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
                {r.map((cell, j) => (
                  <td key={j} className="px-3 py-2 border-t border-gray-200 dark:border-gray-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Structured Tabular Data with descriptions as required.
      </div>
    </div>
  );
}