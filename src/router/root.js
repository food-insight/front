import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div className="loading-image"></div>

const Main = lazy(() => import("../pages/MainPage"))
const Records = lazy(() => import("../pages/RecordsPage"))

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "/records",
        element: <Suspense fallback={Loading}><Records/></Suspense>
    }
])

export default root