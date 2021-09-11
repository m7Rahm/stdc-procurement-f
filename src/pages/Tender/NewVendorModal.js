import React, { useRef, useState } from "react"
import table from "../../styles/Table.module.css"
const NewVendorModal = (props) => {
    const [vendor_name, set_vendor_name] = useState("")
    const [voen, set_voen] = useState("")
    const companyTypeRef = useRef(null)
    const taxtPayerTypeRef = useRef(null)
    const handle_blur = (e) => {
        const target = e.target;
        if (target.value === "") {
            target.style.border = "1px solid red"
        }
        else
            target.style.border = ""
    }
    const handle_voen_change = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value) || value === "") {
            set_voen(value)
        }
    }
    const handle_focus = (e) => {
        const target = e.currentTarget;
        const input = target.querySelector("input");
        input.focus()
    }
    const handle_change = (e) => {
        const value = e.target.value;
        set_vendor_name(value)
    }
    return (
        <div className={table["new-vendor-mod-content"]}>
            <div onFocusCapture={handle_focus} tabIndex="0" className={table["input-container"]}>
                <input value={vendor_name} onChange={handle_change} defaultValue={props.vendorName} name="name" onBlur={handle_blur} />
                <span>Vendorun Adı</span>
            </div>
            <div onFocusCapture={handle_focus} tabIndex="1" className={table["input-container"]}>
                <input value={voen} onChange={handle_voen_change} onBlur={handle_blur} name="voen" />
                <span>VÖEN</span>
            </div>
            <div className={table["new-vendor-content-container"]}>
                <div>
                    <div style={{ float: "left" }}>
                        <label > Şirkət Növü</label>
                        <br />
                        <select ref={companyTypeRef}>
                            <option>Yerli</option>
                            <option>Xarici</option>
                        </select>
                    </div>
                    <div style={{ float: "right" }}>
                        <label >Vergi ödəyici tipi</label>
                        <br />
                        <select ref={taxtPayerTypeRef}>
                            <option>ƏDV ödəyicisi</option>
                            <option>Sadələşdirilmiş</option>
                        </select>
                    </div>
                </div>
                <div>
                    Əlavə et
                </div>
            </div>
        </div>
    )
}
export default NewVendorModal