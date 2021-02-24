import { Theme, createStyles } from '@material-ui/core/styles'

export default (theme: Theme) => createStyles({
    container: {
        maxWidth: '500px',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        flexDirection: 'column',
    },
    button: {
        marginTop: '20px'
    }
})
