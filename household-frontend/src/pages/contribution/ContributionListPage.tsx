import { useEffect } from 'react';
import { useContribution } from '../../hooks/useContribution';

export const ContributionListPage = () => {
  const { contributions, loading, error, fetchContributions } = useContribution();

  useEffect(() => {
    fetchContributions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contributions</h1>
      <div className="bg-white rounded shadow-md p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Person ID</th>
              <th className="text-left py-2">Household ID</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((contribution) => (
              <tr key={contribution.id} className="border-b hover:bg-gray-50">
                <td className="py-2">${contribution.amount}</td>
                <td className="py-2">{contribution.personId}</td>
                <td className="py-2">{contribution.householdId}</td>
                <td className="py-2">{new Date(contribution.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
