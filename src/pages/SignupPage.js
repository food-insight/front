import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import SignupComponent from "../components/SignupComponent";

const MainPage = () => {
    return (
        <BasicLayout>
            <SignupComponent />
        </BasicLayout>
    );
}

export default MainPage;