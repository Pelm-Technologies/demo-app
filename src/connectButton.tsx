import * as React from "react";

import { Endpoints } from "./Endpoints";

import { Config, useConnect } from "react-pelm-connect";

import { CLIENT_ID, CLIENT_SECRET, USER_ID, ENVIRONMENT } from "./constants";

import Button from '@mui/material/Button';


type Props = {
    config: Config
    className?: string;
    children?: React.ReactNode;
}

export const ConnectButton = (props: Props) => {
    const { open, ready, error } = useConnect(props.config);

    return (
            <Button
                variant="contained"
                onClick={() => open()}
                disabled={!ready}
            >
                Connect your utility

            </Button>            
    )
}