import React, { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsUpload } from 'react-icons/bs'

import NewOfferTableBody from './NewOfferTableBody'
import '../../styles/Orders.css'

function OfferModal(props) {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom:'20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <input placeholder={'Şirkət'} className="modalInput"></input>
                    <input placeholder={'VÖEN'} className="modalInput"></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <input placeholder={'Rahman1'} className="modalInput" ></input>
                    <input placeholder={'Rahman2'} className="modalInput" ></input>
                </div>
            </div>
            <NewOfferTableBody
                orderInfo={{ orderType: 0, structure: "" }}
                choices={props.choices}
                setChoices={props.setChoices}
            />
            <div className="priceTags saveButton">Yadda saxla</div>
            <MyDropzone />
        </div>
    )
}

export default OfferModal


const MyDropzone = () => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const filesNames = useRef(<p></p>)

    // const onDrop = useCallback(acceptedFiles => {
    //     // Do something with the files
    //     const req = request.post('/upload')
    //     acceptedFiles.forEach(file => {
    //       req.attach(file.name, file)
    //     })
    //     req.end(callback)    
    // }, [])

    const onDrop = useCallback(acceptedFiles => {
        console.log(filesNames)
        filesNames.current = acceptedFiles.map((file, index) => (
            <li key={index}>
                <p>{file.name}</p>
            </li>
        ))
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <div
                        className={hovered ? 'fileUpload fileDrop' : 'fileUpload'}
                        onMouseEnter={toggleHover}
                        onMouseLeave={toggleHover}>
                        <BsUpload size='60' />
                        <p>Drop the files here ...</p>
                    </div> :
                    <div className="fileUpload">
                        <BsUpload size='60' />
                        <p >Drag 'n' drop some files here, or click to select files</p>
                        <ul>
                            {filesNames.current}
                        </ul>
                    </div>
            }
        </div>
    )
}