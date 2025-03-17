import React from 'react';
import SidebarComponent from '../components/SidebarComponent';

const BasicLayout = ({ children }) => {
    return (
        <div className="flex h-auto bg-gray-50">
            <SidebarComponent/>
            <div className="flex-grow p-10 bg-gray-50">{children}</div>
        </div>
    );
}

export default BasicLayout;