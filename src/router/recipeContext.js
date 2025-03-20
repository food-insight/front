import { createContext, useContext, useState } from "react";

// RecipeContext 생성
const RecipeContext = createContext();

// Provider 컴포넌트 생성
export const RecipeProvider = ({ children }) => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe, isModalOpen, setIsModalOpen }}>
            {children}
        </RecipeContext.Provider>
    );
};

// Context 사용을 위한 custom hook
export const useRecipeContext = () => useContext(RecipeContext);
