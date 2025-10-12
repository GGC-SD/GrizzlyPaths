import React, {useState} from "react";
import { app } from "../firebase";
import { getDatabase, ref, set, push } from "firebase/database";

function Write(){
    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [inputValue3, setInputValue3] = useState("");
    let [inputValue4, setInputValue4] = useState("");
    let [inputValue5, setInputValue5] = useState("");
    let [inputValue6, setInputValue6] = useState("");
    let [inputValue7, setInputValue7] = useState("");
    let [inputValue8, setInputValue8] = useState("");
    let [inputValue9, setInputValue9] = useState("");

    const saveData = async () => {
        const db = getDatabase(app);
        const newRefDoc = push(db, "Jobs");
        set(newRefDoc, {
            company_name: inputValue1,
            job_title: inputValue2,
            job_seniority_level: inputValue3,
            job_function: inputValue4,
            job_industries: inputValue5,
            job_description: inputValue6,
            company_industry: inputValue7,
            company_sector: inputValue8,
            job_type: inputValue9
        }).then( () => {
            alert("data has been saved")
        }).catch((error) => {
            alert("error: ", error.message)
        })
    }

    return(
        <div>
            <input type="text" value={inputValue1} 
            onChange={(set => setInputValue1(e.target.value))}/>
            <input type="text" value={inputValue2} 
            onChange={(set => setInputValue2(e.target.value))}/>
            <input type="text" value={inputValue3} 
            onChange={(set => setInputValue3(e.target.value))}/>
            <input type="text" value={inputValue4} 
            onChange={(set => setInputValue4(e.target.value))}/>
            <input type="text" value={inputValue5} 
            onChange={(set => setInputValue5(e.target.value))}/>
            <input type="text" value={inputValue6} 
            onChange={(set => setInputValue6(e.target.value))}/>
            <input type="text" value={inputValue7} 
            onChange={(set => setInputValue7(e.target.value))}/>
            <input type="text" value={inputValue8} 
            onChange={(set => setInputValue8(e.target.value))}/>
            <input type="text" value={inputValue9} 
            onChange={(set => setInputValue9(e.target.value))}/>
            <br />

            <button onClick={saveData}>SAVE DATA</button>
        </div>
    )
}

export default Write