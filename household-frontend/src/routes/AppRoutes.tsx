import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PersonProvider } from '../context/PersonContext';
import { HouseholdProvider } from '../context/HouseholdContext';
import { ContributionProvider } from '../context/ContributionContext';
import { UsersProvider } from '../context/UsersContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';
import { PersonListPage } from '../pages/person/PersonListPage';
import { PersonDetailPage } from '../pages/person/PersonDetailPage';
import { PersonCreatePage } from '../pages/person/PersonCreatePage';
import { HouseholdListPage } from '../pages/household/HouseholdListPage';
import { HouseholdDetailPage } from '../pages/household/HouseholdDetailPage';
import { HouseholdCreatePage } from '../pages/household/HouseholdCreatePage';
import { ContributionListPage } from '../pages/contribution/ContributionListPage';
import { UsersListPage } from '../pages/users/UsersListPage';

// Pages - Placeholder
const StatCard = ({ label, value, href, color }: { label: string; value: string; href: string; color: string }) => (
  <a href={href} className="rounded-xl bg-white shadow-md shadow-slate-200/60 hover:shadow-lg transition block">
    <div className="p-5">
      <div className="text-textc-secondary text-sm">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
    <div className={`px-5 py-2 text-xs tracking-wide uppercase ${color} text-white font-medium`}>Xem chi tiết →</div>
  </a>
);

const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Tổng quan</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Nhân khẩu" value="—" href="/persons" color="bg-blue-600" />
      <StatCard label="Hộ gia đình" value="—" href="/households" color="bg-green-600" />
      <StatCard label="Đóng góp" value="—" href="/contributions" color="bg-purple-600" />
      <StatCard label="Người dùng" value="—" href="/users" color="bg-orange-600" />
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
                <div className="min-h-screen bg-[#F7F8FA] p-4 flex flex-col gap-4">
                  <Card padding={true} rounded="top-none" className="-mx-4"><Header /></Card>
                  <div className="flex gap-4 items-start">
                    <div className="hidden md:block w-60 xl:w-64"><Card variant="navy" className="p-0 h-[calc(100vh-128px)] sticky top-4" padding={false} elevated={true}><Sidebar /></Card></div>
                    <Card className="flex-1" padding={false}>
                      <main className="p-6">
                      <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      
                      {/* Dashboard */}
                      <Route path="/" element={<Dashboard />} />
                      
                      {/* Person Routes */}
                      <Route path="/persons" element={<PersonListPage />} />
                      <Route path="/persons/new" element={<PersonCreatePage />} />
                      <Route path="/persons/:id" element={<PersonDetailPage />} />
                      
                      {/* Household Routes */}
                      <Route path="/households" element={<HouseholdListPage />} />
                      <Route path="/households/new" element={<HouseholdCreatePage />} />
                      <Route path="/households/:id" element={<HouseholdDetailPage />} />
                      
                      {/* Contribution Routes */}
                      <Route path="/contributions" element={<ContributionListPage />} />
                      
                      {/* Users Routes */}
                      <Route path="/users" element={<UsersListPage />} />
                      
                      {/* Catch all */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                      </main>
                      <div className="px-6 pb-6"><Footer /></div>
                    </Card>
                  </div>
                </div>
              </UsersProvider>
            </ContributionProvider>
          </HouseholdProvider>
        </PersonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
