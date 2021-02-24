import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify'
import useAuthStatus from '../../hooks/useAuthStatus'
import { createBrowserHistory } from 'history'
import styles from './styles'
import { SignInReducer, initialState } from './reducer'
import { Link } from 'react-router-dom'

interface IFormFiels {
    email: string;
    password: string
}

const useStyles = makeStyles(styles)

const SignIn = () => {
    const classes = useStyles()
    const history = createBrowserHistory()

    const { handleSubmit, register } = useForm<IFormFiels>();
    const authStatus = useAuthStatus()
    const authState = Boolean(authStatus)

    const [state, dispatch] = useReducer(SignInReducer, initialState);

    const onSubmit = handleSubmit(async (result) => {
        dispatch({ type: '@@FETCH_REQUEST' })

        const { email, password } = result
        try {
            await Auth.signIn(email, password)
            dispatch({ type: '@@FETCH_SUCCESS' })
        } catch (error) {
            console.error(error)
            dispatch({ type: '@@FETCH_ERROR' })
        }
    });

    const RenderBoundaries = () => {
        const { loading, errors } = state
        if (loading) return <CircularProgress className={classes.progress} />
        if (errors) return <>Error</>

        return null
    }

    const RenderEmailField = () => (
        <TextField
            fullWidth
            inputRef={register}
            label="Email"
            name="email"
            size="small"
            variant="outlined"
        />
    )

    const RenderPassField = () => (
        <TextField
            fullWidth
            inputRef={register}
            label="Password"
            name="password"
            size="small"
            type="password"
            variant="outlined"
        />
    )

    useEffect(() => {
        if (authState) history.push('/')
    }, [authState, history])

    return (
        <form onSubmit={onSubmit} className={classes.form}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <RenderEmailField />
                        </Grid>
                        <Grid item xs={12}>
                            <RenderPassField />
                        </Grid>
                    </Grid>
                    <Button className={classes.btnLogin} color="primary" fullWidth type="submit" variant="contained">
                        {state.loading ? 'Please wait...' : 'Log in'}
                    </Button>
                </Grid>
                <Grid item xs={12} className={classes.gridBottom}>
                    <RenderBoundaries />
                    <span style={{ marginLeft: '20px' }}>Belum punya akun? <Link to="/sign-up"> Sign Up</Link></span>
                </Grid>
            </Grid>
        </form>
    )
}

export default SignIn