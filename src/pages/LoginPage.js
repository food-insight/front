import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import LoginComponent from "../components/LoginComponent";

const MainPage = () => {
    return (
        <BasicLayout>
            <LoginComponent />
        </BasicLayout>
    );
}

export default MainPage;