import React from 'react';
import Sidebar from './components/Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;