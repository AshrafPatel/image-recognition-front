import React from "react"
import "./ImageURLForm.css"

const ImageURLForm = ({onButtonHandler, onInputHandler}) => {
    return (
        <div>
            <p className="f3">{"This smart brain will detect faces in pictures. \nTry it out!"}</p>
            <div className="center">
                <div className="pa4 br3 shadow-5 center form">
                    <input className="f4 pa2 w-70 center" type="text" onChange={onInputHandler}/>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple pointer" onClick={onButtonHandler}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageURLForm