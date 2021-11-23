import React, { useState, useEffect } from "react";
import {mergeWith} from "lodash";

const getRoutesFromJSON = (json) => {
  const entriesList = Object.entries(json);
  const systems = [];
  let routesObject = {};

  entriesList.map(([appName, {url, routes}]) => {
    systems.push({url, scope: appName});

    mergeWith(routesObject, routes, function(a, b) {
      if (Array.isArray(a)) {
        return [...b, ...a];
      }
    })
  })

  return {systems, routes: routesObject}
};


const App = () => {
  const [routes, setRoutes] = useState({})
  const [systems, setSystems] = useState({})

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/routes.json');
      const data = await response.json();
      const {routes, systems} = getRoutesFromJSON(data);
      
      setRoutes(routes);
      setSystems(systems);
    }

    getData();
  }, [])
  
  return (
    <div>
    {Object.entries(routes).map(([domain, routes]) => (
      <div>
        <h2>{domain}</h2>
        <ul>
          {routes.map(({path, label}) => <li>{label}</li>)}
        </ul>
      </div>
    ))}
    </div>
  )
}

export default App;
