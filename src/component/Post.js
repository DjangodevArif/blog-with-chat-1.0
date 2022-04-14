import React, { useContext, useEffect, useState } from "react";
import {
    Box, Card, CardActions, CardContent, CardHeader, CardMedia,
    Divider, Grid, IconButton, ListItemIcon, ListItemButton, ListItemText,
    Menu, MenuItem, Typography, Popover, makeStyles, TextField, Button, Tooltip
} from "@material-ui/core";
import {
    ArrowForwardIos, Favorite, MoreVert, Comment, Delete, FileCopy,
    Report, ThumbUp, Apple, EmojiEmotions, Share, AddIcCall, BrokenImage, ArrowBackIos, FlightTakeoff
} from "@mui/icons-material"
import { FacebookCounter, ReactionBarSelector, ReactionCounter } from '@charkour/react-reactions';
import { Avatar, AvatarGroup, Collapse, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import VideoThumbnail from 'react-video-thumbnail';
// import VideoThumbnail from "react-thumbnail-player";
import clsx from "clsx";
import axios from "axios";
import Context from "../utils/context";
import moment from "moment";

const Post = (props) => {

    const [values, setValues] = useState({});
    const [archive, setArchive] = useState(props?.value)

    const [showComment, setShowComment] = useState(false);
    const [showReply, setShowReply] = useState();
    const [openDialog, setOpenDialog] = useState({ bool: false });

    const [option, setOption] = useState(null);
    const openOption = Boolean(option);

    const [reaction, setReaction] = useState(null);
    const [currentReact, setCurrentReact] = useState("");
    const openReaction = Boolean(reaction);
    const [data, setData, user, setUser] = useContext(Context);

    const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;


    const classes = useStyles();

    const GetAllReaction = (reaction) => {

        const arrayOfReaction = [];

        function list_of_reaction() {
            reaction.reaction?.length > 0 && reaction?.reaction?.map((item, index) => {
                if (item.react == 'like') {
                    arrayOfReaction.push(
                        { label: item.react, node: <div ><ThumbUp htmlColor="rgb(43 111 215 / 87%)" /> </div>, by: item.user.username }
                    )
                } else if (item.react == 'love') {
                    arrayOfReaction.push(
                        { label: item.react, node: <div ><Favorite htmlColor="rgb(233 66 28)" /> </div>, by: item.user.username }
                    )
                } else if (item.react == 'rich') {
                    arrayOfReaction.push(
                        { label: item.react, node: <div ><Apple htmlColor="rgb(207 206 206)" /> </div>, by: item.user.username }
                    )
                } else if (item.react == 'broken') {
                    arrayOfReaction.push(
                        { label: item.react, node: <div ><BrokenImage htmlColor="rgb(96 7 23)" /> </div>, by: item.user.username }
                    )
                }
            }
            )
            return arrayOfReaction
        };

        return (
            <ReactionCounter
                iconSize={18}
                user={user?.username}
                reactions={
                    list_of_reaction()
                    // getAllReaction(archive?.reacts)
                }

            />

        );
    };

    const handleOptionOpen = (event) => {
        setOption(event.currentTarget);
    };

    const handleOptionClose = () => {
        setOption();
    };

    const handleAddFriend = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.get(`http://${API_URL}/chat/add/${archive?.user?.id}`)
            .then(response => {
                setOption();
                alert(`${response.data?.Message}`)
            })
            .catch(error => alert(`${error?.response}`))
    };

    const handleReactionOpen = (event) => {
        // setReaction(event.currentTarget);
        setReaction(true)
    };

    const handleReactionClose = () => {
        setReaction(false);
    };

    const handleReactSelection = (react) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.post(`http://${API_URL}/feed/${archive?.id}/reaction`, { 'react': react })
            .then(response => {
                setCurrentReact(response.data?.react);
                setReaction(false);
                setArchive({ ...archive, 'reacts': response?.data })

            })
            .catch(error => console.log('>>>>>>>> handleNewPost error', error?.data))
    };

    const handleReactClear = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.post(`http://${API_URL}/feed/${archive?.id}/reaction`, { 'react': currentReact })
            .then(response => {
                setCurrentReact("");
                setArchive({ ...archive, 'reacts': response?.data })
                setReaction(true);

            })
            .catch(error => console.log('>>>>>>>> handleNewPost error', error?.data))
    };

    const handleMedia = (index) => {
        setOpenDialog({
            ...openDialog,
            "bool": true,
            "media": {
                ...props.value.media?.images,
                ...props.value.media?.videos
                // 0: "https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                // 1: "https://firebasestorage.googleapis.com/v0/b/chat-with-fastapi-react.appspot.com/o/zoom_1.mp4?alt=media&token=7e2b6e17-e41a-4f23-8038-fb59449187fc",
                // 2: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            },
            "active": index
        })
    };

    const handleGalleryNext = () => {
        const num = Object.keys(openDialog.media)?.length - 1  // props.media.length -1
        let current = openDialog?.active
        console.log('num ', num, 'current', current)
        if (current < num) {
            current += 1;
            setOpenDialog({ ...openDialog, "active": current });
        }
        else if (current == num) {
            current = 0;
            setOpenDialog({ ...openDialog, "active": current });
        }
    };

    const handleGalleryPrevious = () => {
        const num = Object.keys(openDialog.media)?.length - 1 // props.media.length -1
        let current = openDialog?.active
        if (current > 0) {
            current -= 1;
            setOpenDialog({ ...openDialog, "active": current });
        }
        else if (current == 0) {
            current = num;
            setOpenDialog({ ...openDialog, "active": current });
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.post(`http://${API_URL}/feed/${archive.id}/new_comment`, { ...values.comment })
            .then(response => {
                const temp = [...archive.comments]
                temp.push(response?.data)
                setArchive({ ...archive, comments: temp })
                setValues({ ...values, 'comment': { content: "" } })
            })
            .catch(error => console.log('>>>>>>>>>>> error from comment', error.response))
    };

    const handleCommentReply = (commentId) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.post(`http://${API_URL}/feed/${archive.id}/reply`, { ...values.replay, comment_id: commentId })
            .then(response => {
                // const temp = [...archive.comments]
                // temp.push(response?.data)
                console.log('.>>>>>>>>> all comment ', response?.data)
                setShowReply()
                setArchive({ ...archive, comments: response?.data })
                setValues({ ...values, 'replay': { content: '' } })
            })
            .catch(error => console.log('>>>>>>>>>>> error from comment-reply', error.response))
    };

    useEffect(() => {
        archive?.reacts?.length > 0 && archive?.reacts?.map((item, index) => {
            if (item?.user?.username == user?.username) {
                setCurrentReact(item?.react)
                setReaction(false);
            }
        })
    }, [archive.reacts])

    return (
        <Box>
            {/* TODO: in this div we use material-ui card */}
            <Card style={{ width: '100%', boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: 5, marginTop: 4 }}>
                <CardHeader
                    avatar={
                        <Tooltip title={archive?.user?.username}>
                            <Avatar aria-label="recipe">
                                {archive?.user?.username}
                            </Avatar>
                        </Tooltip>
                    }
                    action={
                        <>
                            <IconButton
                                aria-label="settings"
                                id="option-button"
                                aria-controls="option-menu"
                                aria-expanded={openOption}
                                aria-haspopup="true"
                                onClick={handleOptionOpen}
                                style={{ padding: 5 }}>
                                <MoreVert />
                            </IconButton>
                            <Menu
                                id="option-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'option-button',
                                }}
                                anchorEl={option}
                                open={openOption}
                                onClose={handleOptionClose}
                                PaperProps={{
                                    style: {
                                        // maxHeight: ITEM_HEIGHT * 4.5,
                                        // width: '20ch',
                                    },
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem selected onClick={() => navigator.clipboard.writeText(archive?.content)} >

                                    <ListItemIcon>
                                        <FileCopy />
                                    </ListItemIcon>
                                    Copy
                                </MenuItem>
                                <MenuItem onClick={handleOptionClose}>
                                    <ListItemIcon>
                                        <Delete />
                                    </ListItemIcon>
                                    Delete
                                </MenuItem>
                                <MenuItem onClick={handleOptionClose}>
                                    <ListItemIcon>
                                        <Report />
                                    </ListItemIcon>
                                    Report
                                </MenuItem>
                                <MenuItem onClick={handleOptionClose}>
                                    <ListItemIcon>
                                        <Favorite />
                                    </ListItemIcon>

                                    Favorite
                                </MenuItem>
                                {
                                    archive?.user?.id != user?.id &&
                                    <MenuItem onClick={handleAddFriend}>
                                        <ListItemIcon>
                                            <AddIcCall />
                                        </ListItemIcon>

                                        Add or Remove friend
                                    </MenuItem>
                                }

                            </Menu>
                        </>
                    }
                    // title="Shrimp and Chorizo Paella"
                    title={`${archive?.title}`}
                    // subheader="September 14, 2016"
                    subheader={moment(archive?.timestamp).calendar()}
                />
                <Divider />
                <CardContent>
                    <Typography variant="body1" >
                        {`${archive?.content}`}
                    </Typography>
                </CardContent>
                <CardMedia
                // component="img"
                // height="230"
                // image="/static/images/cards/paella.jpg"
                // image={'/images/card1.jpg'}
                // image={`${props.value?.urlToImage}`}
                // alt="Paella dish"
                >
                    <AvatarGroup max={3} variant="square"
                        sx={{ cursor: "pointer", "& .MuiAvatar-root": { width: "auto", height: "auto", flex: 1 } }}>
                        {
                            Object.values({ ...archive.media?.images, ...archive.media?.videos })?.map((item, index) =>
                                /.*\.mp4/.test(item) ?
                                    <Avatar alt="Agnes Walker" sx={{ "& video": { display: "none" }, "& canvas": { width: 500, height: "auto", position: "relative" } }} onClick={() => handleMedia(index)} key={item.slice(-5)}>
                                        <VideoThumbnail
                                            // videoUrl="https://firebasestorage.googleapis.com/v0/b/chat-with-fastapi-react.appspot.com/o/zoom_1.mp4?alt=media&token=7e2b6e17-e41a-4f23-8038-fb59449187fc"
                                            videoUrl={item}
                                            cors={true}
                                        />
                                        <img
                                            src={"images/pause_transparent.png"}
                                            crossOrigin="anonymous"
                                            style={{ position: "absolute", width: 45, right: "42%", top: "46%" }}
                                        />
                                    </Avatar>
                                    :
                                    <Avatar alt="Walker" src={`${item}`}
                                        onClick={() => handleMedia(index)}
                                        key={item.slice(-5)}
                                    />
                            )
                        }
                        {/* {
                            typeof archive?.media == 'object' && archive.media?.videos?.map((item, index) =>
                                <Avatar alt="Agnes Walker" sx={{ "& video": { display: "none" }, "& canvas": { width: 500, height: "auto", position: "relative" } }} onClick={() => handleMedia(index, "videos")} key={index}>
                                    <VideoThumbnail
                                        // videoUrl="https://firebasestorage.googleapis.com/v0/b/chat-with-fastapi-react.appspot.com/o/zoom_1.mp4?alt=media&token=7e2b6e17-e41a-4f23-8038-fb59449187fc"
                                        videoUrl={item}
                                        cors={true}
                                    />
                                    <img
                                        src={"images/pause_transparent.png"}
                                        crossorigin="anonymous"
                                        style={{ position: "absolute", width: 45, right: "42%", top: "46%" }}
                                    />
                                </Avatar>
                            )
                        }
                        {
                            typeof archive?.media == 'object' && archive.media?.images?.map((item, index) =>

                                <Avatar alt="Walker" src={`${item}`}
                                    onClick={() => handleMedia(index, "images")}
                                    key={index}
                                />
                            )
                        } */}
                        {/* <VideoThumbnail
                            title=""
                            message=""
                            preview="https://firebasestorage.googleapis.com/v0/b/chat-with-fastapi-react.appspot.com/o/zoom_1.mp4?alt=media&token=7e2b6e17-e41a-4f23-8038-fb59449187fc"
                            // width={350}
                            muted={true}
                            badge=""
                        /> */}
                        {/* <Avatar alt="Cindy Baker" src="https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" onClick={() => handleMedia(2)} /> */}
                        {/* <Avatar alt="Cindy Baker" src="https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" onClick={() => handleMedia(3)} /> */}
                    </AvatarGroup>
                </CardMedia>
                <CardActions style={{ textAlign: "center" }} >
                    <Grid container spacing={2}>
                        <Grid item xs={4}
                        // style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
                        // className={clsx({ [classes.displayNone]: !reaction })}
                        >

                            <Box sx={{
                                display: 'flex',
                                alignItems: "center",
                                flexDirection: "column",
                                width: "100%",

                            }}>
                                {
                                    reaction ?
                                        <Box sx={{
                                            display: 'inline-block'
                                        }}>
                                            <ReactionBarSelector

                                                onSelect={handleReactSelection}
                                                reactions={[{ label: "like", node: <div style={{ color: "rgb(43 111 215 / 87%)" }}><ThumbUp /> </div> }, { label: "love", node: <div style={{ color: "rgb(233 66 28)" }}><Favorite /></div> }, { label: "rich", node: <div style={{ color: "rgb(86 85 84)" }}><Apple /></div> }, { label: "broken", node: <div style={{ color: "rgb(96 7 23)" }}><BrokenImage /></div> }]} />

                                        </Box>
                                        :
                                        (
                                            <>
                                                {
                                                    currentReact == "love" &&
                                                    <IconButton
                                                        aria-label="reaction"
                                                        onClick={handleReactClear}
                                                        classes={{ root: classes.iconBorderRadias }}
                                                    >
                                                        <Favorite />
                                                    </IconButton>
                                                }
                                                {
                                                    currentReact == "like" &&
                                                    <IconButton
                                                        aria-label="reaction"
                                                        onClick={handleReactClear}
                                                        classes={{ root: classes.iconBorderRadias }}
                                                    >

                                                        <ThumbUp />
                                                    </IconButton>
                                                }
                                                {
                                                    currentReact == "rich" &&
                                                    <IconButton
                                                        aria-label="reaction"
                                                        onClick={handleReactClear}
                                                        classes={{ root: classes.iconBorderRadias }}
                                                    >
                                                        <Apple />
                                                    </IconButton>
                                                }
                                                {
                                                    currentReact == "broken" &&
                                                    <IconButton
                                                        aria-label="reaction"
                                                        onClick={handleReactClear}
                                                        classes={{ root: classes.iconBorderRadias }}>
                                                        <BrokenImage />
                                                    </IconButton>
                                                }
                                                {
                                                    currentReact == "" &&
                                                    <IconButton
                                                        aria-label="add to favorites"
                                                        classes={{ root: classes.iconBorderRadias }}
                                                    >
                                                        <EmojiEmotions
                                                            onMouseOver={handleReactionOpen}
                                                        />
                                                    </IconButton>
                                                }
                                            </>
                                        )
                                }
                                <Divider />
                                <Typography variant="caption" component="div" >
                                    {/* {GetAllReaction(archive?.reacts)} */}
                                    <GetAllReaction reaction={archive?.reacts} />
                                    {/* <ReactionCounter
                                        iconSize={18}
                                        user="arif"


                                        reactions={
                                            getAllReaction(archive?.reacts)
                                            [   

                                            { label: "Like", node: <div style={{ color: "rgb(43 111 215 / 87%)" }}><ThumbUp htmlColor="rgb(43 111 215 / 87%)" /> </div>, by: "kader" },
                                            { label: "love", node: <div style={{ color: "rgb(233 66 28)" }}><Favorite htmlColor="rgb(233 66 28)" style={{ marginLeft: 8 }} /></div> },
                                            { label: "love", node: <div style={{ color: "rgb(233 66 28)" }}><Favorite htmlColor="rgb(233 66 28)" /></div> },
                                            { label: "Rich", node: <div style={{ color: "rgb(86 85 84)" }}><Apple htmlColor="rgb(207 206 206)" /></div> },
                                            { label: "Broken", node: <div style={{ color: "rgb(96 7 23)" }}><BrokenImage htmlColor="rgb(96 7 23)" style={{ marginLeft: 15 }} /></div> },
                                            ]
                                        }
                                    onClick={handleReactSelection}
                                    /> */}
                                </Typography>
                            </Box>
                            {/* {
                                reaction &&

                                <Box sx={{
                                    display: 'inline-block'
                                }}>
                                    <ReactionBarSelector

                                        onSelect={handleReactSelection}
                                        reactions={[{ label: "Like", node: <div style={{ color: "rgb(43 111 215 / 87%)" }}><ThumbUp /> </div> }, { label: "love", node: <div style={{ color: "rgb(233 66 28)" }}><Favorite /></div> }, { label: "Rich", node: <div style={{ color: "rgb(86 85 84)" }}><Apple /></div> }, { label: "Broken", node: <div style={{ color: "rgb(96 7 23)" }}><BrokenImage /></div> }]} />
                                    
                                </Box>
                            } */}
                        </Grid>
                        <Grid item xs={4}>
                            <IconButton aria-label="comment" classes={{ root: classes.iconBorderRadias }} onClick={() => setShowComment(!showComment)}>
                                <Comment />
                            </IconButton>
                            <Divider />
                            <Typography variant="caption" component="div" >
                                {`${archive?.comments?.length} comment's`}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <IconButton
                                // expand={expanded}
                                // onClick={handleExpandClick}
                                // aria-expanded={expanded}
                                aria-label="show more"
                                // style={{ width: '100%' }}
                                classes={{ root: classes.iconBorderRadias }}
                            >
                                <Share />
                            </IconButton>
                            <Divider />
                            <Typography variant="caption" component="div" >
                                0 share
                            </Typography>
                        </Grid>
                    </Grid>
                </CardActions>
                <Divider />
                <Collapse in={showComment} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Stack spacing={1}> {/*sx={{ display: 'flex', flexDirection: "column" }}*/}
                            {
                                archive?.comments?.map((item, index) =>
                                    <>
                                        <Box
                                            className={classes.commentBox}
                                            key={item?.id}
                                        >
                                            <Avatar style={{ width: 30, height: 30, margin: "0px 4px 0px 0px", alignSelf: "center" }} />
                                            <TextField id="comment_field"
                                                multiline
                                                fullWidth
                                                defaultValue={item?.content}
                                                variant="standard"
                                                className={classes.removeUnderline}
                                                InputProps={{
                                                    readOnly: true,
                                                }}

                                            />
                                            <IconButton
                                                aria-label="settings"
                                                id="option-button"
                                                aria-controls="option-menu"
                                                aria-expanded={showReply}
                                                aria-haspopup="true"
                                                onClick={() => setShowReply(index)}
                                                style={{ padding: 5 }}>
                                                <MoreVert />
                                            </IconButton>
                                        </Box>
                                        <Collapse in={showReply == index} timeout="auto" unmountOnExit>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: 4, marginLeft: 30 }}>
                                                <Avatar style={{ width: 30, height: 30, margin: "0px 4px 0px 0px", alignSelf: "center" }} />   {/* sx={{ color: 'action.active', mr: 1, my: 0.5 }} */}
                                                <TextField
                                                    id="comment_field"
                                                    multiline
                                                    placeholder="Express your opinion "
                                                    fullWidth
                                                    variant="standard"
                                                    name="content"
                                                    autoFocus={true}
                                                    value={values.replay?.content}
                                                    onChange={(event) => setValues({ ...values, replay: { [event.target.name]: event.target.value } })}
                                                />
                                                <IconButton
                                                    style={{ width: 30, height: 35, alignSelf: "center" }}
                                                    aria-label="submit comment"
                                                    onClick={() => handleCommentReply(item.id)}
                                                // classes={{ root: classes.iconBorderRadias }}
                                                // type="submit"
                                                >
                                                    <FlightTakeoff />
                                                </IconButton>
                                            </Box>

                                        </Collapse>
                                        {
                                            item?.replys?.map((element, index) =>
                                                <>

                                                    <Box
                                                        // sx={{ paddingX: 1 }}
                                                        className={clsx(classes.commentBox, { [classes.replay]: true })}
                                                        key={element?.id}
                                                    >
                                                        <Avatar style={{ width: 30, height: 30, margin: "0px 4px 0px 0px", alignSelf: "center" }} />
                                                        <TextField id="comment_field"
                                                            multiline
                                                            fullWidth
                                                            // style={{ width: "75%" }}
                                                            defaultValue={element?.content}
                                                            variant="standard"
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            className={classes.removeUnderline}
                                                        />
                                                    </Box>


                                                </>

                                            )
                                        }

                                    </>
                                )
                            }

                        </Stack>
                        <form method="POST">
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: 4 }}>
                                <Avatar style={{ width: 30, height: 30, margin: "0px 4px 0px 0px", alignSelf: "center" }} />   {/* sx={{ color: 'action.active', mr: 1, my: 0.5 }} */}
                                <TextField
                                    id="comment_field"
                                    multiline
                                    placeholder="Express your opinion "
                                    fullWidth
                                    variant="standard"
                                    name="content"
                                    value={values.comment?.content}
                                    onChange={(event) => setValues({ ...values, comment: { [event.target.name]: event.target.value } })} />
                                <IconButton
                                    style={{ width: 30, height: 35, alignSelf: "center" }}
                                    aria-label="submit comment"
                                    onClick={handleComment}
                                // classes={{ root: classes.iconBorderRadias }}
                                // type="submit"
                                >
                                    <FlightTakeoff />
                                </IconButton>
                            </Box>
                        </form>

                    </CardContent>
                </Collapse>
            </Card>
            <Dialog open={openDialog.bool} onClose={() => setOpenDialog({ bool: false })}>
                <DialogContent
                    sx={{ p: 0, position: "relative" }}
                >
                    {
                        /.*\.mp4/.test(openDialog?.media?.[openDialog?.active]) ?
                            <video src={openDialog?.media?.[openDialog?.active]} controls style={{ height: "100%", width: "100%" }} /> :

                            <img src={openDialog?.media?.[openDialog?.active]} width="100%" />
                    }
                </DialogContent>
                <Box
                // sx={{ p: 0 }}
                >
                    <IconButton aria-label="previous"
                        onClick={handleGalleryPrevious}
                        style={{ position: "absolute", top: "50%", color: "black", left: "0%" }}
                    >
                        <ArrowBackIos />
                    </IconButton >
                    <IconButton aria-label="next"
                        onClick={handleGalleryNext}
                        style={{ position: "absolute", top: "50%", right: "0%", color: "black" }}
                    >
                        <ArrowForwardIos />
                    </IconButton >
                </Box>
            </Dialog>
        </Box >
    )
};

const useStyles = makeStyles((theme) => ({
    displayNone: {
        // display: "none"
        justifyContent: "center",
    },
    iconBorderRadias: {
        borderRadius: "inherit",
        width: '100%',
        '&:hover': {
            backgroundColor: "rgb(237 237 237)",
        }
    },
    removeUnderline: {
        "& .MuiInput-underline:after, & .MuiInput-underline:before": {
            display: "none"
        }
    },
    // comment:{
    //     display: "flex", 
    //     borderRadius: 20, 
    //     paddingX: 1
    // },
    replay: {
        marginLeft: "auto !important",
        width: "90%",
    },
    commentBox: {
        display: "flex",
        borderRadius: 20,
        // paddingX: 1,
        padding: "0px 8px 0px 8px",
        backgroundColor: "#ebebeb"
    }
}))

export default Post;