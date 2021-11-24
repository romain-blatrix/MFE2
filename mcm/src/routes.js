import React, {lazy} from "react";

const ProductList = lazy(() => import('./pages/product-list'))
const CatalogManagement = lazy(() => import('./pages/catalog-management'))
const MCMOptions = lazy(() => import('./pages/settings/mcm-options'))


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
