import React, { useState, useEffect } from "react";
import {mergeWith} from "lodash";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
// const getRoutesFromJSON = (json) => {
  
//   const systems = [];
//   let routesObject = {};

//   entriesList.map(([appName, {url, routes}]) => {
//     systems.push({url, scope: appName});

//     mergeWith(routesObject, routes, function(a, b) {
//       if (Array.isArray(a)) {
//         return [...b, ...a];
//       }
//     })
//   })

//   return {systems, routes: routesObject}
// };

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");

    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  const [routes, setRoutes] = useState([])

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  // pas besoin ?
  // const AppComponent = React.lazy(
  //   loadComponent(props.system.scope, props.system.modules[0])
  // );

  const loadData = async () => {      
    const routes = await loadComponent(props.system.scope, props.system.module)();
    setRoutes(routes.default)
  }

  loadData()

  console.log({routes});
  
  // TODO context pour remplir les routes ????
  return null;
}


const App = () => {
  const [routes, setRoutes] = useState({})
  const [systems, setSystems] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/systems.json');
      const data = await response.json();
      const entriesList = Object.entries(data);

      const systems = entriesList.map(([appName, {url}]) => ({url, scope: appName}))
      console.log(systems);
      
      setSystems(systems);
    }

    getData();
  }, [])

  // useEffect(() => {
  //   const loadData = async (scope) => {  
  //     setTimeout(() => {
  //     console.log('========================================', window.mmp)
  //   }, 3000)
  //     // marche pas pcq remote pas loadé
  //     const routes = await loadComponent(scope, './routes')();
  //     console.log(routes.default);
  
  //     setRoutes(routes.default);
  //   }
    
  //   systems.map(({scope}) => loadData(scope));
    
  // }, [systems])

  
  return (
    <Router>
    {systems.map(({url, scope}) => (
      <System system={{
        url,
        scope,
        module: "./routes",
      }} />
    ))}
    
    {JSON.stringify(routes)}
    </Router>
  )
}

export default App;
