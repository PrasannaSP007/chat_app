import React, { useMemo, useState } from 'react';
import './App.css';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, userName, room}) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    
    const sendMessage = async () => {
        if(currentMessage!=="") {
            const msgData = {
                room : room,
                author : userName,
                message : currentMessage,
                time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_msg", msgData);
            setMessageList((list) => [...list, msgData]);
            setCurrentMessage("");
        }
    }; 

    useMemo(() => {
        socket.on("receive_msg", (data) => {
            // console.log(data);
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return(
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                { messageList.map((messageContent) => {
                    return (
                        <div className='message' id={userName === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{ messageContent.message }</p>
                                </div>
                                <div className='message-meta'>
                                    <p id="time">{ messageContent.time }</p>
                                    <p id="author">{ messageContent.author }</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input type="text" value={currentMessage} placeholder='Message' onChange={(e) => { setCurrentMessage(e.target.value); }} 
                    onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}/>
                <button onClick={ sendMessage }>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat