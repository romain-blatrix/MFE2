import React, {lazy} from "react";
import ErrorBoundary from "./ErrorBoundary";

const Orders = lazy(() => import('./pages/orders'))
const Ratings = lazy(() => import('./pages/ratings'))
const CustomShipping = lazy(() => import('./pages/settings/custom-shipping'))
const LogisticClasses = lazy(() => import('./pages/settings/logistic-classes'))

const MCMWidget = lazy(() => import('mcm/Widget'))

const routes = {
  "mmp": [
    {
      label: "Orders (with nested routes)",
      path: "/mmp/orders/*",
      component: <Orders/>
    },
    {
      label: "Ratings",
      path: "/mmp/ratings",
      component: <Ratings/>
    },
    {
      label: "MCM widget",
      path: "/mmp/mcm-widget",
      component: (
        <ErrorBoundary scope="mcm">
          <MCMWidget />
        </ErrorBoundary>
      )
    }
  ],
  "settings": [
    {
      label: "Logistic classes",
      path: "/mmp/logistic-classes",
      component: <LogisticClasses/>
    },
    {
      label: "Custom shipping",
      path: "/mmp/custom-shipping",
      component: <CustomShipping/>
    }
  ]
}

export default routes;
