import * as React from "react";
import styled from 'styled-components';

import { v4 as uuidv4 } from 'uuid';

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import { ConnectedContent } from "./connectedContent";
import { Config, useConnect } from "react-pelm-connect";

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type View = 'request' | 'response' | 'pretty'

type Props = {
    // isLoading: boolean;
    // error?: string;

    title: string;
    description?: React.ReactChild;

    // TODO: make this an element
    // request: string;
    // response: string;

    // requestChild: 



    // curl?: string;

    // onSendRequestClick: () => void;

    // requestInfoChild: React.ReactChild;
    // responseInfoChild: React.ReactChild;

    request: React.ReactChild;
    response?: React.ReactChild;
    prettyViewChild?: React.ReactChild;

    // data?: any;
    // defaultExpanded?: boolean;
}

type State = {
    view: View;
    // shouldShouldCurl: boolean;
}

export class Endpoint extends React.Component<Props, State> {
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
        } else if (prevProps.response !== this.props.response && this.props.response) {
            console.log("asshole")
            console.log(prevProps.response)
            console.log(this.props.response)
            this.setState({view: 'response'})
        }
    }

    onViewChange = (event: any, view: View) => {
        if (view !== null) {
            this.setState({view});
        }
    }

    renderDataContent() {
        // if (this.state.view == 'request') {
        //     return <CopyBlock
        //         text={this.props.request}
        //         language="curl"
        //         showLineNumbers={false}
        //         theme={dracula}
        //         wrapLines
        //     />
        // } else if (this.state.view == 'response') {
        //     return <CopyBlock
        //         text={this.props.response}
        //         language="json"
        //         showLineNumbers={true}
        //         theme={dracula}
        //         wrapLines
        //     />
        // } else {
        //     return this.props.prettyViewChild
        // }

        if (this.state.view == 'request') {
            return this.props.request
        } else if (this.state.view == 'response') {
            return this.props.response
        } else {
            return this.props.prettyViewChild
        }
    }

    render() {
        // const codeBlockText = this.state.view == 'request'
        //     ? this.props.request
        //     : this.props.response

        const codeBlock = this.state.view == 'request'
            ? <CopyBlock
                text={this.props.request}
                language="curl"
                showLineNumbers={false}
                theme={dracula}
                wrapLines
            />
            : <CopyBlock
                text={this.props.response}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                wrapLines
            />

        return <Box sx={{
            width: '1000px',
        }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {this.props.title}
            </Typography>
            {this.props.description}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // width: '1000px',
                minHeight: '500px',
                marginTop: '25px'
            }}>
                <Box sx={{
                    width: 325,
                }}>
                    {this.props.children}
                </Box>
                
                <Box>
                    <ToggleButtonGroup
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
                            disabled={!this.props.response}
                        >
                            Response
                        </ToggleButton>
                        <ToggleButton 
                            value="pretty" 
                            aria-label="centered"
                            disabled={!this.props.prettyViewChild}
                        >
                            Pretty
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{
                        width: 625,
                        height: 500,
                        overflowY: 'scroll'
                    }}>
                        {/* <CopyBlock
                            text={codeBlockText}
                            language="curl"
                            showLineNumbers={false}
                            theme={dracula}
                            wrapLines
                        /> */}
                        {this.renderDataContent()}
                    </Box>
                </Box>
            </Box>
        </Box>
    }
}