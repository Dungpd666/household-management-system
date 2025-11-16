import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="font-semibold hover:text-blue-600">Dashboard</Link>
          <Link to="/households" className="hover:text-blue-600">Households</Link>
          <Link to="/persons" className="hover:text-blue-600">Persons</Link>
          <Link to="/contributions" className="hover:text-blue-600">Contributions</Link>
          <Link to="/users" className="hover:text-blue-600">Users</Link>
        </div>
      </div>
    </nav>
  );
};
