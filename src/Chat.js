import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import { Mic } from '@material-ui/icons';
import { InsertEmoticon } from '@material-ui/icons';
import './Chat.css';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase/compat/app';
import { useStateValue } from "./StateProvider";

const Chat = () => {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();

    const getTime = (time) => {
        const now = new Date(time.toLocaleString('en-US', { 'timeZone': 'Asia/Kolkata' }))
        let hour = now.getHours()
        let mins = now.getMinutes()
        let period = 0
        if (hour <= 12) {
            period = "am"
        }
        else {
            period = "pm"
        }
        if (mins < 10) {
            mins = "0" + mins
        }
        if (hour === 0) {
            hour = hour + 12
        }
        return `${hour}: ${mins} ${period}`
    }

    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setInput("");
    }

    return (
        <div className='chat'>
            <div className='chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className='chat_headerInfo'>
                    <h3 className='chat-room-name'>{roomName}</h3>
                    <p className='chat-room-last-seen'>
                        Last activity at {" "}
                        {new Date(
                            messages[messages.length - 1]?.
                                timestamp?.toDate()
                        ).toLocaleString('en-US', { 'timeZone': 'Asia/Kolkata' })}
                    </p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>

                </div>
            </div>
            <div className='chat_body'>
                {messages.map(message => (
                    <p className={`chat_message ${message.name == user.displayName && 'chat_receiver'}`}>
                        <span className="chat_name">{message.name}</span>
                        {message.message}
                        <span className="chat_timestemp">{getTime(`${message.timestamp?.toDate()}`)}</span>
                    </p>
                ))}
            </div>
            <div className='chat_footer'>
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
                    <button type="submit" onClick={sendMessage}> Send a Message</button>
                </form>
                <IconButton>
                    <Mic />
                </IconButton>
            </div>

        </div>
    )
}

export default Chat
