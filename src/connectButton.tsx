import * as React from "react";

import { Config, useConnect } from "react-pelm-connect";

import Button from '@mui/material/Button';


type Props = {
    config: Config
    className?: string;
    children?: React.ReactNode;
}

export const ConnectButton = (props: Props) => {
    const { open, ready, error } = useConnect(props.config);

    console.log("connectIsReady: ", ready);
    console.log("error", error)

    return (
            <Button
                variant="contained"
                onClick={() => open()}
                disabled={!ready}
                // sx={{marginLeft: '8px'}}
                color="primary"
            >
                Connect your utility

            </Button>            
    )
}