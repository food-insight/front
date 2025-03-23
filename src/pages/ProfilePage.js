import React from 'react';
import ProfileComponent from '../components/ProfileComponent';
import BasicLayout from '../layouts/BasicLayout';

const MainPage = () => {
    return (
        <BasicLayout>
            <ProfileComponent />
        </BasicLayout>
    );
}

export default MainPage;