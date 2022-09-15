import * as React from "react";
import styled from 'styled-components';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type View = 'request' | 'response' | 'pretty'

type Props = {
    title: string;
    description?: React.ReactChild;
    requestChild?: React.ReactChild;
    responseChild?: React.ReactChild;
    prettyViewChild?: React.ReactChild;

    shouldHidePrettyView?: boolean;
}

type State = {
    view: View;
    // shouldShouldCurl: boolean;
}

export class FlowStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            view: 'request',
            // shouldShouldCurl: false,
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.prettyViewChild !== this.props.prettyViewChild && this.props.prettyViewChild) {
            this.setState({view: 'pretty'})
            // console.log("asshole")

            // if (!this.props.prettyViewChild) {
            //     console.log("gorilla!")
            //     this.setState({view: 'pretty'})
            // }
        } else if (prevProps.responseChild !== this.props.responseChild && this.props.responseChild) {
            console.log("asshole")
            console.log(prevProps.responseChild)
            console.log(this.props.responseChild)
            this.setState({view: 'response'})
        }
    }

    onViewChange = (event: any, view: View) => {
        if (view !== null) {
            this.setState({view});
        }
    }

    renderToggleButtonGroup() {
        const prettyViewChild = this.props.shouldHidePrettyView
            ? null
            : <ToggleButton 
                value="pretty" 
                aria-label="centered"
                disabled={!this.props.prettyViewChild}
            >
                Pretty
            </ToggleButton>

        return <ToggleButtonGroup
            value={this.state.view}
            size="small"
            exclusive
            onChange={this.onViewChange}
            aria-label="text alignment"
        >
            <ToggleButton 
                value="request" 
                aria-label="centered"
            >
                Request
            </ToggleButton>
            <ToggleButton 
                value="response" 
                aria-label="centered"
                disabled={!this.props.responseChild}
            >
                Response
            </ToggleButton>
            {prettyViewChild}
        </ToggleButtonGroup>
    }

    renderDataContent() {
        if (!this.props.requestChild) {
            return
        }

        let child: React.ReactChild;
        if (this.state.view == 'request') {
            child = this.props.requestChild
        } else if (this.state.view == 'response') {
            child = this.props.responseChild!
        } else {
            child = this.props.prettyViewChild!
        }

        return <Box>
            {this.renderToggleButtonGroup()}
            <Box sx={{
                width: 625,
                // height: 500,
                maxHeight: 500,
                overflowY: 'scroll'
            }}>
                {child}
            </Box>
        </Box>

    }

    render() {
        // const codeBlockText = this.state.view == 'request'
        //     ? this.props.request
        //     : this.props.response

        const codeBlock = this.state.view == 'request'
            ? <CopyBlock
                text={this.props.requestChild}
                language="curl"
                showLineNumbers={false}
                theme={dracula}
                wrapLines
            />
            : <CopyBlock
                text={this.props.responseChild}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                wrapLines
            />

        return <Box sx={{
            width: '1000px',
            // marginBottom: '200px'
        }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {this.props.title}
            </Typography>
            {this.props.description}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // width: '1000px',
                // minHeight: '500px',
                maxHeight: '500px',
                marginTop: '25px'
            }}>
                <Box sx={{
                    width: 325,
                }}>
                    {this.props.children}
                </Box>

                {this.renderDataContent()}
            </Box>
        </Box>
    }
}