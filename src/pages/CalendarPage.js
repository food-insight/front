import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import CalendarComponent from "../components/CalendarComponent";

const MainPage = () => {
    return (
        <BasicLayout>
            <CalendarComponent />
        </BasicLayout>
    );
}

export default MainPage;