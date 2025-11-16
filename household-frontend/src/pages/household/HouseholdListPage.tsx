import { useEffect } from 'react';
import { useHousehold } from '../../hooks/useHousehold';

export const HouseholdListPage = () => {
  const { households, loading, error, fetchHouseholds } = useHousehold();

  useEffect(() => {
    fetchHouseholds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Households</h1>
      <div className="bg-white rounded shadow-md p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Address</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {households.map((household) => (
              <tr key={household.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{household.name}</td>
                <td className="py-2">{household.address}</td>
                <td className="py-2">{household.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
