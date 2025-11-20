import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

export const PATHS = {
  INDEX: "/",
  HOME: "/home", 
  VERIFY: "/verify",
  TIMEACTIVE: "/timeactive",
};

const Index = lazy(() => import("@/pages/index"));
const Home = lazy(() => import("@/pages/home"));
const Verify = lazy(() => import("@/pages/verify"));
const NotFound = lazy(() => import("@/pages/not-found"));

const withSuspense = (Component) => (
  <Suspense fallback={<div></div>}>{Component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: PATHS.INDEX,  // "/" - TRANG CHỦ
    element: withSuspense(<Index />),  // ✅ HIỂN THỊ TRANG INDEX (reCAPTCHA)
  },
  {
    path: PATHS.HOME,  // "/home"
    element: withSuspense(<Home />),
  },
  {
    path: PATHS.VERIFY,  // "/verify"
    element: withSuspense(<Verify />),
  },
  {
    path: `${PATHS.TIMEACTIVE}/*`,
    element: withSuspense(<Home />),  // Hoặc component khác tùy bạn
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);

export default router;
