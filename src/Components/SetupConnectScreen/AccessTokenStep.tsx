import * as React from "react";

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { CopyBlock, dracula } from "react-code-blocks";
import { SetupStep } from "src/Components/SetupStep";

import { FetchHelper } from 'src/FetchHelper'

type Props = {
    fetchHelper: FetchHelper;
    authorizationCode?: string;
    setAccessToken: (accessToken: string) => void;
    onContinue: () => void;
}

type State = {
    isLoading: boolean;
    responseBody?: any;
}

export class AccessTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: false,
        }
    }

    createAccessToken = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.createAccessToken(this.props.authorizationCode!)
            .then(responseBody => {
                this.setState({ 
                    isLoading: false,
                    responseBody
                })

                if (responseBody.hasOwnProperty('access_token')) {
                    this.props.setAccessToken(responseBody['access_token'])
                    this.props.onContinue()
                }
            })
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.createAccessTokenCurl(this.props.authorizationCode)}
            language="curl"
            showLineNumbers={false}
            theme={dracula}
            customStyle={{
                padding: '10px'
            }}
        />
    }

    responseChild() {
        if (this.state.responseBody) {
            return <CopyBlock
                text={JSON.stringify(this.state.responseBody, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
            />
        }
    }

    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            After the User successfully enters their credentials, the <code>onSuccess</code> callback is called with an <code>authorization_code</code>.
            The next step is exchanging this <code>authorization_code</code> for an <code>access_token</code> via <a href='https://pelm.com/docs/api-reference/auth/create-access-token' target='_blank'>POST /auth/token</a>.
            We recommend making this request on the backend to avoid exposing the <code>access_token</code> on the frontend.
            <br/><br/>
            We've pre-populated the field below with the <code>authorization_code</code> generated in the previous step. Click "CREATE ACCESS TOKEN" to continue.
            
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="authorization_code"
                variant="outlined"  
                value={
                    this.props.authorizationCode
                        ? this.props.authorizationCode
                        : 'missing_authorization_code'
                }
                disabled
                fullWidth
            />
            
            <LoadingButton 
                variant="contained"
                onClick={this.createAccessToken}
                loading={this.state.isLoading}
                color="primary"
                sx={{marginTop: '8px'}}
                disabled={!this.props.authorizationCode}
            >
                Create access token
            </LoadingButton>
        </Box>

        return <SetupStep 
            title="3. Create Access Token"
            description={description}
            requestChild={this.requestChild()}
            responseChild={this.responseChild()}
            children={children}
            shouldHidePrettyView
        />
    }
}