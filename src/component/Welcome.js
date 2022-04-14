import { Box, Container, Typography } from "@material-ui/core";
import { Icon } from "@mui/material";
import React, { useEffect, useState, useRef, useContext } from "react";
import useWindowSize from "../utils/windowSize";

const WellcomePage = () => {

    const size = useWindowSize();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    bgcolor: 'rgb(220 223 225)',
                    // height: `calc(${window.innerHeight}px - 112px)`,
                    height: `calc(${size.height}px - 112px)`,
                    marginY: 3,
                    p: 2,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
                style={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>

                        <Icon baseClassName="fas" className="fa-solid fa-comments" sx={{ width: "100%", fontSize: 100, color: 'rgba(121, 85, 72, 1)' }} />
                        <Typography variant="h4" gutterBottom component="div" style={{ alignSelf: 'center' }}>
                            Select A Friend
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div" style={{ alignSelf: 'center' }}>
                            Add friend from blog
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom component="div" style={{ alignSelf: 'center' }}>
                            Use 'TestUser' as username and password '1234' for experiancing Chat
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
};
export default WellcomePage

