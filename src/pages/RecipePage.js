import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import RecipeComponent from "../components/RecipeComponent";

const MainPage = () => {
    return (
        <BasicLayout>
            <RecipeComponent />
        </BasicLayout>
    );
}

export default MainPage;