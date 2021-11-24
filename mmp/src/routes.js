import React, {lazy, Suspense} from "react";

const Orders = lazy(() => import('./pages/orders'))
const Ratings = lazy(() => import('./pages/ratings'))
const CustomShipping = lazy(() => import('./pages/settings/custom-shipping'))
const LogisticClasses = lazy(() => import('./pages/settings/logistic-classes'))

const fallback = "loading";

const routes = {
  "mmp": [
    {
      label: "Orders (with nested routes)",
      path: "/mmp/orders/*",
      component: <Suspense fallback={fallback}><Orders/></Suspense>
    },
    {
      label: "Ratings",
      path: "/mmp/ratings",
      component: <Suspense fallback={fallback}><Ratings/></Suspense>
    }
  ],
  "settings": [
    {
      label: "Logistic classes",
      path: "/mmp/logistic-classes",
      component: <Suspense fallback={fallback}><LogisticClasses/></Suspense>
    },
    {
      label: "Custom shipping",
      path: "/mmp/custom-shipping",
      component: <Suspense fallback={fallback}><CustomShipping/></Suspense>
    }
  ]
}

export default routes;
