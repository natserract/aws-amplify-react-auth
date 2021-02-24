import { useEffect, useState } from 'react'
import { Route, Switch, Router, Redirect } from 'react-router-dom'
import { createBrowserHistory } from "history";
import useAuthStatus from './hooks/useAuthStatus'
import { Auth } from 'aws-amplify'
import { Hub } from '@aws-amplify/core';

// Components
import Home from './pages/home'
import SignIn from './pages/sign-in'

const AuthenticatedRoute = ({ private: ComponentPrivate, public: ComponentPublic, isLoggedIn, ...props }) => {
    if (isLoggedIn) {
        return <ComponentPrivate {...props} />
    }

    return (
        <>
            <Route exact path="/login" component={ComponentPublic} />
            <Redirect from="*" to="/login" />
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
                <AuthenticatedRoute 
                    private={Home} 
                    isLoggedIn={state}
                    public={SignIn}
                />
            </Switch>
        </Router>
    )
}

export default AppRouter