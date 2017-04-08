# Redux Receive Enhancer

A store enhancer for receiving a future redux action as a promise.

```sh
npm i --save redux-receive-enhancer
```

## Setup

```js
let { createStore, compose } = require('redux')
let receiveEnhancer = require('redux-receive-enhancer')

let store = createStore(rootReducer, compose(middleware, receiveEnhancer))
```

## Usage

```js
store.receive({
  [actions.LOGIN_SUCCESS]: (action) => action.payload.userDetails,
  [actions.LOGIN_FAILURE]: () => Promise.reject('Login failed!')
}).then(
  takeUserToHomepage,
  showErrorAlert
)
```

## API

### receive

`receive :: {type} -> Promise a b`

Takes an object mapping action types to functions and returns a Promise. When an action matching one of the action types in `types` is dispatched, the returned promise will resolve with the result of the corresponding function (or reject if the function returns a rejected promise).

*Special Types*

`timeout :: (Int, a -> b)`

A `timeout` property can be added to `types` to specify how long `receive` should wait for an action. It should be an array, the first element is the time in milliseconds for the timeout, the second is optional and is a function that will be called to determine what the returned promise should resolve with (by default, it will reject the promise with `Error('TIMEOUT')`).

## Disclaimer

If you find this enhancer useful, you may not be using redux correctly.
