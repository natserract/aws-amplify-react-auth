import { useEffect, useState } from 'react'
import { Route, Switch, Router, Redirect, RouteProps } from 'react-router-dom'
import { createBrowserHistory } from "history";
import useAuthStatus from './hooks/useAuthStatus'
import { Auth } from 'aws-amplify'
import { Hub } from '@aws-amplify/core';
import { AmplifySignOut } from '@aws-amplify/ui-react'

// Components
import Home from './pages/home'
import SignIn from './pages/sign-in'
import SignUp from './pages/sign-up'

const AuthenticatedRoute: React.FC<{
    component: React.FC;
    isAuthenticated: boolean;
    path: string;
}> = (props) => {
    const { isAuthenticated, component, path } = props
    const history = createBrowserHistory()

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         history.push('/sign-in')
    //     }
    // }, [history, isAuthenticated])

    if (isAuthenticated) return <Route  path={path} component={component} />
    return (
        <>
            { !isAuthenticated && <Route path="/sign-in" component={SignIn} />}
            { !isAuthenticated && <Redirect to="/sign-in" />}
        </>
    )

}

const AppRouter = () => {
    // Using custom history, page not rendering
    // Issue: react-router-dom v5 not compatible with history v5
    // https://stackoverflow.com/questions/62449663/react-router-with-custom-history-not-working
    const history = createBrowserHistory()
    const authStatus = useAuthStatus()

    const [state, setState] = useState(false)

    useEffect(() => {
        let updateUser = async () => {
            try {
                await Auth.currentAuthenticatedUser()
                setState(true)
            } catch {
                setState(false)
            }
        }
        Hub.listen('auth', updateUser)
        updateUser()
        return () => Hub.remove('auth', updateUser)

    }, [history, authStatus])

    return (
        <Router history={history}>
            <Switch>
                <Route path="/sign-up" component={SignUp} />
                <AuthenticatedRoute
                    path="/"
                    component={Home}
                    isAuthenticated={state}
                />
            </Switch>
        </Router>
    )
}

export default AppRouter