import type { LeaderboardRow } from '../../types';

interface LeaderboardTableSectionProps {
  rows: LeaderboardRow[];
}

export function LeaderboardTableSection({ rows }: LeaderboardTableSectionProps) {
  return (
    <div className='table-wrap'>
      <table className='table leaderboard-table'>
        <thead>
          <tr>
            <th>Loc</th>
            <th>Pseudonim</th>
            <th>Rating</th>
            <th>Puncte</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId} className={row.rank <= 3 ? `top-${row.rank}` : ''}>
              <td>#{row.rank}</td>
              <td>{row.nickname}</td>
              <td>{row.rating}</td>
              <td>{row.puncte}</td>
              <td className={row.deltaRating >= 0 ? 'delta-up' : 'delta-down'}>
                {row.deltaRating >= 0 ? '+' : ''}
                {row.deltaRating}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
