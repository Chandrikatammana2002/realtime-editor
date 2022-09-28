import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  //  It helps to go to the specific URL, forward or backward pages.
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
function EditorPage(){
  //Intialization of socket is done here
  const socketRef=useRef(null);
  const location=useLocation();
  const codeRef = useRef(null);
  //whenever page is re-render the use effect is called
  const reactNavigator=useNavigate();
  const { roomId } = useParams(); //because in app we created roomid as dynamic it is param
  //console.log(roomId)
  const [clients, setClients] = useState([]);
  useEffect(()=>{
       const init=async()=>{
           /* The keyword await makes JavaScript wait until 
          that promise settles and returns its result. */
          socketRef.current = await initSocket(); //clien conncet to server
          // We have to send error message to client if there is problem in connection
         socketRef.current.on("connect_error", (err) => handleErrors(err));
         socketRef.current.on("connect_failed", (err) => handleErrors(err));
         function handleErrors(e) {
            console.log("socket error", e);
            toast.error("Socket connection failed, try again later.");
              // if we get error we redirect to home page
            reactNavigator("/");
          }
  
          socketRef.current.emit(ACTIONS.JOIN,{    //when join event trigered
              roomId,                               //emmiting the events
              username: location.state?.username,     //while emmiting sending data to server ie join me .emits to server that it want to join 
                                                     
          });
          //listening for joined event
          socketRef.current.on(
              ACTIONS.JOINED,   //destructing
              ({ clients, username, socketId }) => {
                // This toast is for other users who joined after me
                if (username !== location.state?.username) {
                  toast.success(`${username} joined the room.`);
                  console.log(`${username} joined`);
                }
                setClients(clients); //dynamically getten client ko storing on clients array to get avatar
                socketRef.current.emit(ACTIONS.SYNC_CODE, {                        //before the new user entered to room the code must be seen to new user
                  code: codeRef.current, 
                  socketId,
                });
              }
          );
           //listening for disconnected                 destructuring
           socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
              toast.success(`${username} left the room.`);
              // This is acutally doing that it is removing sockedId of user who is leaving room from the previous list
              setClients((prev) => {
                return prev.filter((client) => client.socketId !== socketId);
              });
            });

           
       }
       init();
       
  },[]);
  
  async function copyRoomId() {
     
      try {
        await navigator.clipboard.writeText(roomId);
        
        console.log({roomId})
        toast.success("Room ID has been copied to your clipboard",roomId);
      } catch (err) {
        toast.error("Could not copy the Room ID");
        console.error(err);
      }
  }
  
    function leaveRoom() {
      reactNavigator("/");
    }
 
  // if we didnt get any state then navigate to home
  if (!location.state) {
      return <Navigate to="/" />;
  }

  return (
      <div className="mainWrap">
          <div className="aside">
              <div className="asideInner">
                  <div className="logo">
                      <img
                          className="logoImage"
                          src="/mylogo.png"
                          alt="logo"
                      />
                  </div>
                  <h3>Connected</h3>
                  <div className="clientsList">
                      {clients.map((client) => (
                          <Client
                              key={client.socketId}
                              username={client.username}
                          />
                      ))}
                  </div>
                  
              </div>
              <button className="btn copyBtn" onClick={copyRoomId} >
                  Copy ROOM ID
              </button>
              <button className="btn leaveBtn" onClick={leaveRoom} >
                  Leave
              </button>
          </div>
          <div className="editorWrap">
              <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code;}}/>
          </div>
          
      </div>
  );
};


export default EditorPage;