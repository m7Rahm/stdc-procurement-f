import React, { useState, useRef, useEffect, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsUpload } from 'react-icons/bs'
import { AiFillFileText } from 'react-icons/ai'
import table from "../../styles/Table.module.css"
import '../../styles/Tender.css'
import NewOfferTableBody from './NewOfferTableBody'
import '../../styles/styles.scss'
import useFetch from '../../hooks/useFetch'
import InputSearchList from '../../components/Misc/InputSearchList'
import { TokenContext } from '../../App'
import { v4 } from "uuid"
import DeleteDocButton from '../../components/Common/DeleteDocButton'
import { NotificationContext } from '../SelectModule'


function OfferModal(props) {
    const fetchGet = useFetch("GET")
    const [offerInfo, setOfferInfo] = useState({ id: "", name: "", voen: "" })
    const createNewNotification = useContext(NotificationContext)
    const [files, setFiles] = useState([]);
    const vendorInputRef = useRef(null);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [choices, setChoices] = useState(props.fetched ? [] : props.orderContent.map((m, i) => ({
        id: v4(),
        material_id: m.material_id,
        name: m.title,
        count: m.amount,
        note: "",
        price: 0,
        total: 0,
        fetched: false,
        alternative: 0,
        color: 0xd2e * (i + 1) / props.orderContent.length
    })))
    useEffect(() => {
        if (props.fetched)
            fetchGet(`/api/price-offers/${props.modalid}`)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setChoices(respJ.map((m, i) => ({
                            id: m.id,
                            material_id: m.material_id,
                            name: m.title,
                            count: m.count,
                            note: m.note,
                            price: m.total / m.count,
                            fetched: true,
                            total: m.total,
                            alternative: 0,
                            color: 0xd2e * (i + 1) / respJ.length
                        })))
                        setOfferInfo({ name: respJ[0].vendor_name, voen: respJ[0].voen, id: respJ[0].vendor_id })
                        if (respJ[0].files !== "")
                            setFiles(respJ[0].files.split(',').map(f => ({
                                name: f, fetched: true
                            })))
                    }
                })
                .catch(ex => console.log(ex))
    }, [fetchGet, props.modalid, props.fetched])
    const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
    const actPageRef = useRef(null);
    const davamText = whichPage.page === 2 ? "Yadda saxla" : "Davam";
    // eslint-disable-next-line
    const [operationResult, setOperationResult] = useState({ visible: false, desc: 'Sifarişə məhsul əlavə edin' })
    const backClickHandler = (e) => {
        actPageRef.current.style.animationName = "slide_geri_current";
        props.activeModalRef.current.style.height = "20rem";
        props.activeModalRef.current.style.width = "40rem";
        const animationendEventListener = () => {
            actPageRef.current.removeEventListener(
                "animationend",
                animationendEventListener,
                false
            );
            setWhichPage((prevState) => {
                actPageRef.current.style.animationName = "slide_geri_next"
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
                if (vendorInputRef.current.value !== "") {
                    props.activeModalRef.current.style.width = "60rem";
                    props.activeModalRef.current.style.height = "30rem";
                    actPageRef.current.style.animationName = "slide_davam_current";
                    const animationendEventListener = () => {
                        if (actPageRef.current.style.animationName === "slide_davam_next") {
                            actPageRef.current.removeEventListener(
                                "animationend",
                                animationendEventListener,
                                false
                            );
                        }
                        setWhichPage(prevState => {
                            if (prevState.page === 1) {
                                actPageRef.current.style.animationName = "slide_davam_next"
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
            }
            if (whichPage.page === 2) {
                let errorMessage = "";
                let details = ""
                if (errorMessage !== "")
                    setOperationResult({ visible: true, desc: errorMessage, details: details })
                else continueNext()
            } else continueNext()
        } else {
            const data = choices.map(choice => [choice.fetched ? choice.id : null, choice.name, choice.material_id, choice.count, parseFloat(choice.total), choice.alternative, choice.note]);
            const vendorInfo = [[offerInfo.id, offerInfo.name, offerInfo.voen]]
            const formData = new FormData();
            formData.append("mats", JSON.stringify(data));
            formData.append("vendorInfo", JSON.stringify(vendorInfo))
            formData.append("orderType", JSON.stringify(props.orderContent[0].order_type))
            if (props.fetched) {
                formData.append("id", props.modalid)
                formData.append("fileString", files.filter(file =>
                    file.fetched === true
                ).map(f => f.name).join(','))
            }
            else
                formData.append("orderid", props.orderid)
            files?.filter(file => file.fetched !== true).forEach(file => formData.append("files", file))
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData
            };
            if (props.fetched)
                fetch('http://172.16.3.64/api/update-price-offer', requestOptions)
                    .then(response => response.json())
                    .then(_ => createNewNotification("Yadda saxlanıldı", ""))
                    .catch(ex => console.log(ex))
            else
                fetch('http://172.16.3.64/api/create-price-offer', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        createNewNotification("Əlavə edildi", "")
                        props.setModalList(prev => prev.map(m =>
                            m.id === props.modalid ? {
                                ...m,
                                id: data[0].offer_id,
                                name: offerInfo.name,
                                state: 0,
                                fetched: true,
                            }
                                : m
                        ))
                    })
                    .catch(ex => console.log(ex))
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
                {whichPage.page === 1
                    ? <VendorSelection
                        modalContentContainerRef={props.modalContentContainerRef}
                        setOfferInfo={setOfferInfo}
                        activeModalRef={props.activeModalRef}
                        offerInfo={offerInfo}
                        modalid={props.modalid}
                        setModalList={props.setModalList}
                    />
                    : whichPage.page === 2 ? (
                        <div style={{ marginTop: '40px' }}>
                            <NewOfferTableBody
                                orderInfo={{ orderType: props.orderContent[0].orderType, structure: "" }}
                                choices={choices}
                                initialMaterials={props.orderContent}
                                setChoices={setChoices}
                            />
                            <>
                                <MyDropzone
                                    files={files}
                                    setFiles={setFiles} />
                            </>
                        </div>
                    ) : (
                        <div></div>
                    )}
            </div>
        </div>
    )
}

export default OfferModal

const VendorSelection = props => {
    const [vendorList, setVendorList] = useState([])
    const [vendors, setVendors] = useState([]);
    const { setOfferInfo, offerInfo, modalContentContainerRef, modalid } = props
    const vendorListRef = useRef(null);
    const codeRef = useRef(null);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        const containerRef = modalContentContainerRef.current;
        containerRef.style.overflow = "visible"
        fetchGet(`/api/vendors`)
            .then(respJ => {
                setVendorList(respJ)
                setVendors(respJ)
            })
            .catch(ex => console.log(ex))
        return () => {
            containerRef.style.overflow = "auto";
        }
    }, [fetchGet, modalContentContainerRef])

    const handleVendorSearch = (e) => {
        const value = e.target.value;
        const charArray = value.split("");
        const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
        const regExp = new RegExp(`${reg}`, "gi");
        setOfferInfo(prev => ({ ...prev, name: value }))
        const searchResult = vendorList.filter(vendor => regExp.test(vendor.name));
        setVendors(searchResult);
    }

    const setVendor = (_, vendor, inputRef) => {
        // activeModalRef.current.querySelector("#header-bar").innerHTML = vendor.name;
        props.setModalList(prev => prev.map(modal => modal.id === modalid ? ({ ...modal, vendor_name: vendor.name }) : modal))
        setOfferInfo(prev => ({ ...prev, name: vendor.name, voen: vendor.voen, id: vendor.id }))
        inputRef.current.value = vendor.name;
        codeRef.current.value = vendor.voen;
        // vendorListRef.current.style.display = "none";
    }
    const materialRef = useRef(null);
    return (
        <div className="input-ribbon" style={{ display: 'flex', flexDirection: 'row', paddingBottom: '40px', justifyContent: "space-evenly", marginTop: '30px' }}>
            <div ref={materialRef} style={{ position: 'relative' }}>
                <InputSearchList
                    placeholder="Vendor"
                    text="name"
                    name="vendor"
                    parentRef={materialRef}
                    listid="vendorListRef"
                    listRef={vendorListRef}
                    handleInputChange={handleVendorSearch}
                    defaultValue={offerInfo.name}
                    items={vendors}
                    handleItemClick={setVendor}
                // style={{ width: '150px', maxWidth: ' 200px' }}//, outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    type="name"
                    placeholder="VOEN"
                    ref={codeRef}
                    name="vendor"
                    autoComplete="off"
                    defaultValue={offerInfo.voen}
                // onChange={searchByCode}
                />
            </div>
        </div>
    )
}


const MyDropzone = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);
    const setFiles = props.setFiles;
    const onDrop = acceptedFiles => {
        setFiles(prev => [...prev, ...acceptedFiles])
    }
    const deleteDocHandler = e => {

        const target = e.target

        setFiles(prev => prev.filter((file) => file.name !== target.id))
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        <>

            {props.files &&
                <div className={table["files-container"]}>
                    {props.files.map(file =>
                        <div className={"files"} key={file.name}>
                            <DeleteDocButton deleteDocHandler={deleteDocHandler} id={file.name} />
                            <a key={file.name} rel="noreferrer" target="_blank" href={"http://172.16.3.64/original/" + file.name}>


                                <AiFillFileText size={40} />
                            </a>
                        </div>
                    )}
                </div>
            }
            <div style={{ padding: "1rem" }} {...getRootProps()}>
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
                            <BsUpload size='30' />
                            <p>Fayl əlavə etmək üçün buraya klikləyin və ya sürüşdürün</p>
                        </div>
                }
            </div>
        </>
    )
}