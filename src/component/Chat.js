import { Avatar, Box, Button, Divider, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Badge } from '@mui/material';
import { MoreVert, Send } from "@mui/icons-material";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from 'react-use-websocket';
import Context from "../utils/context";
import useWindowSize from "../utils/windowSize";

const ChatSocket = (props) => {

    const { value, other } = props;
    const size = useWindowSize();
    const [message, setMesssage] = useState('');
    const [offset, setOffset] = useState(0);
    const [totalMessage, setTotalMessage] = useState()
    const [fetchMessages, setFetchMessages] = useState([]);
    const [user, setUser] = useState({});
    const [userConnected, setUserConnected] = useState(false);
    const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;
    const bottom = useRef(null);
    const classes = useStyles();
    let { id } = useParams();
    const baseSocketUrl = `ws://${API_URL}/chat/chating/`;
    const [socketUrl, setSocketUrl] = useState(`ws://${API_URL}/chat/chating/${id}`);
    const [data, setData] = useContext(Context);

    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjMxMTI1OTI4fQ._-wuDEO0jHD1dpnpF4ZIgbNEz36ySiIU5V3nXgZ0svM'

    const token = localStorage.getItem('token')

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (e) => {
            const payload = JSON.parse(e.data)
            if (payload['fetch_data']) {
                const reverse = payload['fetch_data'].reverse();
                setFetchMessages(reverse)
                // if (payload['current_user']) {
                setUser(payload['current_user'])
                // }
                setTotalMessage(payload['total_message'])
                scrollDown()
            }
            else if ('connected' in payload) {
                if (payload['connected']) {
                    setUserConnected(true)
                }
                else {
                    setUserConnected(false)
                }
            }
            else if (payload['accept_message']) {
                setFetchMessages([...fetchMessages, payload['accept_message']])
                scrollDown()
            }
            else if (payload['load_message']) {
                const reverse = payload['load_message'].reverse();
                const array = [...fetchMessages]
                const temp = array.unshift(...reverse)
                console.log('>>>>>> type of temp', typeof (array))
                setFetchMessages(array)

            }
            else if (payload['new_unseen_message']) {
                setData({ ...data, ['unseen_message']: { ...data?.unseen_message, [payload['user']]: payload['message'].slice(0, 15) } })
            }
        },
        onOpen: () => {
            sendMessage(JSON.stringify({ 'token': token }))
        },
        onClose: () => {
            setUserConnected(false)
            // sendMessage(JSON.stringify({ 'remove_user': token }))
        }
    });


    useEffect(() => {
        setSocketUrl(`${baseSocketUrl}${id}`);
        if (data.unseen_message?.[id]) {
            const trash = { ...data }
            delete trash.unseen_message?.[id]
            setData({ ...trash })
        }
    }, [id]);

    const scrollDown = () => {
        bottom.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }

    // useEffect(() => {
    //     bottom.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    // }, [fetchMessages])

    const handleClickSendMessage = (e) => {
        e.preventDefault();
        sendMessage(JSON.stringify({ 'new_message': message }))
        setMesssage('')
    };
    const loadMore = () => {
        if (offset < totalMessage) {
            sendMessage(JSON.stringify({ 'load_message': offset + 10 }))
            setOffset(offset + 10)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // socketRef.sendMessage(message);
        // if (socketRef.readyState === 1) {
        //     socketRef.send(JSON.stringify({ 'new_message': message }))
        //     setMesssage('');
        // }
    };

    return (
        <div className={classes.chatContainer}>
            <Box
                sx={{
                    display: "flex",
                    // flexDirection: "row",
                }}>
                <Badge
                    component="div"
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="error"
                    invisible={!userConnected}
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: '#795548',
                            bottom: '27%',
                            '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: 'ripple 1.2s infinite ease-in-out',
                                border: '1px solid currentColor',
                                content: '""',
                            },
                        },
                        '@keyframes ripple': {
                            '0%': {
                                transform: 'scale(.8)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(2.4)',
                                opacity: 0,
                            },
                        },
                    }}

                // badgeContent={
                //     <SmallAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                // }
                >
                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" >
                        A
                    </Avatar>
                </Badge>
                <Box sx={{
                    // marginLeft: 10
                    px: 2
                }}>
                    <Typography variant="subtitle1">
                        {
                            value.find(element => element.id == id)?.username
                        }
                    </Typography>
                </Box>
                <IconButton style={{ marginLeft: "auto" }}>
                    <MoreVert />
                </IconButton>
            </Box>
            <Divider />
            <Box sx={{
                // flex: 1,
                height: `calc(${size.height}px - 176px)`,
                display: "flex",
                flexDirection: "column",
            }}
                style={{
                    overflowY: "scroll"
                }}
            >
                {/* <button >
                    load more
                </button> */}
                <Button style={{ width: "50%", alignSelf: "center" }} disabled={totalMessage <= 10 || totalMessage - offset < 0} variant="outlined" onClick={loadMore}>Load more</Button>
                {
                    fetchMessages.map((i, index) =>
                    (
                        <div style={{ margin: 5 }} key={i.id}>
                            <div className={clsx({ [classes.outGoing]: i.user == user?.id, [classes.inComing]: i.user != user?.id })}>
                                <Typography key={i.id} className={clsx({ [classes.inComingBox]: i.user == user?.id, [classes.outGoingBox]: i.user != user?.id })}>
                                    {i.content}
                                </Typography>
                                <small className={clsx({ [classes.outGoingTimeStamp]: i.user == user?.id, [classes.inComingTimeStamp]: i.user != user?.id })}>
                                    {moment(i.timestamp).calendar()}
                                </small>
                            </div>
                        </div>
                    )

                    )
                }
                <div ref={bottom}>

                </div>
            </Box>

            <form autoComplete="off" style={{ display: 'flex' }}>
                <TextField
                    style={{ marginBottom: 10 }}
                    fullWidth
                    required id="message"
                    name='message'
                    value={message}
                    onChange={(e) => setMesssage(e.target.value)}
                    placeholder="Type here" />
                <IconButton type='submit' onClick={handleClickSendMessage}>
                    <Send />
                </IconButton>
            </form>
        </div>
    )
};

const useStyles = makeStyles((theme) => ({
    chatContainer: {
        flexGrow: 1,
        display: "flex",
        flexDirection: 'column',
        // justifyContent: 'flex-end',
        background: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 10,
        padding: '15px 15px 0px 15px',
    },
    chatBox: {
        margin: 5
    },
    inComing: {
        float: 'left',
    },
    outGoing: {
        float: 'right',
    },

    inComingBox: {
        borderRadius: '10px 25px 0 10px',
        background: 'rgba(0, 0, 0, 0.15)',
        padding: 10
    },
    outGoingBox: {
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '25px 10px 10px 0px',
        padding: 10

    },
    outGoingTimeStamp: {
        display: 'block',
        textAlign: 'right'
    },
    inComingTimeStamp: {
        display: 'block',
        textAlign: 'left'
    }
}))

export default ChatSocket;