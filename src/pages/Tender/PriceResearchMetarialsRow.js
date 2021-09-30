import React, { useRef, useState } from "react"
import table from "../../styles/Table.module.css"
import { FaCheck, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";

const PriceResearchMetarialsRow = (props) => {
    const [materials, setMaterials] = useState([]);
    const po = props.po;
    const fetchGet = useFetch("GET");
    const parentRef = useRef(null);
    const timeoutRef = useRef(null);
    const span_ref = useRef(null);
    const row_ref = useRef(null);
    const can_select = props.tokenContext.userData.previliges.includes("Qiymət təklifi seçmək")
    const handleVendorSearch = (e) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        const value = e.target.value;
        timeoutRef.current = setTimeout(() => {
            let valueWithoutE = value.replace(/e/gi, '[eə]')
                .replace(/ch?/gi, '[cç]')
                .replace(/o/gi, '[oö]')
                .replace(/i/gi, '[iı]')
                .replace(/gh?/gi, '[gğ]')
                .replace(/sh?/gi, '[sş]')
                .replace(/u/gi, '[uü]');
            fetchGet(`/api/material-by-title?title=${encodeURIComponent(valueWithoutE)}&orderType=${props.orderType}`)
                .then(respJ => {
                    setMaterials(respJ)
                })
                .catch(ex => console.log(ex))
        }, 350);

    }
    const setMaterial = (_, vendor, inputRef) => {
        inputRef.current.value = vendor.title;
        props.setPriceOffers(prev => prev.map(row => row.id === po.id ? ({ ...po, material_id: vendor.id, material_name: vendor.title }) : row))
        // vendorListRef.current.style.display = "none";
    }
    const handleBlur = (inputRef) => {
        const value = inputRef.current.value;
        fetchGet(`/api/material-by-title?exact=1&title=${encodeURIComponent(value)}&orderType=${props.orderType}`)
            .then(respJ => props.setPriceOffers(prev => prev.map(row => row.id === po.id ? ({ ...po, material_name: value, material_id: respJ[0]?.id }) : row)))
            .catch(ex => console.log(ex))
    }
    const handle_hover = () => {
        span_ref.current.style.right = "5px"
    }
    const handle_mouse_leave = () => {
        span_ref.current.style.right = "-15px"
    }
    const handle_check_click = () => {
        props.setPriceOffers(prev => prev.map(row => row.id === po.id ? ({ ...po, result: 1 }) : row))
        row_ref.current.style.backgroundColor = "#80ED99";
    }
    const handle_cancel_click = () => {
        props.setPriceOffers(prev => prev.map(row => row.id === po.id ? ({ ...po, result: 0 }) : row))
        row_ref.current.style.backgroundColor = "transparent";
    }
    return (
        <div ref={row_ref}>
            <div ref={parentRef} className={table["price-research-material-cell"]} style={{ zIndex: 1 }}>
                {
                    !props.disabled &&
                    <span className={table["add-icon"]} style={{ left: "3px" }}>
                        <FaPlus onClick={() => props.addAlternative(po)} color="rgb(255, 174, 0)" />
                    </span>
                }
                <div className={table["price-research-mat-container"]}>
                    <InputSearchList
                        placeholder="Məhsulun adı"
                        text="title"
                        name="vendor"
                        listid={`vendorListRef${po.id}`}
                        handleInputChange={handleVendorSearch}
                        defaultValue={po.title}
                        parentRef={parentRef}
                        items={materials}
                        onBlur={handleBlur}
                        style={{ top: "24px", width: "inherit" }}
                        disabled={props.disabled}
                        inputStyle={{ border: "none", width: "100%", paddingLeft: "12px" }}
                        handleItemClick={setMaterial}
                    />
                </div>
                {
                    !props.disabled &&
                    <span className={table["add-icon"]} style={{ right: "3px" }}>
                        <FaMinus onClick={() => props.removeAlternative(po)} color="rgb(217, 52, 4)" />
                    </span>
                }
            </div>
            <div className={table["price-research-material-cell"]}>
                <input disabled={props.disabled} name="price" onChange={e => {
                    if (!props.disabled)
                        props.handleChange(e, po.id)
                }} value={po.price} />
            </div>
            <div className={table["price-research-material-cell"]}>
                {(po.price * 1.18).toFixed(2)}
            </div>
            <div onMouseLeave={!can_select ? handle_mouse_leave : null} onMouseEnter={!can_select ? handle_hover : null} className={table["price-research-material-cell"]}>
                {po.total}
                {
                    !can_select &&
                    <span ref={span_ref} style={{ transition: "all 200ms", cursor: "pointer", position: "absolute", zIndex: 1, right: "-15px" }}>
                        {
                            po.result === 0 ?
                                <FaCheck onClick={handle_check_click} title="seç" color="green" />
                                : <FaTimes onClick={handle_cancel_click} title="imtina et" color="red" />
                        }
                    </span>
                }
            </div>
        </div>
    )
}
export default PriceResearchMetarialsRow