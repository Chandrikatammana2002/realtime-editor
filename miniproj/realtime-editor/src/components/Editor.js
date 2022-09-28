import React, { useEffect,useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';//editor ka css hi
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../Actions";

function Editor({socketRef,roomId,onCodeChange}){
        const editorRef = useRef(null);
        //intializing code editor using useeffect
        //whenever we load the website we need this action
        //to be performed
        //Converting textarea to codemirror
        
        useEffect(()=>{

            async function init(){
              editorRef.current =  Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,

                }
              );
              // event of code mirror
              //the data that we write on codeeditor will be saved to changes
              editorRef.current.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();    //get data of code editor
                onCodeChange(code);
                if (origin !== "setValue") {
                  socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                  });
                }
              });
                 
            }
            init()

        },[]);
        //synchronisation logic
        useEffect(() => {
          if (socketRef.current) { //if not null
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
              if (code !== null) {
                editorRef.current.setValue(code); //the editors belong to same room id are setted with code 
              }
            });
          }
          return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE)
          }
        }, [socketRef.current]);
        return(
        <textarea id="realtimeEditor"></textarea>
       )
}



export default Editor;