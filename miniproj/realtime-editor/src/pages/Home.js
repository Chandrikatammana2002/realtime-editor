import React,{useState} from "react";
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
function Home(){
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');


    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidv4()
        setRoomId(id);
        toast.success("created a new room");
    }

    const joinRoom=()=>{
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }
        // Redirect
        //mention the url of the page to which we need to navigate to
        //to pass the data from home page to editor page we need to place that data 
        //in sencond paramenter and that must be specified by state
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return(
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src="/mylogo.png" alt="code-sync-logo" />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e)=>setRoomId(e.target.value)} //if we want to enter the room id then
                        value={roomId}  //binding created room id to input
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e)=>setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                        
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                          If you don't have an invite then create &nbsp;
                          <a onClick={createNewRoom} href="www.google.com" className="createNewBtn">new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Build with &#128155; by TinyCoders</h4>
            </footer>
        </div>
    )
}


export default Home;