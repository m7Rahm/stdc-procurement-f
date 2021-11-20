import { useEffect, useRef, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import table from "../../../styles/Table.module.css"
const MySelections = (props) => {
    const { order_id, user_id, download = true, user_selections } = props;
    const fetchGet = useFetch("GET")
    const [selections, set_selections] = useState([]);
    const vendors_ref = useRef([]);
    const parent_materials_ref = useRef([]);
    const [parent_materials, set_parent_materials] = useState([]);
    useEffect(() => {
        let mounted = true;
        const abort_controller = new AbortController();
        const format_data = (materials) => {
            const vendors = {};
            const parent_materials = {};
            for (let i = 0; i < materials.length; i++) {
                if (download) {
                    if (!parent_materials[materials[i].parent_offers_material_id]) {
                        parent_materials[materials[i].parent_offers_material_id] = materials[i].parent_material_name;
                    }
                }
                if (!vendors[materials[i].id]) {
                    vendors[materials[i].id] = {
                        id: materials[i].id,
                        name: materials[i].vendor_name,
                        parent_material_id: [materials[i].parent_offers_material_id],
                        materials: [
                            {
                                id: materials[i].material_id,
                                parent_id: materials[i].parent_offers_material_id,
                                name: materials[i].material_name,
                                price: materials[i].price,
                                amount: materials[i].amount
                            }
                        ]
                    }
                } else {
                    vendors[materials[i].id].materials.push({ amount: materials[i].amount, id: materials[i].material_id, name: materials[i].material_name, price: materials[i].price, parent_id: materials[i].parent_offers_material_id })
                    vendors[materials[i].id].parent_material_id.push(materials[i].parent_offers_material_id)
                }
            }
            vendors_ref.current = vendors;
            parent_materials_ref.current = parent_materials;
            set_selections(Object.values(vendors));
            set_parent_materials(Object.keys(parent_materials))
        }
        if (download) {
            const api_str = `/api/price-offer-selections?oid=${order_id} ${user_id ? "&u=" + user_id : ""}`
            fetchGet(api_str, abort_controller)
                .then(respJ => {
                    if (mounted && respJ.length !== 0) {
                        format_data(respJ)
                    }
                })
                .catch(ex => console.log(ex));
        } else {
            format_data(user_selections)
        }
        return () => {
            mounted = false;
            if (download)
                abort_controller.abort()
        }
    }, [order_id, fetchGet, user_id, user_selections, download]);
    return (
        <div style={{ maxWidth: "1024px" }}>
            {
                download ?
                    <SelectionsForUser
                        parent_materials={parent_materials}
                        parent_materials_ref={parent_materials_ref}
                        selections={selections} />
                    : <SelectionsGeneral selections={selections} />
            }

        </div>
    )
}

export default MySelections

const SelectionsForUser = ({ parent_materials, parent_materials_ref, selections }) => {
    return (
        <div className={table["user-selected-materials"]}>{
            parent_materials.map(parent_material_id => {
                const parent_id = Number(parent_material_id)
                return (
                    <div key={parent_material_id} style={{ display: "inherit", flexDirection: "row", flex: 1}}>
                        <div style={{ width: "200px", borderRight: "1px solid gainsboro", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {parent_materials_ref.current[parent_material_id]}
                        </div>
                        <div style={{ display: "inherit", flexDirection: "column", flex: 1 }}>
                            {
                                selections
                                    .filter(vendor => vendor.parent_material_id.includes(parent_id))
                                    .map(vendor =>
                                        <div key={vendor.id} style={{
                                            display: "inherit",
                                            flexDirection: "row",
                                            flex: 1,
                                            borderCollapse: "collapse"
                                        }}>
                                            <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid gainsboro" }}>
                                                {vendor.name}
                                            </div>
                                            <div style={{ display: "inherit", flexDirection: "column", flex: 1 }}>
                                                {
                                                    vendor.materials.filter(material => material.parent_id === parent_id)
                                                        .map(material =>
                                                            <div className={table["confirmed-materials-row"]} key={material.id}>
                                                                <div>
                                                                    <div>
                                                                        {material.name}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div>
                                                                        {material.note}
                                                                    </div>
                                                                </div>
                                                                <div >
                                                                    <div>
                                                                        {material.price}
                                                                    </div>
                                                                </div>
                                                                <div >
                                                                    <div>
                                                                        {material.price * material.amount}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    )

                            }
                        </div>
                    </div>
                )
            }
            )
        }
        </div>
    )
}
const SelectionsGeneral = ({ selections }) => {
    return (
        <div style={{ boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.3)", color: "#123456" }} className={table["user-selected-materials"]}>
            {
                selections
                    .map(vendor =>
                        <div key={vendor.id} style={{
                            display: "inherit",
                            flexDirection: "row",
                            flex: 1,
                            borderCollapse: "collapse",
                            minWidth: "600px"
                        }}>
                            <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid gainsboro" }}>
                                {vendor.name}
                            </div>
                            <div style={{ display: "inherit", flexDirection: "column", flex: 1 }}>
                                {
                                    vendor.materials
                                        .map(material =>
                                            <div className={table["confirmed-materials-row"]} key={material.id}>
                                                <div>
                                                    <div>
                                                        {material.name}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        {/* {material.comment} */}
                                                        dasdasfasf
                                                    </div>
                                                </div>
                                                <div >
                                                    <div>
                                                        {material.price}
                                                    </div>
                                                </div>
                                                <div >
                                                    <div>
                                                        {material.price * material.amount}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    )
            }
        </div>
    )
}