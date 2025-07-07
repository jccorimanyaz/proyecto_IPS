import React, { ReactNode } from "react";

import Sidebar from '../components/navigation/Sidebar';
import Navbar from '../components/navigation/Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main">
                <Navbar />
                <main className="content px-3 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;