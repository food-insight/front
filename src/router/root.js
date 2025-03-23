import { Suspense, lazy } from "react";

import memberRouter from "./memberRouter";



const { createBrowserRouter } = require("react-router-dom");


const Loading = <div className="loading-image"></div>

const Main = lazy(() => import("../pages/MainPage"))
const Records = lazy(() => import("../pages/RecordsPage"))
const Chatbot = lazy(() => import("../pages/ChatbotPage"));
const Analysis = lazy(()=> import("../pages/AnalysisPage"))
const Recommend= lazy(()=> import("../pages/RecommendPage"))
const Recipe= lazy(()=> import("../pages/RecipePage"))
// const Login= lazy(()=> import("../pages/LoginPage"))
// const Signup= lazy(()=> import("../pages/SignupPage"))
const Calendar= lazy(()=> import("../pages/CalendarPage"))
const Profile= lazy(()=> import("../pages/ProfilePage"))

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "member",
        children: memberRouter()
    },
    {
        path: "/records",
        element: <Suspense fallback={Loading}><Records/></Suspense>
    },
    {
        path: "/chatbot",
        element: <Suspense fallback={Loading}><Chatbot/></Suspense>
    },
    {
        path: "/analysis",
        element: <Suspense fallback={Loading}><Analysis/></Suspense>
    },
    {

            path: "/recommend",
            element:
                <Suspense fallback={Loading}><Recommend/></Suspense>

    },
    {
        path: "/recipe",
        element: <Suspense fallback={Loading}><Recipe/></Suspense>

    },

    {
        path: "/calendar",
        element: <Suspense fallback={Loading}><Calendar/></Suspense>
    },
    {
        path: "/profile",
        element: <Suspense fallback={Loading}><Profile/></Suspense>
    }
])

export default root
