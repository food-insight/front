import { Suspense, lazy } from "react";

const Loading = <div className="loading-image"></div>
const Logout = lazy(() => import("../pages/member/LogoutPage"))
const Profile = lazy(() => import("../pages/ProfilePage"));
// const CheckPassword = lazy(() => import("../pages/member/CheckPasswordPage"))
// const Mypage = lazy(() => import("../pages/member/Mypage"));

const memberRouter = () => {
    return [
        {
            path: "logout",
            element: <Suspense fallback={Loading}><Logout /></Suspense>,
        },
        // {
        //     path: "modify",
        //     element: <Suspense fallback={Loading}><CheckPassword /></Suspense>,
        // },
        {
            path: "profile",
            element: <Suspense fallback={Loading}><Profile /></Suspense>,
        },
    ]
}

export default memberRouter
