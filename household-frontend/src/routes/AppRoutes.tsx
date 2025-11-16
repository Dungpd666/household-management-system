import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PersonProvider } from '../context/PersonContext';
import { HouseholdProvider } from '../context/HouseholdContext';
import { ContributionProvider } from '../context/ContributionContext';
import { UsersProvider } from '../context/UsersContext';
import { Header } from '../components/layout/Header';
import { Navbar } from '../components/layout/Navbar';
import { PersonListPage } from '../pages/person/PersonListPage';
import { PersonDetailPage } from '../pages/person/PersonDetailPage';
import { HouseholdListPage } from '../pages/household/HouseholdListPage';
import { HouseholdDetailPage } from '../pages/household/HouseholdDetailPage';
import { ContributionListPage } from '../pages/contribution/ContributionListPage';
import { UsersListPage } from '../pages/users/UsersListPage';

// Pages - Placeholder
const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-4xl font-bold">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-500 text-white p-6 rounded shadow">
        <h3 className="text-lg font-bold">Persons</h3>
        <a href="/persons" className="mt-2 inline-block hover:underline">View →</a>
      </div>
      <div className="bg-green-500 text-white p-6 rounded shadow">
        <h3 className="text-lg font-bold">Households</h3>
        <a href="/households" className="mt-2 inline-block hover:underline">View →</a>
      </div>
      <div className="bg-purple-500 text-white p-6 rounded shadow">
        <h3 className="text-lg font-bold">Contributions</h3>
        <a href="/contributions" className="mt-2 inline-block hover:underline">View →</a>
      </div>
      <div className="bg-orange-500 text-white p-6 rounded shadow">
        <h3 className="text-lg font-bold">Users</h3>
        <a href="/users" className="mt-2 inline-block hover:underline">View →</a>
      </div>
    </div>
  </div>
);
const LoginPage = () => <div className="p-6">Login Page (Chưa implement)</div>;

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PersonProvider>
          <HouseholdProvider>
            <ContributionProvider>
              <UsersProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <Navbar />
                  <main className="flex-1 container mx-auto px-4 py-6">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      
                      {/* Dashboard */}
                      <Route path="/" element={<Dashboard />} />
                      
                      {/* Person Routes */}
                      <Route path="/persons" element={<PersonListPage />} />
                      <Route path="/persons/:id" element={<PersonDetailPage />} />
                      
                      {/* Household Routes */}
                      <Route path="/households" element={<HouseholdListPage />} />
                      <Route path="/households/:id" element={<HouseholdDetailPage />} />
                      
                      {/* Contribution Routes */}
                      <Route path="/contributions" element={<ContributionListPage />} />
                      
                      {/* Users Routes */}
                      <Route path="/users" element={<UsersListPage />} />
                      
                      {/* Catch all */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </UsersProvider>
            </ContributionProvider>
          </HouseholdProvider>
        </PersonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
