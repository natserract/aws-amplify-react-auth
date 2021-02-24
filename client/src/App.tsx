import {
    ThemeProvider,
    createMuiTheme as createTheme,
    responsiveFontSizes,
} from '@material-ui/core/styles';
import Theme from './theme'
import '@aws-amplify/ui/dist/style.css'
import { ApolloProvider } from 'react-apollo';
import awsconfig from './aws-exports'
import Amplify, { Auth } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react'
import AWSAppSyncClient from 'aws-appsync'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import { GRAPHQL_API_ENDPOINT_URL, GRAPHQL_API_REGION, AUTH_TYPE } from './config/aws'
import { Rehydrated as AmplifyRehydrated } from 'aws-appsync-react'
import AppRouter from './Router'

const theme = responsiveFontSizes(createTheme({
    ...Theme,
}));

// Amplify init
Amplify.configure(awsconfig)

// Force to any, because apollor provider
// Has different types with AWSAppSyncClient
// For authentication see: https://github.com/aws-amplify/amplify-js/blob/main/README.md
const client: any = new AWSAppSyncClient({
    url: GRAPHQL_API_ENDPOINT_URL,
    region: GRAPHQL_API_REGION,
    auth: {
        type: AUTH_TYPE,
        // Get the currently logged in users credential.
        jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
    },
    // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
    complexObjectsCredentials: () => Auth.currentCredentials()
});

// If you want to using default from aws amplify used this:
const RenderAuthenticator = ({ isCustom, children, ...props }) => {
    if (isCustom === true) return <Authenticator hideDefault={true} children={children} {...props} />
    return <AmplifyAuthenticator children={children} {...props} />
}

const App = () => {
    return (
        <RenderAuthenticator isCustom={true}>
            <ApolloProvider client={client}>
                <AmplifyRehydrated>
                    <ThemeProvider theme={theme}>
                        <AppRouter />
                    </ThemeProvider>
                </AmplifyRehydrated>
            </ApolloProvider>
        </RenderAuthenticator>
    );
}

export default App
