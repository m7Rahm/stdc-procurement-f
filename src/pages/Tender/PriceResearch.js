import React, { useContext, useEffect, useRef, useState } from "react"
import { FaCheck, FaPlus, FaPlusCircle } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { TokenContext } from "../../App";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";
import table from "../../styles/Table.module.css"
import PriceResearchMetarialsRow from "./PriceResearchMetarialsRow";
import { RiDeleteBack2Fill } from "react-icons/ri"
import { IoIosArrowBack } from "react-icons/io";
import NewVendorModal from "./NewVendorModal";
import { MdClose } from "react-icons/md";
const PriceResearch = () => {
    const visa = useLocation().state?.visa;
    const id = useLocation().state?.id;
    const visaMaterials = useRef(visa ? visa : []);
    const [priceOffers, setPriceOffers] = useState([]);
    const [uniquePriceOffers, setUniquePriceOffers] = useState([]);
    const [versions, setVersions] = useState([]);
    const tokenContext = useContext(TokenContext);
    const user_id = tokenContext[0].userData.userInfo.id
    const fetchGet = useFetch("GET");
    const history = useHistory();
    const [showVendorModal, setShowVendorModal] = useState(false)
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
                const versions = {};
                resp.forEach(row => {
                    if (!vendors.find(vendor => vendor.user_id === row.user_id && vendor.vendor_id === row.vendor_id)) {
                        if (!versions[row.user_id]) {
                            const color = (0x9abed1 * row.user_id).toString(16)
                            versions[row.user_id] = {
                                id: row.user_id,
                                count: 1,
                                color: color.length > 6 ? color.substring(0, 6) : color,
                                fullName: row.full_name
                            }
                        }
                        else versions[row.user_id].count += 1
                        vendors.push({
                            vendor_id: row.vendor_id,
                            user_id: row.user_id,
                            poid: row.po_id,
                            vendorName: row.vendor_name,
                            disabled: user_id !== row.user_id,
                            tax_type: row.tax_type,
                            residency: row.residency
                        });
                    }
                })
                setPriceOffers(resp.map(row => ({ ...row, perwout: row.total / row.count })));
                setUniquePriceOffers(vendors)
                setVersions(Object.values(versions))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet, user_id]);
    const handleChange = (e, id) => {
        const name = e.target.name;
        const value = e.target.value;
        const allowed = /^\d+(\.\d{0,2})?$/.test(value) || value === "";
        if (allowed)
            setPriceOffers(prev => prev.map(row => row.id === id ? ({ ...row, [name]: value, total: value * row.count }) : row))
    }
    const addAlternative = (po) => {
        setPriceOffers(prev => [...prev, {
            ...po,
            id: v4(),
            perwout: 0,
            total: 0,
            title: "",
            material_id: ""
        }])
    }
    const removeAlternative = (po) => {
        const id = po.id
        setPriceOffers(prev => prev.filter(po => po.id !== id))
    }
    const removeVendor = (id, userid) => {
        setVersions(prev => {
            const index = prev.findIndex(version => version.id === userid);
            return prev[index].count === 1
                ? prev.filter(version => version.id !== userid)
                : prev.map(version => version.id === userid ? ({ ...version, count: version.count - 1 }) : version)
        });
        setUniquePriceOffers(prev => {
            return prev.filter(po => po.poid !== id)
        });
        setPriceOffers(prev => {
            return prev.filter(po => po.po_id !== id)
        })
    }
    const addNewVendor = () => {
        const { id: userid, fullName } = tokenContext[0].userData.userInfo;
        setUniquePriceOffers(prev => [...prev, {
            poid: v4(),
            perwout: 0,
            total: 0,
            disabled: false,
            user_id: userid,
            title: "",
            material_id: ""
        }])
        setVersions(prev => {
            const newState = [...prev];
            const index = newState.findIndex(version => version.id === userid)
            if (index !== -1) {
                newState[index].count += 1
            }
            else {
                const color = (0x9abed1 * userid).toString(16)
                newState.push({
                    id: userid,
                    count: 1,
                    color: color.length > 6 ? color.substring(0, 6) : color,
                    fullName: fullName
                })
            }
            return newState
        })
    }
    return (
        <div style={{ paddingTop: "70px", display: "flex" }}>
            {
                showVendorModal &&
                <div className={table["vendors-list-modal"]}>
                    <div>
                        <span>
                            <MdClose size="1.5rem" onClick={() => setShowVendorModal(false)} />
                        </span>
                    </div>
                    <NewVendorModal />
                </div>
            }
            <div style={{ padding: "0px 20px" }}>
                <div style={{ clear: "both" }}>
                    <span style={{ cursor: "pointer" }}>
                        <IoIosArrowBack onClick={() => history.goBack()} size="40" color="#606770" />
                    </span>
                </div>
                <div style={{ float: "left", minHeight: "40px", marginBottom: "10px", position: "sticky", left: 0 }}>
                    {
                        versions.map(version =>
                            <div style={{ position: "relative", margin: "1px", padding: "10px", float: "left", cursor: "default" }} key={version.id}>
                                {version.fullName}
                                <span style={{ position: "absolute", right: "0", top: 0, bottom: 0, width: "5px", borderRadius: "1px 5px 5px 1px", backgroundColor: `#${version.color}` }}></span>
                            </div>
                        )
                    }
                </div>
                <div style={{ display: "flex", flexDirection: "column", clear: "both", position: "relative", zIndex: 0 }}>
                    <div className={table["price-research-header"]}>
                        <div style={{ fontWeight: "600", position: "sticky", left: 0, zIndex: 23, backgroundColor: "white", boxShadow: "white 0px -6px 0px 0px" }}>
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
                            uniquePriceOffers.map(po =>
                                <PriceOffer
                                    vendorName={po.vendorName}
                                    key={po.poid}
                                    setUniquePriceOffers={setUniquePriceOffers}
                                    id={po.poid}
                                    residency={po.residency}
                                    tax_type={po.tax_type}
                                    disabled={po.disabled}
                                    setShowVendorModal={setShowVendorModal}
                                    userid={po.user_id}
                                    removeVendor={removeVendor}
                                    vendorList={vendorList}
                                    version={versions.find(version => version.id === po.user_id)}
                                />
                            )
                        }
                    </div>
                    {
                        visaMaterials.current.map(material =>
                            <div key={material.order_material_id} style={{ position: "relative" }} className={table["price-research-material-row"]}>
                                <div style={{ flex: "0 0 300px", position: "sticky", top: 0, bottom: "0", left: 0, zIndex: 23 }}>
                                    <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 200px" }}>{material.title}</div>
                                    <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 50px" }}>{material.amount}</div>
                                    <div className={table["price-research-material-cell"]} style={{ backgroundColor: "gainsboro", flex: "0 0 50px" }}>{material.amount}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    {
                                        uniquePriceOffers.map(po =>
                                            <PriceOfferMaterials
                                                key={po.poid}
                                                priceOffers={priceOffers}
                                                venid={po.vendor_id}
                                                disabled={po.disabled}
                                                orderType={material.order_type}
                                                handleChange={handleChange}
                                                poid={po.poid}
                                                removeAlternative={removeAlternative}
                                                count={material.amount}
                                                vendorList={vendorList}
                                                addAlternative={addAlternative}
                                                parentMaterialid={material.order_material_id}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className={table["price-research-material-row"]}>
                        <div className={table["price-research-material-footer"]} style={{ flex: "0 0 300px", position: "sticky", left: 0, zIndex: 23, backgroundColor: "white" }}>
                            <div className={table["price-research-material-cell"]} >Cəm</div>
                            <div className={table["price-research-material-cell"]}>Təsdiq olunan təklif</div>
                            <div className={table["price-research-material-cell"]}>Texniki rəy</div>
                            <div style={{ height: "30px" }} className={table["price-research-material-cell"]}>Şöbə, vəzifə, Ad və soyad, imza</div>
                        </div>
                        {
                            uniquePriceOffers.map(po =>
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
                    <span onClick={addNewVendor} style={{ position: "absolute", top: "50%", right: "-3rem", cursor: "pointer" }}>
                        <FaPlusCircle size="30" color="green" />
                    </span>
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
        console.log(vendor)
        props.setUniquePriceOffers(prev =>
            prev.map(upo =>
                upo.poid === props.id
                    ? ({
                        ...upo,
                        vendor_id: vendor.id,
                        residency: vendor.residency,
                        tax_type: vendor.tax_type
                    })
                    : upo
            ))
        // vendorListRef.current.style.display = "none";
    }
    const handleAddNewItemClick = (value) => {
        props.setShowVendorModal(true)
    }
    return (
        <>
            <div className={table["price-research-header-container"]} style={{ boxShadow: `0px -4px 2px 0px #${props.version?.color}` }}>{
                !props.disabled &&
                <span className={table["remove-vendor"]} onClick={() => props.removeVendor(props.id, props.userid)} >
                    <RiDeleteBack2Fill size="18px" color="rgb(217, 52, 4)" />
                </span>
            }
                <div className={table["price-research-material-cell"]} style={{ zIndex: "1" }}>
                    <InputSearchList
                        placeholder="Vendor"
                        text="name"
                        disabled={props.disabled}
                        name="vendor"
                        listid={`vendorListRef${props.id}`}
                        handleInputChange={handleVendorSearch}
                        defaultValue={props.vendorName}
                        items={vendors}
                        addNewItem={true}
                        handleAddNewItemClick={handleAddNewItemClick}
                        style={{ top: "26px", width: "80%" }}
                        inputStyle={{ border: "none" }}
                        handleItemClick={setVendor}
                    />
                </div>
                <div className={table["price-research-material-cell"]}>
                    {props.residency === 1 ? "Yerli" : "Xarici"}
                </div>
                <div className={table["price-research-material-cell"]}>
                    {props.tax_type === 1 ? "ƏDV ödəyicisi" : "Sadələşdirilmiş" }
                </div>
                <div className={table["price-research-material-cell"]}><input /></div>
                <div className={table["price-research-material-cell"]}><input /></div>
                <div className={table["price-research-material-cell"]}><input /></div>
                <div className={table["price-research-materials-header"]}>
                    <div className={table["price-research-material-cell"]}>Təklif olunan</div>
                    <div className={table["price-research-material-cell"]}>1 ədədin qiyməti</div>
                    <div className={table["price-research-material-cell"]}>1 ədəd ƏDV daxil qiymət</div>
                    <div style={{ fontSize: "12px"}} className={table["price-research-material-cell"]}>18% ƏDV daxil toplam qiyməti</div>
                </div>
            </div>
        </>
    )
}
const PriceOfferMaterials = (props) => {
    const offeredMaterials = props.priceOffers.filter(po => po.po_id === props.poid && po.parent_offers_material_id === props.parentMaterialid)
    return (
        <div className={table["price-research-materials"]} >{
            offeredMaterials.length === 0 ?
                <div>
                    <div className={table["price-research-material-cell"]}>
                        {
                            !props.disabled &&
                            <span style={{ right: "5px", cursor: "pointer" }}>
                                <FaPlus onClick={() => props.addAlternative({ parent_offers_material_id: props.parentMaterialid, po_id: props.poid, count: props.count })} color="rgb(255, 174, 0)" />
                            </span>
                        }
                    </div>
                    <div className={table["price-research-material-cell"]}></div>
                    <div className={table["price-research-material-cell"]}></div>
                    <div className={table["price-research-material-cell"]}></div>
                </div>
                : offeredMaterials.map(po =>
                    <PriceResearchMetarialsRow
                        key={po.id}
                        po={po}
                        removeAlternative={props.removeAlternative}
                        disabled={props.disabled}
                        orderType={props.orderType}
                        addAlternative={props.addAlternative}
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
                    {(props.priceOffers.filter(row => row.po_id === props.poid).reduce((sum, curr) => sum += curr.total, 0) * 1.18).toFixed(2)}
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
