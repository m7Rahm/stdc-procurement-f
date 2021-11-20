import React, { useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch"
import table from "../../styles/Table.module.css"
const PriceOfferActions = (props) => {
    const fetchPost = useFetch("POST");
    const selected_materials = props.selected_materials
    const [selections, set_selections] = useState([])
    useEffect(() => {
        if (selected_materials) {
            const vendors = []
            selected_materials.forEach(element => {
                const vendor_index = vendors.findIndex(vendor => vendor.vendor_id === element.vendor_id)
                if (vendor_index === -1) {
                    vendors.push({ ...element, materials: [element] })
                } else {
                    vendors[vendor_index].materials.push(element)
                }
            });
            set_selections(vendors)
        }
    }, [selected_materials])

    const save_selections = () => {
        const selected_materials = selections.flatMap(vendor => vendor.materials.filter(material => material.select_type === 0).map(material => [material.id, material.note]));
        const data = {
            order_id: props.doc_id,
            selections: selected_materials,
            select_type: 1
        }
        fetchPost("/api/confirm-selections", data)
            .then(_ => {
                props.handle_done()
            })
            .catch(ex => console.log(ex))
    }
    const handle_change = (material_index, vendor_index, val) => {
        set_selections(prev => {
            const new_state = [...prev];
            const vendor = new_state[vendor_index]
            vendor.materials[material_index].review = val;
            return new_state
        })
    }
    return (
        <div style={{ padding: "10px" }}>
            {
                props.id === "1" && selections.length !== 0 ?
                    <>
                        {
                            selections.map((vendor, index) =>
                                <div className={table["selected-materials-row"]} key={vendor.vendor_id}>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ top: "50%", transform: "translateY(-50%)", position: "absolute", left: "10px" }}>
                                            {vendor.vendor_name}
                                        </span>
                                    </div>
                                    <div>
                                        {
                                            vendor.materials.map((pom, material_index) =>
                                                <div key={pom.id}>
                                                    <div style={{ flex: 1 }}>{pom.title}</div>
                                                    <div>{pom.price}</div>
                                                    <div>{pom.total}</div>
                                                    <div style={{ flex: 0.4 }}>
                                                        <input
                                                            disabled={pom.select_type === 1}
                                                            value={pom.review || ""}
                                                            placeholder="Qeyd.."
                                                            onChange={({ target }) => handle_change(material_index, index, target.value)}
                                                            style={{ width: "100%", border: "none", display: "block", height: "100%", fontSize: "1rem", backgroundColor: "transparent" }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <div style={{ display: "flex", paddingTop: "10px" }}>
                            <div style={{ flex: 1 }}>Cəmi</div>
                            <div style={{ width: "70px", textAlign: "right" }}>
                                {selections.reduce((acc, curr) => acc += Number(curr.total), 0).toFixed(2)}
                            </div>
                        </div>
                    </>
                    : <div style={{ padding: "20px 20px 0px 20px" }}>
                        <textarea style={{ minHeight: "5rem" }} className={table["text-area"]} placeholder="Qeydlərinizi daxil edin.." />
                    </div>
            }
            {
                !(props.id === "1" && selections.length === 0) &&
                <div className="send-order" onClick={save_selections}>Tamamla</div>
            }
        </div>
    )
}

export default PriceOfferActions