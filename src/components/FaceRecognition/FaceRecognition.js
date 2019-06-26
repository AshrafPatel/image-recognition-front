import React from "react"
import "./FaceRecognition.css"

const FaceRecognition = ({boundingBox, imageURL}) => {
    const faceArray = boundingBox.map((face, index) => {
        return <div className = "bounding-box" style={{top: face.top_row, bottom: face.bottom_row, left: face.left_col, right: face.right_col}} key={index}></div>
    })

    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id="inputImage" alt="query img" src={imageURL} width="500px" height="auto"/>
                {faceArray}
            </div>
        </div>
    )
}

export default FaceRecognition;