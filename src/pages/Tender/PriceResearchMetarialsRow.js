import React, { useRef, useState } from "react"
import table from "../../styles/Table.module.css"
import { FaPlus } from "react-icons/fa";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";

const PriceResearchMetarialsRow = (props) => {
    const [materials, setMaterials] = useState([]);
    const po = props.po;
    const fetchGet = useFetch("GET");
    const parentRef = useRef(null);
    const timeoutRef = useRef(null);
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
        inputRef.current.value = vendor.name;
        // vendorListRef.current.style.display = "none";
    }
    return (
        <div>
            <div ref={parentRef} className={table["price-research-material-cell"]} style={{ zIndex: 1 }}>
                <InputSearchList
                    placeholder="Məhsulun adı"
                    text="title"
                    name="vendor"
                    listid={`vendorListRef${po.id}`}
                    handleInputChange={handleVendorSearch}
                    defaultValue={po.title}
                    parentRef={parentRef}
                    items={materials}
                    inputStyle={{ border: "none" }}
                    handleItemClick={setMaterial}
                />
                <span style={{ right: "5px", cursor: "pointer" }}>
                    <FaPlus onClick={() => props.addAlternative(po)} color="rgb(255, 174, 0)" />
                </span>
            </div>
            <div className={table["price-research-material-cell"]}>
                <input name="perwout" onChange={e => props.handleChange(e, po.id)} value={po.perwout} />
            </div>
            <div className={table["price-research-material-cell"]}>
                {((po.total / po.count) * 1.18).toFixed(2)}
            </div>
            <div className={table["price-research-material-cell"]}>
                {(po.total * 1.18).toFixed(2)}
            </div>
        </div>
    )
}
export default PriceResearchMetarialsRow