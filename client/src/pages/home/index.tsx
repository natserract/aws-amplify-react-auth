import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import { AmplifyLoadingSpinner, AmplifySignOut } from '@aws-amplify/ui-react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles'

const useStyles = makeStyles(styles)

const Home = () => {
    const classes = useStyles()
    let [state, setState] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const response = await Auth.currentUserInfo()
                setState(response)
            } catch(err) {
                console.error(err)
                setState(null)
            }
        })()
    }, [])

    if (!state) return <AmplifyLoadingSpinner />

    return (
        <div className={classes.container}>
            <h1>You're logged in! </h1>
            { JSON.stringify(state) }
            <AmplifySignOut className={classes.button} />
        </div>
    )
}

export default Home