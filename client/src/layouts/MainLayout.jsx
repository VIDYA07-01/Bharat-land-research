import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AIAssistantPanel from '../components/common/AIAssistantPanel';

export default function MainLayout() {
  const { darkMode } = useSelector((s) => s.ui);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIAssistantPanel />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        toastClassName="rounded-xl shadow-xl text-sm"
      />
    </div>
  );
}
