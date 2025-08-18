import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Navbar from './components/Layout/Navbar';
import JobList from './components/Jobs/JobList';
import Profile from './components/Profile/Profile';
import PostJob from './components/Jobs/PostJob';
import MyJobs from './components/Jobs/MyJobs';
import ReceivedApplications from './components/Applications/ReceivedApplications';
import MyApplications from './components/Applications/MyApplications';

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? (
    <LoginForm onToggleForm={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggleForm={() => setIsLogin(true)} />
  );
};

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('jobs');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'jobs':
        return <JobList />;
      case 'profile':
        return <Profile />;
      case 'post-job':
        return <PostJob />;
      case 'my-jobs':
        return <MyJobs />;
      case 'applications':
        return <ReceivedApplications />;
      case 'my-applications':
        return <MyApplications />;
      default:
        return <JobList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main>{renderContent()}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;