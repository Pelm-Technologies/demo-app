import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ConnectButton } from 'src/connectButton'
import { Config, useConnect } from "react-pelm-connect";

import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";


import { FlowStep } from "src/Components/FlowStep";

type Props = {
    connectToken?: string;
    authorizationCode?: string;
    setAuthorizationCode: (authorizationCode: string) => void;
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
        `onSuccess called with argument:
            - authorizationCode = ${authorizationCode}`
        console.log(log)
        this.setState({
            responseBody: log
        })
        this.props.setAuthorizationCode(authorizationCode)
    }

    onExit = (status: string, metadata: any) => {
        const log = 
        `onExit called with arguments:
            - status = ${status}
            - metadata = ${JSON.stringify(metadata)}`
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
            Now that you've generated a connect_token, you can initialize Connect to connect your Utility credentials. 
            You've also need to pass <code>onSuccess</code> and <code>onExit</code> callbacks, which are described in more detail <a href='https://github.com/Pelm-Technologies/react-pelm-connect' target='_blank'>here</a>.
            <br/><br/>
            Click "CONNECT YOUR UTILITY" to open the Connect flow.
            You can use real credentials for any one of our <a href='https://docs.pelm.com/reference/utilities' target='_blank'>supported utilities</a>.
            <br/><br/>
            Alternatively, you can connect our <a href="https://pelm.readme.io/reference/sandbox-user" target="_blank">Sandbox User</a>.
            Select the utility "Pacific Gas and Electric", and use the following credentials:
            <br/>
            username: <code>user@pelm.com</code>
            <br/>
            password: <code>password</code>
            {/* Alternatively, you can use the credentials for our <a href="https://pelm.readme.io/reference/sandbox-user" target="_blank"  >Sandbox User</a>.
            <br/>
            <br/>
            Select the utility "Pacific Gas and Electric". On the credentials screen, enter the following credentials:
            <br/>
            username: <code>user@pelm.com</code>
            <br/>
            password: <code>password</code>
            <br/>
            <br/> */}
            {/* Or you can click "SKIP CONNECT FLOW" button to simulate going through the Connect Flow as the Sandbox User.
            <br/>
            <br/> */}
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

        return <FlowStep
            title="2. Connect your Utility"
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