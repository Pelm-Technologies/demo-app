import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CopyBlock, dracula } from "react-code-blocks";



// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import { EnergyAccount } from './types'

type View = 'pretty' | 'data'

type Props = {
    isLoading: boolean;
    // error?: string;

    title: string;
    curl?: string;

    onSendRequestClick: () => void;

    requestInfoChild: React.ReactChild;
    responseInfoChild: React.ReactChild;
    prettyViewChild?: React.ReactChild;

    data?: any;
    defaultExpanded?: boolean;
}

type State = {
    dataView: View;
    shouldShouldCurl: boolean;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 800px;
`

export class Endpoint extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            dataView: 'pretty',
            shouldShouldCurl: false,
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.prettyViewChild !== this.props.prettyViewChild) {
            console.log("asshole")

            if (!this.props.prettyViewChild) {
                console.log("gorilla!")
                this.setState({dataView: 'data'})
            }
        }
      }

    onViewChange = (event: any, view: View) => {
        if (view !== null) {
            this.setState({dataView: view});
        }
    }

    onCurlDisplayChange = (event: any) => {
        this.setState({shouldShouldCurl: !this.state.shouldShouldCurl})
    }

    renderHeader() {
        return <Typography variant="h4" gutterBottom component="div">
            {this.props.title}
        </Typography>
    }

    renderRequestSection() {
        const showCurlButtonText = this.state.shouldShouldCurl
            ? 'HIDE CURL'
            : 'SHOW CURL'

        return <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    width: 800
                }}>
                    {/* {this.props.requestInfoChild} */}
                    <Box>
                        {this.props.requestInfoChild}
                        {/* {this.maybeRenderCurlContent()} */}
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Button 
                        variant="outlined"
                        onClick={this.props.onSendRequestClick}
                        disabled={this.props.isLoading}
                    >
                        Send Request
                    </Button>
                    <Button 
                        variant="outlined"
                        // onClick={this.props.onSendRequestClick}
                        onClick={this.onCurlDisplayChange}
                        color="secondary"
                        sx={{marginTop: '8px'}}
                    >
                        {showCurlButtonText}
                    </Button>
                </Box>

            </Box>
            {this.maybeRenderCurlContent()}

        </Box>
        

    }

    maybeRenderCurlContent() {
        return this.state.shouldShouldCurl
            ? <Box sx={{marginTop: '16px'}}>
                <CopyBlock
                    text={this.props.curl}
                    language="curl"
                    showLineNumbers={false}
                    theme={dracula}
                />
            </Box>
            : null
    }

    renderPrettyView() {
        return this.props.prettyViewChild
        // return <Paper
        //     variant="outlined"    
        // >
        //     {this.props.prettyViewChild}
        // </Paper>
    }

    renderDataView() {
        return <CopyBlock
            text={JSON.stringify(this.props.data, null, '\t')}
            language="json"
            showLineNumbers={true}
            theme={dracula}
        />
    }

    maybeRenderResponseSection() {
        if (!this.props.data) {
            return null;
        }

        const content = this.props.isLoading
            ? this.renderLoadingIndicator()
            : this.renderResponseInfo()

        return (
            <div>
                <Card sx={{
                    marginTop: '12px',
                }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        {content}
                    </CardContent>
                </Card>
            </div>
        )
    }

    renderLoadingIndicator() {
        return <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>;
    }

    renderResponseInfo() {
        const isError = ('error_code' in this.props.data);

        const toggleButtonValue = isError
            ? 'data'
            : this.state.dataView

        const dataContent = toggleButtonValue == 'pretty'
            ? this.renderPrettyView()
            : this.renderDataView();


        const responseInfoChild = isError
            ? this.renderErrorResponseInfo()
            : this.props.responseInfoChild

        return <div style={{display: 'flex'}}>
            <Box sx={{
                width: 350, 
                height: 500
            }}>
                {responseInfoChild}
            </Box>
            <Box sx={{
                marginLeft: '16px'
            }}>
                {/* <Box> */}
                    <ToggleButtonGroup
                        value={toggleButtonValue}
                        size="small"
                        exclusive
                        onChange={this.onViewChange}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="pretty" aria-label="left aligned">
                            Pretty view
                        </ToggleButton>
                        <ToggleButton value="data" aria-label="centered">
                            Data view
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{
                        width: 650,
                        height: 500,
                        overflowY: 'scroll'
                    }}>
                        {dataContent}
                    </Box>
                {/* </Box> */}
            </Box>
        </div>
    }

    renderErrorResponseInfo() {
        const errorCode = this.props.data!.error_code

        let message: string;
        switch (errorCode) {
            case 'parameter_invalid':
                message = "One or more parameters are invalid. The error_message should provide more context."
                break;
            case 'parameter_missing':
                message = "One or more required parameters are missing. View the API docs to see which parameters are required for each request."
                break;
            case 'data_unavailable':
                message = "The data for this User is not yet available. It usually takes a few minutes to sync data after a utility login is connected for the first time. It usually takes a few seconds to sync Accounts and a few minutes to sync Intervals."
                break;
            default:
                message = "An error occured while handling this request."
        }

        return <Box>
            {message}
        </Box>
    }
    
    

    render() {
        return <Accordion
            defaultExpanded={this.props.defaultExpanded}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                {/* <Typography>Accordion 1</Typography> */}
                {/* <Typography variant="h4" gutterBottom component="div">
                    {this.props.title}
                </Typography> */}
                {this.renderHeader()}
            </AccordionSummary>
            <AccordionDetails>
                {/* <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography> */}
                {this.renderRequestSection()}
                {this.maybeRenderResponseSection()}
            </AccordionDetails>
        </Accordion>
    }
}