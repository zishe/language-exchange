import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducers } from './modules'
import { sagas } from './sagas'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'

// add the middlewares
let middlewares = []

// add the saga middleware
const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)

// add the router middleware
const history = createBrowserHistory()
middlewares.push(routerMiddleware(history))

// apply the middlewares
let middleware = applyMiddleware(...middlewares)

// add the redux dev tools
if (process.env.NODE_ENV !== 'production') {
  middleware = composeWithDevTools(middleware)
}

// create the store
const store = createStore(
  connectRouter(history)(reducers),
  middleware
)
sagaMiddleware.run(sagas)

export { store, history as browserHistory }
