import * as React from "react";

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ConnectButton } from 'src/connectButton'
import { Config, useConnect } from "react-pelm-connect";

import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";


import { SetupStep } from "src/Components/SetupStep";

type Props = {
    connectToken?: string;
    authorizationCode?: string;
    setAuthorizationCode: (authorizationCode: string) => void;
    onContinue: () => void;
}

type State = {
    responseBody?: any;
}

export class ConnectUtilityStep extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {}
    }

    onSuccess = (authorizationCode: string) => {
        const log = 
        `onSuccess called with arguments:
        {
            'authorizationCode': ${authorizationCode}
        }`
        console.log(log)
        this.setState({
            responseBody: log
        })
        this.props.setAuthorizationCode(authorizationCode)
        this.props.onContinue()
    }

    onExit = (status: string, metadata: any) => {
        const log = 
        `onExit called with arguments:
        {
            'status': ${status}
            'metadata': ${JSON.stringify(metadata)}
        }`
        console.log(log)
        this.setState({
            responseBody: log
        })
    }

    requestChild() {
        return <CopyBlock
            text={codeSnippet}
            language="javascript"
            showLineNumbers={true}
            theme={dracula}
            // wrapLines
            codeBlock
        />
    }

    responseChild() {
        if (this.state.responseBody) {
            return <CodeBlock
                text={this.state.responseBody}
                // text={JSON.stringify(this.state.responseBody, null, '\t')}
                // language="text"
                showLineNumbers={true}
                theme={dracula}
                // codeBlock
            />
        }
    }

    render(): React.ReactNode {
        const config: Config = {
            connectToken: this.props.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }

        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Now that you've generated a <code>connect_token</code>, you can utilize Connect on your frontend to have your user input utility credentials. 
            You'll need to pass <code>onSuccess</code> and <code>onExit</code> callbacks, which are described in more detail <a href='https://github.com/Pelm-Technologies/react-pelm-connect' target='_blank'>here</a>.
            <br/><br/>
            Click "CONNECT YOUR UTILITY" to simulate your user opening the Connect flow and entering credentials.
            You can use real credentials for any one of our <a href='https://pelm.com/docs/reference/utilities' target='_blank'>supported utilities</a>. Alternatively, you can use our <a href="https://pelm.com/docs/reference/sandbox-user" target="_blank">Sandbox User</a>.
            Select the utility "Pacific Gas and Electric" and use the following credentials:
            <br/><br/>
            username: <code>user@pelm.com</code>
            <br/>
            password: <code>password</code>
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <ConnectButton config={config} />
        </Box>

        const response = this.props.authorizationCode
            ? this.props.authorizationCode
            : 'Please connect your Utility to view authorizationCode'

        return <SetupStep
            title="2. Enter Credentials"
            description={description}
            requestChild={this.requestChild()}
            responseChild={this.responseChild()}
            children={children}
            shouldHidePrettyView
        />
    }
}

const codeSnippet = 
`import { useConnect, Config } from 'react-pelm-connect';

const Connect = (props: Props) => {
    const config: Config = {
        connectToken: '<connect_token from previous step>',
        onSuccess: (authorizationCode: string) => {
            // exchange authorizationCode for accessToken here
        },
        onExit: (status: string, metadata: any) => {...}
    };

    const { open, ready, error } = useConnect(config);

    return <button
        type="button"
        className="button"
        onClick={() => open()}
        disabled={!ready}
    >
        Connect your utility
    </button>
}

export default Connect`