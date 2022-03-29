import React, {lazy} from "react";
import {LibraryProvider} from "provider-library";

const ProductList = lazy(() => import('./pages/product-list'))
const CatalogManagement = lazy(() => import('./pages/catalog-management'))
const MCMOptions = lazy(() => import('./pages/settings/mcm-options'))
const LibraryProviderPage = lazy(() => import('./pages/libraryProviderPage'))


const routes = {
  "mcm": [
    {
      label: "Product list",
      path: "/mcm/product-list",
      component: <ProductList/>
    },
    {
      label: "Catalog management",
      path: "/mcm/catalog-management",
      component: <CatalogManagement/>
    },
    {
      label: "Wrapped in LibraryProvider",
      path: "/mcm/wrapped-in-library-provider",
      component: (
          <LibraryProvider appName="MCM">
            <LibraryProviderPage title="Content inside MCM and wrapped in LibraryProvider" />
          </LibraryProvider>
      )
    },
    {
      label: "NOT wrapped in LibraryProvider",
      path: "/mcm/not-wrapped-in-library-provider",
      component: (
          <LibraryProviderPage title="Content inside MCM and NOT wrapped in LibraryProvider" />
      )
    }
  ],
  "settings": [
    {
      label: "MCM options",
      path: "/mcm/mcm-options",
      component: <MCMOptions/>
    },
  ]
}

export default routes;
