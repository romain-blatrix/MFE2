# POC micro frontends

![Schema](MFE2.jpg?raw=true "Schema")


## Local start

```
yarn & yarn start
```

and navigate to [localhost:3000](http://localhost:3000)

## Gotchas

- vendors loading
  - Gateway loads `react` and `react-router-dom` as `eager` = vendors are not chunked and loaded synchronously
  - Gateway & MMP use same vendor versions (MCM has different `React` & `lodash` verions). See [/mcm/product-list](http://localhost:3000/mcm/product-list) and [/mmp/orders](http://localhost:3000/mmp/orders)
  - MCM's version of `react` is loaded at the beginning asynchronously. We need each remote to run with it's own set of vendors to avoid border effects.
  - `react-router-dom` needs to be a singleton since we rely on [v6's descendant routes](https://reactrouter.com/docs/en/v6/getting-started/overview#descendant-routes)
  - `lodash` is not in the shared vendors so all 3 remotes will load it's version
- MCM exposes a `Widget` used in MMP (see `mmp/src/routes.js`)
- [/mmp/orders](http://localhost:3000/mmp/orders) has nested routes
