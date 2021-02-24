import { useEffect, useState } from 'react'
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from "history";
import useAuthStatus from './hooks/useAuthStatus'
import { Auth } from 'aws-amplify'
import { Hub } from '@aws-amplify/core';

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

    if (isAuthenticated) return (
        <Route path={path} component={component} />
    )

    return (
        <>
            { !isAuthenticated && <Route path="/sign-in" exact component={SignIn} />}
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
    const [loggedIn, setLoggedIn] = useState<any>()

    useEffect(() => {
        const getLocalStorage = localStorage.getItem('amplify-signin-with-hostedUI')
        setLoggedIn(Boolean(getLocalStorage))

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

        if (state) history.push('/')
        return () => Hub.remove('auth', updateUser)

    }, [history, authStatus, state, loggedIn])

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/sign-up" component={SignUp} />
                <AuthenticatedRoute
                    path="/"
                    component={Home}
                    isAuthenticated={state}
                />
            </Switch>
        </BrowserRouter>
    )
}

export default AppRouter