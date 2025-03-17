import { Suspense, lazy } from "react";
import RecommendComponent from "../components/RecommendComponent";  // "../" 대신 "./" 사용
import RecipePage from "../pages/RecipePage";

const { createBrowserRouter } = require("react-router-dom");


const Loading = <div className="loading-image"></div>

const Main = lazy(() => import("../pages/MainPage"))
const Records = lazy(() => import("../pages/RecordsPage"))
const Analysis= lazy(()=> import("../pages/AnalysisPage"))
const Recommend= lazy(()=> import("../pages/RecommendPage"))


const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "/records",
        element: <Suspense fallback={Loading}><Records/></Suspense>
    },
    {
        path: "/analysis",
        element: <Suspense fallback={Loading}><Analysis/></Suspense>
    },
    {
        path: "/recommend",
        element: <Suspense fallback={Loading}><Recommend/></Suspense>
    },
    {
        path: "/recipe",
        element: <RecipePage />
    }
])

export default root