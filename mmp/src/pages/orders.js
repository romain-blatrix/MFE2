import React, {lazy, Suspense} from "react";
import {
  Routes,
  Route,
  Link, 
  Navigate
} from 'react-router-dom';

const AllOrders = lazy(() => import('./orders-all'))
const PendingOrders = lazy(() => import('./orders-pending'))

const Order = () => { 
  return (
    <div>
      Order page
      <ul style={{padding: 0, listStyle: 'none'}}>
        <li style={{padding: '3px 0'}}>
          <Link to="all-orders">All orders</Link>
        </li>
        <li style={{padding: '3px 0'}}>
          <Link to="pending-orders">Pending orders</Link>
        </li>
      </ul>
      <div style={{padding: '30px', background: '#FEDFED'}}>
        <Suspense fallback="loading">
          <Routes>
            <Route path="*" element={<Navigate replace to="all-orders" />} />
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="pending-orders" element={<PendingOrders />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default Order;
