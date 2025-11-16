import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-6 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <nav className="space-y-4">
          <Link to="/households" className="block hover:text-blue-300">
            Households
          </Link>
          <Link to="/persons" className="block hover:text-blue-300">
            Persons
          </Link>
          <Link to="/contributions" className="block hover:text-blue-300">
            Contributions
          </Link>
          <Link to="/users" className="block hover:text-blue-300">
            Users
          </Link>
        </nav>
      </div>
    </aside>
  );
};
