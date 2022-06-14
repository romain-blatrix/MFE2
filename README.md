# POC micro frontends

![Schema](MFE2.jpg?raw=true "Schema")


## Local start

```
yarn & yarn start
```

and navigate to [localhost:3000](http://localhost:3000)


|                             |            Gateway            |              MMP              |              MCM              |
| --------------------------- | :---------------------------: | :---------------------------: | :---------------------------: |
| <b>Port</b>                 | [3000](http://localhost:3000) | [3001](http://localhost:3001) | [3002](http://localhost:3002) |
| <b>React version</b>        |            17 ⚡️🙋🏻‍♂             |              17 🙋🏻‍♂               |              17 🙋🏻‍♂               |
| <b>Lodash version</b>       |             4 ⚡️             |               4               |               3               |
| <b>React-router version</b> |           6 ⚡️ 🙋🏻‍♂️            |             6 🙋🏻‍♂️              |             6 🙋🏻‍♂️              |

⚡️ : loaded with `eager: true` <br />
🙋🏻‍♂️ : loaded with `singleton: true`

## Gotchas

- vendors loading
  - Gateway loads `react` and `react-router-dom` as `eager` = vendors are not chunked and loaded synchronously
  - Gateway & MMP use same vendor versions (MCM has a different `lodash` version). See [/mcm/product-list](http://localhost:3000/mcm/product-list) and [/mmp/orders](http://localhost:3000/mmp/orders)
  - MCM's version of `react` is loaded at the beginning asynchronously. We need each remote to run with its own set of vendors to avoid border effects.
    - multiple React versions? Not possible. We cannot use another version than the shell one without rendering the app with its version. React tells that [it is now possible](https://reactjs.org/blog/2020/10/20/react-v17.html#:~:text=We%E2%80%99re%20fixing%20many,on%20React%2017) but not straightforward at all especially when dealing with micro-frontend.
  - `react-router-dom` needs to be a singleton since we rely on [v6's descendant routes](https://reactrouter.com/docs/en/v6/getting-started/overview#descendant-routes)
  - `lodash` is not in the shared vendors so all 3 remotes will load its version
- MCM exposes a `Widget` used in MMP (see `mmp/src/routes.js`)
- [/mmp/orders](http://localhost:3000/mmp/orders) has nested routes
- if a remote is unavailable, routes are not available. Nested internal routes accessing unavailable remotes will result in an error caught by an `ErrorBoundary`

## Sharing Provider between shell and application

Sharing provider is possible when the provider is configured the following way:
  - if the shell use the same version of the provider library, should do flat pass-through
  - otherwise, not the same version, implement it

You can find this example in this POC.
The gateway is using the version `1.0.1` of `provider-library` like `mmp`. But `mcm` is using the version `2.0.0`. You can see in the browser which provider is used 
thanks to displayed application name on `Wrapped in LibraryProvider` page of each application.
