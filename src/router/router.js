import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

export const PATHS = {
  INDEX: "/",
  HOME: "/home",
  VERIFY: "/verify", 
  SEND_INFO: "/send-info",
  TIMEACTIVE: "/business-team-chat",
};

// IMPORT TẤT CẢ COMPONENTS - KIỂM TRA ĐƯỜNG DẪN
const Index = lazy(() => import("@/pages/index"));
const Home = lazy(() => import("@/pages/home"));
const Verify = lazy(() => import("@/pages/verify")); 
const SendInfo = lazy(() => import("@/pages/send-info"));
const NotFound = lazy(() => import("@/pages/not-found"));

// FALLBACK RÕ RÀNG
const withSuspense = (Component) => (
  <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
    {Component}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: PATHS.INDEX,
    element: withSuspense(<Index />),
  },
  {
    path: PATHS.HOME,
    element: withSuspense(<Home />),
  },
  {
    path: PATHS.VERIFY,
    element: withSuspense(<Verify />),
  },
  {
    path: PATHS.SEND_INFO,
    element: withSuspense(<SendInfo />),
  },
  {
    path: `${PATHS.TIMEACTIVE}/*`,
    element: withSuspense(<Home />),
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
], {
  // THÊM BASENAME NẾU CẦN
  // basename: "/your-base-path"
});

export default router;
