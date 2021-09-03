import React, { useEffect, useRef, useState } from "react"
import { FaCheck, FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { v4 } from "uuid";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";
import table from "../../styles/Table.module.css"
import PriceResearchMetarialsRow from "./PriceResearchMetarialsRow";
const PriceResearch = () => {
    const visa = useLocation().state?.visa;
    const id = useLocation().state?.id;
    const visaMaterials = useRef(visa ? visa : []);
    const [priceOffers, setPriceOffers] = useState({ all: [], unique: [] });
    const fetchGet = useFetch("GET");
    const [vendorList, setVendorList] = useState([])
    useEffect(() => {
        fetchGet(`/api/vendors`)
            .then(respJ => setVendorList(respJ))
            .catch(ex => console.log(ex))
    }, [fetchGet])
    useEffect(() => {
        fetchGet(`/api/price-offers?orderid=${id}&all=1`)
            .then(resp => {
                const vendors = [];
                resp.forEach(row => {
                    if (!vendors.find(vendor => vendor.user_id === row.user_id && vendor.vendor_id === row.vendor_id)) {
                        vendors.push({ vendor_id: row.vendor_id, user_id: row.user_id, poid: row.po_id, vendorName: row.vendor_name });
                    }
                })
                setPriceOffers({ all: resp.map(row => ({ ...row, perwout: row.total / row.count })), unique: vendors });
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet]);
    const handleChange = (e, id) => {
        const name = e.target.name;
        const value = e.target.value;
        const allowed = /\d+(\.\d{0,2})?/.test(value);
        if (allowed)
            setPriceOffers(prev => ({ ...prev, all: prev.all.map(row => row.id === id ? ({ ...row, [name]: value, total: value * row.count }) : row) }))
    }
    const addAlternative = (po) => {
        setPriceOffers(prev => ({
            ...prev, all: [...prev.all, {
                ...po,
                id: v4(),
                perwout: 0,
                total: 0,
                title: "",
                material_id: ""
            }]
        }))
    }
    return (
        <div style={{ paddingTop: "70px", display: "flex" }}>
            <div>
                <div className={table["price-research-header"]}>
                    <div style={{ fontWeight: "600" }}>
                        <div className={table["price-research-material-cell"]}>Şirkət adı</div>
                        <div className={table["price-research-material-cell"]}>Şirkətin növü (yerli/Xarici)</div>
                        <div className={table["price-research-material-cell"]}>Vergi ödəyici tipi(ƏDV/Sadələşdirilmiş)</div>
                        <div className={table["price-research-material-cell"]}>Çatdırılma şərtləri</div>
                        <div className={table["price-research-material-cell"]}>Çatdırılma müddəti</div>
                        <div className={table["price-research-material-cell"]}>Gözlənilən Daşınma və Gömrük Xərcləri</div>
                        <div style={{ height: "80px", fontWeight: "600" }}>
                            <div className={table["price-research-material-cell"]} style={{ width: "200px", float: "left", padding: "0.5rem", height: "100%" }}>Malın adı</div>
                            <div className={table["price-research-material-cell"]} style={{ width: "50px", height: "100%", float: "left", padding: "0.5rem 0px", justifyContent: "center" }}>Miqdar</div>
                            <div className={table["price-research-material-cell"]} style={{ width: "50px", height: "100%", float: "left", padding: "0.5rem 0px", justifyContent: "center" }}>Say</div>
                        </div>
                    </div>
                    {
                        priceOffers.unique.map(po =>
                            <PriceOffer
                                vendorName={po.vendorName}
                                key={po.poid}
                                id={po.poid}
                                vendorList={vendorList}
                            />
                        )
                    }
                </div>
                {
                    visaMaterials.current.map(material =>
                        <div key={material.order_material_id} className={table["price-research-material-row"]}>
                            <div style={{ flex: "0 0 300px" }}>
                                <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 200px" }}>{material.title}</div>
                                <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 50px" }}>{material.amount}</div>
                                <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 50px" }}>{material.amount}</div>
                            </div>
                            {
                                priceOffers.unique.map(po =>
                                    <PriceOfferMaterials
                                        key={po.poid}
                                        priceOffers={priceOffers}
                                        venid={po.vendor_id}
                                        handleChange={handleChange}
                                        poid={po.poid}
                                        count={material.amount}
                                        vendorList={vendorList}
                                        addAlternative={addAlternative}
                                        parentMaterialid={material.order_material_id}
                                    />
                                )
                            }
                        </div>
                    )
                }
                <div className={table["price-research-material-row"]}>
                    <div className={table["price-research-material-footer"]} style={{ flex: "0 0 300px" }}>
                        <div className={table["price-research-material-cell"]} >Cəm</div>
                        <div className={table["price-research-material-cell"]}>Təsdiq olunan təklif</div>
                        <div className={table["price-research-material-cell"]}>Texniki rəy</div>
                        <div style={{ height: "30px" }} className={table["price-research-material-cell"]}>Şöbə, vəzifə, Ad və soyad, imza</div>
                    </div>
                    {
                        priceOffers.unique.map(po =>
                            <PriceOfferMaterialsFooter
                                key={po.poid}
                                priceOffers={priceOffers}
                                venid={po.vendor_id}
                                footer={true}
                                poid={po.poid}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const PriceOffer = (props) => {
    const [vendors, setVendors] = useState(props.vendorList);
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
            <div className={table["price-research-material-cell"]}>
                <InputSearchList
                    placeholder="Vendor"
                    text="name"
                    name="vendor"
                    listid={`vendorListRef${props.id}`}
                    handleInputChange={handleVendorSearch}
                    defaultValue={props.vendorName}
                    items={vendors}
                    inputStyle={{ border: "none" }}
                    handleItemClick={setVendor}
                />
            </div>
            <div className={table["price-research-material-cell"]}>
                <select>
                    <option>Yerli</option>
                    <option>Xarici</option>
                </select>
            </div>
            <div className={table["price-research-material-cell"]}>
                <select>
                    <option>ƏDV</option>
                    <option>Sadələşdirilmiş</option>
                </select>
            </div>
            <div className={table["price-research-material-cell"]}><input /></div>
            <div className={table["price-research-material-cell"]}><input /></div>
            <div className={table["price-research-material-cell"]}><input /></div>
            <div className={table["price-research-materials-header"]}>
                <div className={table["price-research-material-cell"]}>Təklif olunan</div>
                <div className={table["price-research-material-cell"]}>1 ədədin qiyməti</div>
                <div className={table["price-research-material-cell"]}>1 ədəd ƏDV daxil qiymət</div>
                <div className={table["price-research-material-cell"]}>18% ƏDV daxil toplam qiyməti</div>
            </div>
        </div>
    )
}
const PriceOfferMaterials = (props) => {
    const offeredMaterials = props.priceOffers.all.filter(po => po.po_id === props.poid && po.parent_offers_material_id === props.parentMaterialid)
    return (
        <div className={table["price-research-materials"]} >{
            offeredMaterials.length === 0 ?
                <div>
                    <div className={table["price-research-material-cell"]}>
                        <span style={{ right: "5px", cursor: "pointer" }}>
                            <FaPlus onClick={() => props.addAlternative({ parent_offers_material_id: props.parentMaterialid, po_id: props.poid, count: props.count })} color="rgb(255, 174, 0)" />
                        </span>
                    </div>
                    <div className={table["price-research-material-cell"]}></div>
                    <div className={table["price-research-material-cell"]}></div>
                    <div className={table["price-research-material-cell"]}></div>
                </div>
                : offeredMaterials.map(po =>
                    <PriceResearchMetarialsRow
                        key={po.id}
                        vendorList={props.vendorList}
                        po={po}
                        handleChange={props.handleChange}
                    />
                )
        }
        </div>
    )
}
const PriceOfferMaterialsFooter = (props) => {
    return (
        <div className={table["price-research-material-footer"]}>
            <div className={table["price-research-material-cell"]}>
                <div style={{ flex: 1, textAlign: "right", fontWeight: "600" }}>
                    {(props.priceOffers.all.filter(row => row.po_id === props.poid).reduce((sum, curr) => sum += curr.total, 0) * 1.18).toFixed(2)}
                </div>
            </div>
            <div className={table["price-research-material-cell"]}>
                <FaCheck color="var(--primary-color-accept)" />
            </div>
            <div className={table["price-research-material-cell"]}></div>
        </div>
    )
}
export default PriceResearch
