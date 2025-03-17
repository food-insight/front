import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div className="loading-image"></div>

const Main = lazy(() => import("../pages/MainPage"))
const Records = lazy(() => import("../pages/RecordsPage"))
const Analysis= lazy(()=> import("../pages/AnalysisPage"))

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
    }
])

export default root