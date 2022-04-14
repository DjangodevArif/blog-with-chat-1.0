import React, { createRef, useContext, useState } from "react";
import { Badge, Box, Button, CircularProgress, Divider, FilledInput, Input, TextField } from "@material-ui/core";
import { Attachment, FlightTakeoff, Close } from "@mui/icons-material";
import { Avatar, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../utils/firebase";
import Context from "../utils/context";

// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);


const CreatePost = () => {

    const [value, setValue] = useState({ content: '', }); // images: [], videos: [] 
    const [files, setFiles] = useState([]);
    const fileRef = createRef();
    const [data, setData] = useContext(Context);
    const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;


    // firebase staff
    const storage = getStorage(app);


    const handleClick = () => {
        fileRef?.current?.click();
    };

    const handleFile = (event) => {

        setFiles([...event.target.files]);

        if (event.target.files.length > 3) {
            alert("Files are more than 3 !");
            setFiles([]);
        } else if (event.target.files.length > 0) {
            for (const item in event.target.files) {
                var filesize = ((event.target.files[item].size / 1024) / 1024).toFixed(4);
                if (filesize > 3) {
                    alert("File size can't be more than 3MB !");
                    setFiles([]);
                }
            };
        };
    };

    const firebaseUpload = () => {
        let videoList = []
        var imageList = []
        let obj = {}
        let lastindex = files?.length - 1
        return new Promise(resolve => {

            files?.map((item, index) => {
                const storageRef = ref(storage, `blog/${item.name}`);
                const uploadTask = uploadBytesResumable(storageRef, item);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                // console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        console.log('>>>>>>> firebase upload ', error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            if (item.type == "video/mp4") {
                                videoList.push(downloadURL)
                                // const temp = value?.images
                                // temp.push(downloadURL)
                                // setValue({ ...value, "videos": [...temp] })
                            } else {
                                imageList.push(downloadURL)
                                // const temp = value?.images
                                // temp.push(downloadURL)
                                // setValue({ ...value, "images": [...temp] })
                            }
                        });
                    }
                );
                if (lastindex == index) {
                    obj['videos'] = videoList
                    obj['images'] = imageList
                    resolve(obj)
                }

            })
        });
    };

    const handleNewPost = async (e) => {
        e.preventDefault();
        const payload = { ...value };
        if (!Object.hasOwn(payload, 'title')) {
            payload['title'] = `${payload.content.slice(0, 10)} ... `
        }

        if (files.length > 0) {
            setData({ ...data, 'loder': true });
            const load = await firebaseUpload();
            payload['media'] = { ...load }
        };

        setTimeout(() => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
            axios.post(`http://${API_URL}/feed/new_feed`, payload)
                .then(response => {
                    console.log('>>>>>> handleNewPost response', response?.data)
                    const tempData = [response?.data, ...data.post]
                    setData({ ...data, ['post']: tempData, 'loder': false })
                    setValue({ content: '' })
                    setFiles([])
                })
                .catch(error => {
                    console.log('>>>>>>>> handleNewPost error', error?.data)
                    setData({ ...data, 'loder': false })
                    alert(error);

                })
        }, 9000 * files.length);

    };

    const Test = () => {
        return (
            <>
                <Box>
                    <Box
                        sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body1" sx={{ alignSelf: "center" }}>
                            {value.file?.length} item selected
                        </Typography>
                        {/* <Button color="secondary" size="small" style={{ alignSelf: "center", color: "black" }} onClick={() => setFiles([])}>
                            UNDO
                        </Button> */}
                        {
                            data?.loder ?
                                <CircularProgress /> :
                                <IconButton style={{ alignSelf: "center" }} onClick={() => setFiles([])}>
                                    <Close />
                                </IconButton>
                        }
                    </Box>
                    {
                        files?.length > 0 &&
                        Object.values(files)?.map((value, index) => {
                            return (
                                <Stack spacing={3} key={index}>
                                    <Stack spacing={1} direction="row">
                                        {

                                            value.type == 'video/mp4' ?

                                                <Avatar variant="square" sx={{ width: 56, height: 56 }} src={'images/video_pause.jpg'} />
                                                :
                                                <Avatar variant="square" sx={{ width: 56, height: 56 }} src={URL.createObjectURL(value)} />
                                        }
                                        {/* <img src={URL.createObjectURL(value)} />  width="auto" height="80px" */}
                                        {/* </Avatar> */}
                                        <Typography variant="body2" sx={{ alignSelf: "center" }}>
                                            {value.name.slice(0, 30)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )

                        })
                    }
                </Box>
            </>
        )

    };

    return (
        <>
            <Box>
                <form autoComplete="off" style={{ display: "flex", backgroundColor: "white", borderRadius: 5, padding: "0 5px 0 5px" }}>
                    <TextField
                        fullWidth
                        id="new_post"
                        name="content"
                        multiline
                        rows={3}
                        placeholder=" Whats in your mind , now !"
                        variant="standard"
                        value={value?.content}
                        onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })}
                    />
                    <Box
                        sx={{ display: "flex" }}>
                        <input type="file" id="imageFile" accept="image/*,video/*" ref={fileRef} multiple
                            style={{ display: 'none' }}
                            name="file"
                            onChange={(e) => handleFile(e)} />
                        <IconButton onClick={handleClick} sx={{ borderRadius: "inherit" }}>
                            <Attachment />
                        </IconButton>
                        <IconButton type='submit' onClick={handleNewPost} sx={{ borderRadius: "inherit" }}>
                            <FlightTakeoff />
                        </IconButton>
                    </Box>
                </form>
                <Snackbar
                    open={files?.length > 0}
                    autoHideDuration={3000}  // depend on onClose 
                    // onClose={}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message={Test()}
                    // classes={{ Paper: { backgroundColor: "rgb(231 231 231)" } }}
                    sx={{ '& .MuiPaper-root': { backgroundColor: "rgb(231 231 231)", color: "black" } }}

                />
            </Box>
        </>
    )
};

export default CreatePost;