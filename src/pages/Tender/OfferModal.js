import React, { useCallback, useState, useRef,useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsUpload } from 'react-icons/bs'

import NewOfferTableBody from './NewOfferTableBody'
import '../../styles/styles.scss'
import useFetch from '../../hooks/useFetch'
import InputSearchList from '../../components/Misc/InputSearchList'

function OfferModal(props) {
    const fetchPost = useFetch("POST");
    const fetchGet = useFetch("GET")

    const modalid = props.modalid;

    const vendorInputRef = useRef(null);
    const vendorListRef = useRef(null);
    const [vendors, setVendors] = useState([]);
    const [vendorList, setVendorList] = useState([])

    const [choices, setChoices] = useState(props.orderContent.map((m, i) => ({
        id: m.id,
        name: m.material_name,
        count: m.amount,
        note: "",
        price: 0,
        total: 0,
        alternative: 0,
        color: 0xd2e * (i + 1) / props.orderContent.length
    })))

    useEffect(() => {
        fetchGet(`/api/vendors`)
            .then(respJ => setVendorList(respJ))
            .catch(ex => console.log(ex))
    }, [fetchGet])

    const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
    const actPageRef = useRef(null);
    const davamText = whichPage.page === 2 ? "Yadda saxla" : "Davam";
    // eslint-disable-next-line
    const [operationResult, setOperationResult] = useState({ visible: false, desc: 'Sifarişə məhsul əlavə edin' })
    const [offerInfo, setOfferInfo] = useState({ company: "", voen: "" })
    const backClickHandler = (e) => {
        actPageRef.current.style.animationName = "slide_geri_current";
        // props.modalWrapperRef.current.style.overflow = "hidden";
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
        props.activeModalRef.current.style.height = "30rem";
        props.activeModalRef.current.style.width = "60rem";
        if (davamText === "Davam") {
            const continueNext = () => {
                actPageRef.current.style.animationName = "slide_davam_current";
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
                        if (prevState.page === 1) {
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
            const data = choices.map((choice, index) => [null, choice.name, index === 0 ? choice.id : null, choice.count, choice.total, choice.alternative, choice.note]);
            // console.log(data)
            fetchPost('/api/update-price-offer', data)
                .then(respJ => {

                }).catch(ex => console.log(ex))
        }
    };

    const handleInfoChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setOfferInfo(prev => ({ ...prev, [name]: value }))
    }

    const handleVendorSearch = (e) => {
        const value = e.target.value;
        const charArray = value.split("");
        const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
        const regExp = new RegExp(`${reg}`, "gi");
        setOfferInfo(prev => ({ ...prev, company: value }))
        const searchResult = vendorList.filter(vendor => regExp.test(vendor.name));
        setVendors(searchResult);
        handleVendorSearch2(value)
    }

    console.log(vendors)
    const setVendor = (_, vendor) => {
        handleVendorSelection(vendor)
        vendorInputRef.current.value = vendor.name;
        vendorListRef.current.style.display = "none";
    }

    const handleVendorSearch2 = useCallback((value) => {
        setOfferInfo(prev => ({
            ...prev, company: value
        }))
    }, [setOfferInfo]);


    const handleVendorSelection = useCallback((vendor) => {
        setOfferInfo(prev => ({
            ...prev, company: vendor.name
        }))
    }, [setOfferInfo]);


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
                    <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '40px', justifyContent: "space-evenly", marginTop: '30px' }}>
                        {/* <input placeholder={'Şirkət'} className="modalInput" name="company" value={offerInfo.company} onChange={handleInfoChange}></input> */}
                        <div style={{ position: 'relative' }}>
                            <InputSearchList
                                placeholder="Vendor"
                                text="company"
                                name="vendor"
                                listid="vendorListRef"
                                inputRef={vendorInputRef}
                                listRef={vendorListRef}
                                handleInputChange={handleVendorSearch}
                                items={vendors}
                                handleItemClick={setVendor}
                                style={{ width: '150px', maxWidth: ' 200px' }}//, outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }}
                            />
                        </div>
                        <input placeholder={'VÖEN'} className="modalInput" name='voen' value={offerInfo.voen} onChange={handleInfoChange}></input>
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
                            initialMaterials={props.orderContent}
                            setChoices={setChoices}
                        />
                        <MyDropzone />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}

export default OfferModal


const MyDropzone = () => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const filesNames = useRef()

    const onDrop = useCallback(acceptedFiles => {
        filesNames.current = acceptedFiles.map((file, index) => (
            <li key={index}>
                <p>{file.name}</p>
            </li>
        ))
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div style={{ padding: "2rem" }} {...getRootProps()}>
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
                        <ul>
                            {filesNames.current}
                        </ul>
                    </div>
            }
        </div>
    )
}