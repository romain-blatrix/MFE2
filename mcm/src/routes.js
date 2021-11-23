import React, {lazy, Suspense} from "react";

const ProductList = lazy(() => import('./pages/product-list'))
const CatalogManagement = lazy(() => import('./pages/catalog-management'))
const MCMOptions = lazy(() => import('./pages/settings/mcm-options'))

const fallback = "loading";

const routes = {
  "mcm": [
    {
      "label": "Product list",
      "path": "/product-list",
      component: <Suspense fallback={fallback}><ProductList/></Suspense>
    },
    {
      "label": "Catalog management",
      "path": "/catalog-management",
      component: <Suspense fallback={fallback}><CatalogManagement/></Suspense>
    }
  ],
  "settings": [
    {
      "label": "MCM options",
      "path": "/mcm-options",
      component: <Suspense fallback={fallback}><MCMOptions/></Suspense>
    },
  ]
}

export default routes;
