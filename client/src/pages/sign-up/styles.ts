import { Theme, createStyles } from "@material-ui/core/styles";

export default (theme: Theme) =>
    createStyles({
        form: {
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '400px',
            margin: '0 auto',
            flexDirection: 'column'
        },
        btnSignUp: {
            marginTop: '20px',
        },
        gridBottom: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
        },
        progress: {
            position: "absolute",
            left: "70px",
        },
        grid: {
            flexBasis: 'auto'
        }
    });
