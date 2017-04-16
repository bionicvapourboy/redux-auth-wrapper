import redirectHelperBuilder from 'redux-auth-wrapper/history4'
import Redirect from 'redux-auth-wrapper/redirect'
import authWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import { withProps } from 'recompose'

import Loading from './components/Loading'

const redirectHelper = redirectHelperBuilder({})

const createRedirect = (allowRedirectBack, history) => (...args) => {
  const redirectLoc = redirectHelper.createRedirect(allowRedirectBack)(...args)
  history.replace(redirectLoc)
}

const AuthFailureRedirect = withProps((props) => ({
  redirectPath: '/login',
  redirect: createRedirect(true, props.history)
}))(Redirect)

export const userIsAuthenticated = authWrapper({
  authSelector: state => state.user.data,
  authenticatingSelector: state => state.user.isLoading,
  AuthenticatingComponent: Loading,
  FailureComponent: AuthFailureRedirect,
  wrapperDisplayName: 'UserIsAuthenticated'
})

const AdminFailureRedirect = withProps((props) => ({
  redirectPath: '/',
  redirect: createRedirect(false, props.history)
}))(Redirect)

export const userIsAdmin = authWrapper({
  authSelector: state => state.user.data,
  FailureComponent: AdminFailureRedirect,
  predicate: user => user.isAdmin,
  wrapperDisplayName: 'UserIsAdmin'
})

const LoggedInRedirect = withProps((props) => ({
  redirectPath: redirectHelper.getRedirect(props) || '/foo',
  redirect: createRedirect(false, props.history)
}))(Redirect)

export const userIsNotAuthenticated = authWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'UserIsNotAuthenticated',
  // Want to redirect the user when they are done loading and authenticated
  predicate: user => user.data === null && user.isLoading === false,
  FailureComponent: LoggedInRedirect
})
