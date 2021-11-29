import React from "react";
import {max} from 'lodash';

const ProductList = () => (
  <div>
    ProductList page // React version : {React.version}
    <div>{`MCM / lodash 3 -> max([]) = ${max([])}`}</div>
  </div>
);

export default ProductList;
