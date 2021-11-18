import React, { useState, useEffect, useRef } from 'react'
// import AgreementVendors from './AgreementVendors'
import EmptyContent from '../../Misc/EmptyContent'
// import { FaCheck, FaTimes } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch'
import PriceOffers from '../../../pages/Tender/PriceOffers'
import table from "../../../styles/Table.module.css"
const AgreementContent = (props) => {
    const tranid = props.another;
    const [order, set_order] = useState(undefined);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        let mounted = true;
        if (tranid && mounted)
            fetchGet(`/api/price-offer-selections/${tranid}`)
                .then(respJ => {
                    const order = respJ[0];
                    if (mounted) {
                        if (order.order_id !== null) {
                            set_order(order.order_id);
                        } else {
                            set_order(-1)
                        }
                    }
                })
                .catch(ex => console.log(ex));
        return () => mounted = false
    }, [tranid, fetchGet]);
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto' }}>
            {
                order !== undefined && order !== -1 ?
                    <>
                        <PriceOffers
                            id={order}
                            referer={0}
                        />
                        <MySelections order_id={order} />
                    </>
                    : order === -1 ?
                        <>
                            Sənəd tapılmadı
                        </>
                        :
                        <EmptyContent />
            }
        </div>
    )
}
export default AgreementContent

const MySelections = (props) => {
    const { order_id } = props;
    const fetchGet = useFetch("GET")
    const [selections, set_selections] = useState([]);
    const vendors_ref = useRef([]);
    const parent_materials_ref = useRef([]);
    const [parent_materials, set_parent_materials] = useState([]);
    useEffect(() => {
        let mounted = true;
        const abort_controller = new AbortController();
        fetchGet(`/api/price-offer-selections?oid=${order_id}`, abort_controller)
            .then(respJ => {
                if (mounted && respJ.length !== 0) {
                    const vendors = {};
                    const parent_materials = {};
                    for (let i = 0; i < respJ.length; i++) {
                        if (!parent_materials[respJ[i].parent_offers_material_id]) {
                            parent_materials[respJ[i].parent_offers_material_id] = respJ[i].parent_material_name;
                        }
                        if (!vendors[respJ[i].id]) {
                            vendors[respJ[i].id] = {
                                id: respJ[i].id,
                                name: respJ[i].vendor_name,
                                parent_material_id: [respJ[i].parent_offers_material_id],
                                materials: [
                                    {
                                        id: respJ[i].material_id,
                                        parent_id: respJ[i].parent_offers_material_id,
                                        name: respJ[i].material_name,
                                        price: respJ[i].price,
                                        amount: respJ[i].amount
                                    }
                                ]
                            }
                        } else {
                            vendors[respJ[i].id].materials.push({ amount: respJ[i].amount, id: respJ[i].material_id, name: respJ[i].material_name, price: respJ[i].price, parent_id: respJ[i].parent_offers_material_id })
                            vendors[respJ[i].id].parent_material_id.push(respJ[i].parent_offers_material_id)
                        }
                    }
                    vendors_ref.current = vendors;
                    parent_materials_ref.current = parent_materials;
                    set_selections(Object.values(vendors));
                    set_parent_materials(Object.keys(parent_materials))
                }
            })
            .catch(ex => console.log(ex));
        return () => {
            mounted = false;
            abort_controller.abort()
        }
    }, [order_id, fetchGet]);
    return (
        <div style={{ maxWidth: "1024px" }}>
            <div className={table["user-selected-materials"]}>{
                parent_materials.map(parent_material_id => {
                    const parent_id = Number(parent_material_id)
                    return (
                        <div key={parent_material_id} style={{ display: "inherit", flexDirection: "row", flex: 1, borderBottom: "1px solid gainsboro" }}>
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
                                                                    <div style={{ flex: "1" }} >
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
        </div>
    )
}