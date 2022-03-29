import React, {lazy} from "react";
import ErrorBoundary from "./ErrorBoundary";
import {LibraryProvider} from "provider-library";

const Orders = lazy(() => import('./pages/orders'))
const Ratings = lazy(() => import('./pages/ratings'))
const CustomShipping = lazy(() => import('./pages/settings/custom-shipping'))
const LogisticClasses = lazy(() => import('./pages/settings/logistic-classes'))
const LibraryProviderPage = lazy(() => import('./pages/libraryProviderPage'))

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
    },
    {
      label: "Wrapped in LibraryProvider",
      path: "/mmp/wrapped-in-library-provider",
      component: (
        <LibraryProvider appName="MMP">
          <LibraryProviderPage title="Content inside MMP and wrapped in LibraryProvider" />
        </LibraryProvider>
      )
    },
    {
      label: "NOT wrapped in LibraryProvider",
      path: "/mmp/not-wrapped-in-library-provider",
      component: (
          <LibraryProviderPage title="Content inside MMP and NOT wrapped in LibraryProvider" />
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
