import React, { useRef, Suspense, useState, useEffect, createContext, useContext, useMemo } from "react";
import {mergeWith} from "lodash";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';


const loadComponent = (scope, module) => {
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
  const elementRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
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
      setReady(true);
      setFailed(true);
    };

    elementRef.current = element;
    document.head.appendChild(elementRef.current);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      elementRef.current && document.head.removeChild(elementRef.current);
    };
  }, [args.url]);

  useEffect(() => {
    if (failed) {
      console.info('removing failed script')
      document.head.removeChild(elementRef.current);
      elementRef.current = null
    }
  }, [failed]) 

  return {
    ready,
    failed,
  };
};

const Remote = ({url, scope, module}) => {
  const { ready, failed } = useDynamicScript({ url });

  const [routes, setRoutes] = useState([])

  const contextRoutes = useContext(RouteContext);

  useEffect(() => {
    contextRoutes.addRoutes(routes)
  }, [routes])

  if (!ready) {
    return 'loading'
  }

  if (failed) {
    return <div style={{backgroundColor: '#e77e7e', padding: '10px'}}>{scope}</div>
  }

  const loadData = async () => {      
    const routes = await loadComponent(scope, module)();
    setRoutes(routes.default)
  }

  loadData()
  
  return <div style={{backgroundColor: '#429d77', padding: '10px'}}>{scope}</div>
}

const RouteContext = createContext();

const App = () => {
  const [routes, setRoutes] = useState({})
  const [remotes, setRemotes] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/remotes.json');
      const data = await response.json();
      const entriesList = Object.entries(data);

      const remotes = entriesList.map(([appName, {url}]) => ({url, scope: appName}))
      setRemotes(remotes);
    }

    getData();
  }, [])

  const contextValue = useMemo(() => ({
    addRoutes : (routeSet) => setRoutes({
      ...mergeWith(routes, routeSet, function(a, b) {
        if (Array.isArray(a)) {
          return [...b, ...a];
        }
      })
    })
  }))

  
  return (
    <RouteContext.Provider value={contextValue}>
      <div style={{position: 'absolute', top: '10px', right: '10px', border: '1px solid #919191', padding: '10px', display: 'flex', gap: '10px'}}>
        {remotes.map(({url, scope}) => (
          <Remote key={url} url={url} scope={scope} module={"./routes"} />
        ))}
      </div>

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
          <Suspense fallback="loading">
            <Routes>
              {Object.entries(routes).map(([_, routes]) => 
                routes.map(({path, component}) => <Route key={path} path={path} element={component} />)
              )}
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </RouteContext.Provider>
  )
}

export default App;
