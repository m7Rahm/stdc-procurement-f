import React, { useCallback, useState, useRef, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsUpload } from 'react-icons/bs'

import NewOfferTableBody from './NewOfferTableBody'
import '../../styles/Orders.css'
import useFetch from '../../hooks/useFetch'
import { WebSocketContext } from '../SelectModule'
import '../../styles/styles.scss'

function OfferModal(props) {
    const [choices, setChoices] = useState([])

    const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
    const actPageRef = useRef(null);
    const fetchPost = useFetch("POST");
    const davamText = whichPage.page === 2 ? "Yadda saxla" : "Davam";
    const [operationResult, setOperationResult] = useState({ visible: false, desc: 'Sifarişə məhsul əlavə edin' })
    const webSocket = useContext(WebSocketContext)
    // console.log(props.choices)

    const backClickHandler = (e) => {
        actPageRef.current.style.animationName = "slide_geri_current";
        // props.modalWrapperRef.current.style.overflow = "hidden";
        const animationendEventListener = () => {
            actPageRef.current.removeEventListener(
                "animationend",
                animationendEventListener,
                false
            );
            setWhichPage((prevState) => {
                actPageRef.current.style.animationName = "slide_geri_next"
                // props.modalWrapperRef.current.style.width = prevState.page === 3 ? "90%" : "40rem";
                return prevState.page > 1 ? {
                    page: prevState.page - 1,
                } : prevState;
            });
        };
        actPageRef.current.addEventListener(
            "animationend",
            animationendEventListener,
            false
        );
    };
    const forwardClickHandler = () => {
        if (davamText === "Davam") {
            const continueNext = () => {
                actPageRef.current.style.animationName = "slide_davam_current";
                // props.modalWrapperRef.current.style.overflow = "hidden";
                const animationendEventListener = () => {
                    if (actPageRef.current.style.animationName === "slide_davam_next") {
                        // props.modalWrapperRef.current.style.overflow = "visible";
                        actPageRef.current.removeEventListener(
                            "animationend",
                            animationendEventListener,
                            false
                        );
                    }
                    setWhichPage(prevState => {
                        if (prevState.page == 1) {
                            actPageRef.current.style.animationName = "slide_davam_next"
                            // props.modalWrapperRef.current.style.width = prevState.page === 1 ? "90%" : "40rem";
                            return {
                                page: prevState.page + 1,
                            }
                        } else return prevState
                    });
                }
                actPageRef.current.addEventListener(
                    "animationend",
                    animationendEventListener,
                    false
                );
            }
            if (whichPage.page === 2) {
                let errorMessage = "";
                let details = ""
                if (errorMessage !== "")
                    setOperationResult({ visible: true, desc: errorMessage, details: details })
                else continueNext()
            } else continueNext()
        } else {
            // saveClickHandler();
        }
    };


    return (
        <div>
            <div className="new-ord-nav-container" >
                <div
                    name="back"
                    className="btn btn-primary btn-modal bg-red py-4 mt-8 direction"
                    style={{ display: whichPage.page === 1 ? "none" : "block", }}
                    onClick={backClickHandler}
                >
                    Geri
                </div>
                <div
                    className="btn btn-primary btn-modal bg-green py-4 mt-8 direction"
                    type="button"
                    name="forward"
                    onClick={forwardClickHandler}
                >
                    {davamText}
                </div>
            </div>

            <div
                className="page-container"
                ref={actPageRef}
            >
                {whichPage.page === 1 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '40px', marginTop: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input placeholder={'Şirkət'} className="modalInput" name="company" value={props.offerInfo.company} onChange={props.handleInfoChange}></input>
                            <input placeholder={'VÖEN'} className="modalInput" name='voen' value={props.offerInfo.voen} onChange={props.handleInfoChange}></input>
                        </div>
                        {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input placeholder={'Rahman1'} className="modalInput" ></input>
                            <input placeholder={'Rahman2'} className="modalInput" ></input>
                        </div> */}
                    </div>
                ) : whichPage.page === 2 ? (
                    <div style={{ marginTop: '40px' }}>
                        <NewOfferTableBody
                            orderInfo={{ orderType: props.orderContent[0].orderType, structure: "" }}
                            choices={choices}
                            setChoices={setChoices}
                        />
                        <MyDropzone />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            {/* <div className="priceTags saveButton" onClick={props.saveClickHandler}>Yadda saxla</div> */}
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