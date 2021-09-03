import React, { useRef, useState } from "react"
import table from "../../styles/Table.module.css"
import { FaPlus } from "react-icons/fa";
import InputSearchList from "../../components/Misc/InputSearchList";

const PriceResearchMetarialsRow = (props) => {
    const [vendors, setVendors] = useState(props.vendorList);
    const po = props.po;
    const parentRef = useRef(null);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        const charArray = value.split("");
        const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
        const regExp = new RegExp(`${reg}`, "gi");
        const searchResult = props.vendorList.filter(vendor => regExp.test(vendor.name));
        setVendors(searchResult);
    }

    const setVendor = (_, vendor, inputRef) => {
        inputRef.current.value = vendor.name;
        // vendorListRef.current.style.display = "none";
    }
    return (
        <div>
            <div ref={parentRef} className={table["price-research-material-cell"]} style={{ zIndex: 1 }}>
                <InputSearchList
                    placeholder="Vendor"
                    text="name"
                    name="vendor"
                    listid={`vendorListRef${po.id}`}
                    handleInputChange={handleVendorSearch}
                    defaultValue={po.title}
                    parentRef={parentRef}
                    items={vendors}
                    inputStyle={{ border: "none" }}
                    handleItemClick={setVendor}
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