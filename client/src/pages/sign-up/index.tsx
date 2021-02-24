import React, { useEffect, useCallback, useState, useReducer } from 'react';
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
import { Link } from 'react-router-dom'
import { withAuthenticator, AmplifySignOut, AmplifySignUp, AmplifyPhoneField } from '@aws-amplify/ui-react';
import { SignUpReducer, initialState } from './reducer'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles(styles)

interface IFormFiels {
    email: string;
    password: string;
    phoneNumber: string;
}

const SignUpConfirmDialog = ({ open, setOpen }: any) => {
    const history = createBrowserHistory()
    const { handleSubmit, register } = useForm<{ code: string }>();
    const [loading, setLoading] = useState(false)

    const onSubmit = handleSubmit(async (result) => {
        setLoading(true)
        const email = localStorage.getItem('email')
        const { code } = result
        console.log('result confirm', result)

        try {
            if (email) {
                await Auth.confirmSignUp(email, code)
                redirectTo('/sign-in')
            }

        } catch (err) {
            console.error(err)
            redirectTo('/sign-up')
        }

        setLoading(false)
        setOpen(false)
        clearStorage()
    })

    const redirectTo = (path: string) => window.location.href = path
    const clearStorage = () => localStorage.removeItem('email')

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <form onSubmit={onSubmit}>
                <DialogTitle id="form-dialog-title"> Confirm Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>Check your verfication code in your email</DialogContentText>
                    <TextField
                        inputRef={register}
                        autoFocus
                        margin="dense"
                        name="code"
                        id="code"
                        label="Verification code"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button type="submit" color="primary">{loading ? 'Please wait' : 'Confirm'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const SignUp = () => {
    const classes = useStyles()

    const [open, setOpen] = useState(false);
    const { handleSubmit, register } = useForm<IFormFiels>();
    const [state, dispatch] = useReducer(SignUpReducer, initialState);

    const onSubmit = handleSubmit(async (result) => {
        dispatch({ type: '@@FETCH_REQUEST' })
        const { email, password, phoneNumber } = result

        try {
            await Auth.signUp({
                username: email,
                password,
                attributes: {
                    phone_number: `+62${phoneNumber}`
                }
            })
            dispatch({ type: '@@FETCH_SUCCESS' })
            setOpen(true)
            localStorage.setItem('email', email)
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

    return (
        <Grid container spacing={3}>
            <form onSubmit={onSubmit} className={classes.form}>
                <Grid item xs={12} className={classes.grid}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                inputRef={register}
                                label="Email *"
                                name="email"
                                size="small"
                                variant="outlined"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                inputRef={register}
                                label="Password *"
                                name="password"
                                size="small"
                                type="password"
                                variant="outlined"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                inputRef={register}
                                label="Phone Number *"
                                name="phoneNumber"
                                size="small"
                                type="tel"
                                variant="outlined"
                                autoComplete="off"
                                placeholder="(+62) ex: 8814715695"
                            />
                        </Grid>
                        <Button className={classes.btnSignUp} color="primary" fullWidth type="submit" variant="contained">
                            {state.loading ? 'Please wait...' : 'Sign Up'}
                        </Button>
                        <Grid item xs={12} className={classes.gridBottom}>
                            <RenderBoundaries />
                            <span style={{ marginLeft: '20px' }}>Sudah punya akun? <Link to="/sign-in"> Sign In</Link></span>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

            <SignUpConfirmDialog open={open} setOpen={setOpen} />
        </Grid>
    )
}

export default SignUp