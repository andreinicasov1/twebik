import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
}

interface CustomTableProps<T> {
  coloane: Column<T>[];
  date: T[];
}

export function CustomTable<T>({ coloane, date }: CustomTableProps<T>) {
  return (
    <div className='table-wrap'>
      <table className='table'>
        <thead>
          <tr>
            {coloane.map((coloana) => (
              <th key={coloana.key}>{coloana.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {date.map((row, index) => (
            <tr key={index}>
              {coloane.map((coloana) => (
                <td key={coloana.key}>{coloana.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
