import React from "react"
import { IoIosWarning } from "react-icons/io";
import table from "../../styles/Table.module.css"
const PriceOfferActions = (props) => {
    // console.log(props.selected_materials)
    const vendors = []
    if (props.selected_materials) {
        props.selected_materials.forEach(element => {
            const vendor_index = vendors.findIndex(vendor => vendor.vendor_id === element.vendor_id)
            if (vendor_index === -1) {
                vendors.push({ ...element, materials: [element] })
            } else {
                vendors[vendor_index].materials.push(element)
            }
        });
    }

    return (
        <div style={{ padding: "10px" }}>
            {
                props.id === "1" && vendors.length === 0
                    ? <div style={{ fontSize: "20px", textAlign: "center" }}>Seçim etməmisiniz<IoIosWarning size="30" /></div>
                    : vendors.map(vendor =>
                        <div className={table["selected-materials-row"]} key={vendor.vendor_id}>
                            <div style={{ position: "relative" }}>
                                <span style={{ top: "50%", transform: "translateY(-50%)", position: "absolute", left: "10px" }}>
                                    {vendor.vendor_name}
                                </span>
                            </div>
                            <div>
                                {
                                    vendor.materials.map(pom =>
                                        <div key={pom.id}>
                                            <div style={{ flex: 1 }}>{pom.title}</div>
                                            <div>{pom.price}</div>
                                            <div>{pom.total}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
            }
            {
                vendors.length !== 0 &&
                <div style={{ display: "flex", paddingTop: "10px" }}>
                    <div style={{ flex: 1 }}>Cəmi</div>
                    <div style={{ width: "70px", textAlign: "right" }}>
                        {props.selected_materials?.reduce((acc, curr) => acc += Number(curr.total), 0)}
                    </div>
                </div>
            }
            {
                !(props.id === "1" && vendors.length === 0) &&
                <div style={{ padding: "20px 20px 0px 20px" }}>
                    <textarea style={{ minHeight: "5rem" }} className={table["text-area"]} placeholder="Qeydlərinizi daxil edin.." />
                </div>
            }
            <div className="send-order">Tamamla</div>
        </div>
    )
}

export default PriceOfferActions