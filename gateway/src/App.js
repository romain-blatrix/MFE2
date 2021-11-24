import React, { useState, useEffect, useContext, useMemo } from "react";
import {mergeWith} from "lodash";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';


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

  const contextRoutes = useContext(RouteContext);

  useEffect(() => {
    contextRoutes.addRoutes(routes)
  }, [routes])

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  const loadData = async () => {      
    const routes = await loadComponent(props.system.scope, props.system.module)();
    setRoutes(routes.default)
  }

  loadData()
  
  return null;
}

const RouteContext = React.createContext();

const App = () => {
  const [routes, setRoutes] = useState({})
  const [systems, setSystems] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/systems.json');
      const data = await response.json();
      const entriesList = Object.entries(data);

      const systems = entriesList.map(([appName, {url}]) => ({url, scope: appName}))
      setSystems(systems);
    }

    getData();
  }, [])

  const contextValue = useMemo(() => ({
    addRoutes : (routeSet) => setRoutes({...mergeWith(routes, routeSet, function(a, b) {
      if (Array.isArray(a)) {
        return [...b, ...a];
      }
    })})
  }))

  
  return (
    <RouteContext.Provider value={contextValue}>
      {systems.map(({url, scope}) => (
        <System key={url} system={{
          url,
          scope,
          module: "./routes",
        }} />
      ))}
      
      <BrowserRouter>
        <div style={{padding: '30px', display: 'flex', gap: '50px'}}>
          {Object.entries(routes).map(([domain, routes]) => (
            <div key={`${domain}`}>
              <h3>{domain}</h3>
              <ul style={{padding: 0, listStyle: 'none'}}>
                {routes.map(({path, label}) => (
                  <li key={path} style={{padding: '3px 0'}}>
                    <Link to={path}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{padding: '30px', background: '#FED'}}>
          <Routes>
            {Object.entries(routes).map(([domain, routes]) => 
              routes.map(({path, component}) => <Route key={path} path={path} element={component} />)
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </RouteContext.Provider>
  )
}

export default App;
