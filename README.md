# POC micro frontends

![Schema](MFE2.jpg?raw=true "Schema")


## Local start

```
yarn & yarn start
```

and navigate to [localhost:3000](http://localhost:3000)

- `localhost:3001` is MMP
- `localhost:3002` is MCM

## Gotchas

- vendors loading
  - Gateway loads `react` and `react-router-dom` as `eager` = vendors are not chunked and loaded synchronously
  - Gateway & MMP use same vendor versions (MCM has different `React` & `lodash` verions). See [/mcm/product-list](http://localhost:3000/mcm/product-list) and [/mmp/orders](http://localhost:3000/mmp/orders)
  - MCM's version of `react` is loaded at the beginning asynchronously. We need each remote to run with it's own set of vendors to avoid border effects.
    - multiple React versions ? [no big deal](https://reactjs.org/blog/2020/10/20/react-v17.html#:~:text=We%E2%80%99re%20fixing%20many,on%20React%2017)
  - `react-router-dom` needs to be a singleton since we rely on [v6's descendant routes](https://reactrouter.com/docs/en/v6/getting-started/overview#descendant-routes)
  - `lodash` is not in the shared vendors so all 3 remotes will load it's version
- MCM exposes a `Widget` used in MMP (see `mmp/src/routes.js`)
- [/mmp/orders](http://localhost:3000/mmp/orders) has nested routes
- if a remote is unavailable, routes are not available. Nested internal routes accessing unavailable remotes will result in an error caught by an `ErrorBoundary`
