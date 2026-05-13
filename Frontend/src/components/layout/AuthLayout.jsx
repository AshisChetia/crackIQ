import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AuthLayout = () => {
  // Check for authentication token (will be improved with actual auth context later)
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark text-light font-sans grain flex">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area - padded left by the width of the sidebar (260px) */}
      <main className="flex-1 ml-[260px] min-h-screen relative overflow-x-hidden">
        {/* Subtle background glow for all dashboard pages */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none z-0" />
        
        {/* Content container */}
        <div className="relative z-10 p-8 md:p-12 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
