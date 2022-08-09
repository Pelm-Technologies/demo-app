import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'

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
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import { EnergyAccount } from './types'

type View = 'pretty' | 'data'

type Props = {
    isLoading: boolean;

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

        const curlContent = this.state.shouldShouldCurl
            ? <code><br/>{this.props.curl}</code>
            : null

        return <Box sx={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Box sx={{
                width: 800
            }}>
                {/* {this.props.requestInfoChild} */}
                <Box>
                    {this.props.requestInfoChild}
                    {curlContent}
                </Box>
            </Box>
            <Box>
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
                >
                    {showCurlButtonText}
                </Button>
            </Box>

        </Box>

    }

    renderDataView() {
        return <pre>
            <code>
                {JSON.stringify(this.props.data, null, '\t')}
                {/* {JSON.stringify(this.props.data, null, 2)} */}
            </code>
        </pre>;
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
        const dataContent = this.state.dataView == 'pretty'
            ? this.props.prettyViewChild
            : this.renderDataView();

        return <div style={{display: 'flex'}}>
            <Box sx={{
                width: 350, 
                height: 500
            }}>
                {this.props.responseInfoChild}
            </Box>
            <Box>
                <Box>
                    <ToggleButtonGroup
                        value={this.state.dataView}
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
                </Box>
            </Box>
        </div>
    }
    
    

    render() {
        // return (
        //     <div>
        //         <Typography variant="h3" gutterBottom component="div">
        //             {this.props.title}
        //         </Typography>
        //         {this.renderRequestSection()}
        //         {this.maybeRenderResponseSection()}
        //     </div>
        // )

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