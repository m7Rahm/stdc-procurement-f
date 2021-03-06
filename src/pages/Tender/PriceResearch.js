import React, { useContext, useEffect, useRef, useState } from "react"
import { FaCheck, FaPlus, FaPlusCircle, FaRegFileImage } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { TokenContext } from "../../App";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";
import table from "../../styles/Table.module.css"
import PriceResearchMetarialsRow from "./PriceResearchMetarialsRow";
import { RiDeleteBack2Fill, RiSave3Fill } from "react-icons/ri"
import { IoIosArrowBack } from "react-icons/io";
import NewVendorModal from "./NewVendorModal";
import { MdClose } from "react-icons/md";
const PriceResearch = () => {
    const visa = useLocation().state?.visa;
    const id = useLocation().state?.id;
    const visaMaterials = useRef(visa ? visa : []);
    const [priceOffers, setPriceOffers] = useState([]);
    const [uniquePriceOffers, setUniquePriceOffers] = useState([]);
    const [alertbox, set_alertbox] = useState(false);
    const [versions, setVersions] = useState([]);
    const tokenContext = useContext(TokenContext);
    const user_id = tokenContext[0].userData.userInfo.id
    const fetchGet = useFetch("GET");
    const history = useHistory();
    const [showVendorModal, setShowVendorModal] = useState(false)
    const [vendorList, setVendorList] = useState([]);
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
                            residency: row.residency,
                            delivery_terms: row.delivery_terms,
                            delivery_duration: row.delivery_duration,
                            log_expenses: row.log_expenses,
                            files: row.files ? row.files.split(",").map(file => ({ name: file, fetched: true })) : []
                        });
                    }
                })
                setPriceOffers(resp.map(row => ({ ...row, total: (row.price * row.amount * 1.18).toFixed(2) })));
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
            setPriceOffers(prev => prev.map(row => row.id === id ? ({ ...row, [name]: value, total: (value * row.amount * 1.18).toFixed(2) }) : row))
    }
    const addAlternative = (po) => {
        setPriceOffers(prev => [...prev, {
            ...po,
            id: v4(),
            price: 0,
            total: 0,
            title: "",
            parentMaterialid: po.parent_offers_material_id,
            material_id: ""
        }])
    }
    const removeAlternative = (po) => {
        const id = po.id
        setPriceOffers(prev => prev.filter(po => po.id !== id))
    }
    const rm_price_offer = () => {
        fetchGet(`/api/remove-price-offer/${alertbox.id}`)
            .then(_ => {
                setVersions(prev => {
                    const index = prev.findIndex(version => version.id === alertbox.user_id);
                    return prev[index].count === 1
                        ? prev.filter(version => version.id !== alertbox.user_id)
                        : prev.map(version => version.id === alertbox.user_id ? ({ ...version, count: version.count - 1 }) : version)
                });
                setUniquePriceOffers(prev => {
                    return prev.filter(po => po.poid !== alertbox.id)
                });
                setPriceOffers(prev => {
                    return prev.filter(po => po.po_id !== alertbox.id)
                })
                set_alertbox({ state: false, id: null, user_id: null })
            })
            .catch(ex => console.log(ex))
    }
    const removeVendor = (id, userid) => {
        set_alertbox({ state: true, id, user_id: userid })
    }
    const addNewVendor = () => {
        const { id: userid, fullName } = tokenContext[0].userData.userInfo;
        setUniquePriceOffers(prev => [...prev, {
            poid: v4(),
            price: 0,
            total: 0,
            disabled: false,
            user_id: userid,
            title: "",
            material_id: "",
            files: []
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
                    <NewVendorModal
                        setVendorList={setVendorList}
                        close_modal={() => setShowVendorModal(false)}
                    />
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
                            <div className={table["price-research-material-cell"]}>??irk??t ad??</div>
                            <div className={table["price-research-material-cell"]}>??irk??tin n??v?? (yerli/Xarici)</div>
                            <div className={table["price-research-material-cell"]}>Vergi ??d??yici tipi(??DV/Sad??l????dirilmi??)</div>
                            <div className={table["price-research-material-cell"]}>??atd??r??lma ????rtl??ri</div>
                            <div className={table["price-research-material-cell"]}>??atd??r??lma m??dd??ti</div>
                            <div className={table["price-research-material-cell"]}>G??zl??nil??n Da????nma v?? G??mr??k X??rcl??ri</div>
                            <div style={{ height: "80px", fontWeight: "600" }}>
                                <div className={table["price-research-material-cell"]} style={{ width: "200px", float: "left", padding: "0.5rem", height: "100%" }}>Mal??n ad??</div>
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
                                    priceOffers={priceOffers}
                                    id={po.poid}
                                    visaMaterials={visaMaterials}
                                    order_id={id}
                                    delivery_duration={po.delivery_duration}
                                    delivery_terms={po.delivery_terms}
                                    log_expenses={po.log_expenses}
                                    vendor_id={po.vendor_id}
                                    residency={po.residency}
                                    tax_type={po.tax_type}
                                    files={po.files}
                                    disabled={po.disabled}
                                    setShowVendorModal={setShowVendorModal}
                                    userid={po.user_id}
                                    setPriceOffers={setPriceOffers}
                                    removeVendor={removeVendor}
                                    vendorList={vendorList}
                                    version={versions.find(version => version.id === po.user_id)}
                                />
                            )
                        }
                    </div>
                    {
                        alertbox.state &&
                        <div className={table["alert-box"]}>
                            Qiym??t t??klifini silm??y?? ??minsinizmi?
                            <div>
                                <div onClick={rm_price_offer}>Ok</div>
                                <div>Imtina et</div>
                            </div>
                        </div>
                    }
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
                                                setPriceOffers={setPriceOffers}
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
                            <div className={table["price-research-material-cell"]} >C??m</div>
                            <div className={table["price-research-material-cell"]}>T??sdiq olunan t??klif</div>
                            <div className={table["price-research-material-cell"]}>Texniki r??y</div>
                            <div style={{ height: "30px" }} className={table["price-research-material-cell"]}>????b??, v??zif??, Ad v?? soyad, imza</div>
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
    const delivery_terms_ref = useRef(null);
    const delivery_duration_ref = useRef(null);
    const token_context = useContext(TokenContext);
    const log_expenses_ref = useRef(null);
    const input_ref = useRef(props.vendorName);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        const charArray = value.split("");
        const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
        const regExp = new RegExp(`${reg}`, "gi");
        const searchResult = props.vendorList.filter(vendor => regExp.test(vendor.name));
        setVendors(searchResult);
    }
    const saveVendor = () => {
        const formData = new FormData();
        const op = !isNaN(Number(props.id)) ? 0 : 1;
        formData.append("vendor_id", props.vendor_id);
        formData.append("delivery_terms", delivery_terms_ref.current.value)
        formData.append("delivery_duration", delivery_duration_ref.current.value)
        formData.append("log_expenses", log_expenses_ref.current.value)
        formData.append("materials", JSON.stringify(props.priceOffers.filter(po => po.po_id === props.id).map(po => [isNaN(po.id) ? null : po.id, po.material_id, po.material_name, po.price, po.parent_offers_material_id])))
        const new_files = props.files.filter(file => file.fetched === false)
        new_files.forEach(file => {
            formData.append("files", file)
        })
        if (!isNaN(Number(props.id))) {
            formData.append("offer_id", props.id)
            formData.append("files_string", props.files.filter(file => file.fetched === true).map(file => file.name).join(","))
        }
        else {
            formData.append("order_id", props.order_id)
        }
        fetch("http://172.16.3.64/api/save-pr", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token_context[0].token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (op === 1) {
                    props.setUniquePriceOffers(prev => prev.map(po => po.poid === props.id ? ({
                        ...po,
                        delivery_duration: delivery_duration_ref.current.value,
                        delivery_terms: delivery_terms_ref.current.value,
                        log_expenses: log_expenses_ref.current.value,
                        vendorName: input_ref.current,
                        poid: respJ[0].new_offer_id, files: po.files.map(file => ({ ...file, fetched: true }))
                    }) : po))
                    props.setPriceOffers(prev => {
                        const filtered = prev.filter(po => po.po_id !== props.id)
                        const updated_materials = respJ.slice(1).map(material => {
                            const amount = props.visaMaterials.current.find(mat => mat.id === material.parent_offers_material_id).amount;
                            return { ...material, po_id: respJ[0].new_offer_id, total: (material.price * amount * 1.18).toFixed(2), amount: amount }
                        })
                        const result = [...filtered, ...updated_materials]
                        return result
                    })
                }
            })
            .catch(ex => console.log(ex))
    }
    const setVendor = (_, vendor, inputRef) => {
        inputRef.current.value = vendor.name;
        input_ref.current = vendor.name;
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
    const handleDragEnter = (e) => {
        preventDefault(e)
        e.currentTarget.style.border = "1px dotted red"
    }
    const handleDragLeave = (e) => {
        preventDefault(e)
        e.currentTarget.style.borderColor = "transparent"
    }
    const onDrop = (e) => {
        preventDefault(e);
        const added_files = Object.values(e.dataTransfer.files)
        e.currentTarget.style.borderColor = "transparent"
        props.setUniquePriceOffers(prev => prev.map(po => {
            if (po.poid === props.id) {
                const files = po.files;
                const new_files = added_files.filter(file => !files.find(f => f.name === file.name))
                new_files.forEach(file => file.fetched = false)
                return ({ ...po, files: [...files, ...new_files] })
            }
            else
                return po
        })
        )
    }
    const preventDefault = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const addNewFile = (e) => {
        const added_files = Object.values(e.target.files)
        props.setUniquePriceOffers(prev => prev.map(po => {
            if (po.poid === props.id) {
                const files = po.files;
                const new_files = added_files.filter(file => !files.find(f => f.name === file.name))
                new_files.forEach(file => file.fetched = false)
                return ({ ...po, files: [...files, ...new_files] })
            }
            else
                return po
        })
        )
    }
    return (
        <div className={table["price-research-header-container"]} style={{ boxShadow: `0px -4px 2px 0px #${props.version?.color}` }}>{
            !props.disabled &&
            <span className={table["remove-vendor"]} >
                <RiDeleteBack2Fill onClick={() => {
                    props.removeVendor(props.id, props.userid)
                }} size="18px" color="rgb(217, 52, 4)" />
                <RiSave3Fill onClick={saveVendor} size="18px" color="gray" />
            </span>
        }
            <div className={table["price-research-material-cell"]} style={{ zIndex: "1" }}>
                <div onDrop={onDrop} onDragOver={handleDragEnter} onDragLeave={handleDragLeave} onDragEnter={handleDragEnter} style={{ position: "absolute", left: 5, right: 0, bottom: "30px", borderRadius: "5px", borderWidth: "1px" }}>
                    {props.files.map(file =>
                        file.fetched
                            ? <a href={`http://172.16.3.64/original/${file}`} target="_blank" rel="noreferrer" key={file.name} title={file.name} style={{ borderRadius: "5px", cursor: "pointer" }}>
                                <FaRegFileImage size="24" color={`#${props.version?.color}`} />
                            </a>
                            :
                            <span key={file.name} title={file.name}>
                                <FaRegFileImage size="24" color={`#${props.version?.color}`} />
                            </span>
                    )}
                    {!props.disabled &&
                        <>
                            <label htmlFor={`files-${props.id}`} title="Fayl ??lav?? et" style={{ float: "right", cursor: "pointer" }}>
                                <FaPlus size="20" />
                            </label>
                            <input onChange={addNewFile} multiple id={`files-${props.id}`} type="file" style={{ display: "none" }} />
                        </>
                    }
                </div>
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
                {props.residency === 1 ? "Yerli" : props.residency === 2 ? "Xarici" : ""}
            </div>
            <div className={table["price-research-material-cell"]}>
                {props.tax_type === 1 ? "??DV ??d??yicisi" : props.tax_type === 2 ? "Sad??l????dirilmi??" : ""}
            </div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.delivery_terms} ref={delivery_terms_ref} /></div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.delivery_duration} ref={delivery_duration_ref} /></div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.log_expenses} ref={log_expenses_ref} /></div>
            <div className={table["price-research-materials-header"]}>
                <div className={table["price-research-material-cell"]}>T??klif olunan</div>
                <div className={table["price-research-material-cell"]}>1 ??d??din qiym??ti</div>
                <div className={table["price-research-material-cell"]}>1 ??d??d ??DV daxil qiym??t</div>
                <div style={{ fontSize: "12px" }} className={table["price-research-material-cell"]}>18% ??DV daxil toplam qiym??ti</div>
            </div>
        </div>
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
                            <span style={{ left: "3px", cursor: "pointer", position: 'absolute' }}>
                                <FaPlus onClick={() => props.addAlternative({ parent_offers_material_id: props.parentMaterialid, po_id: props.poid, amount: props.count })} color="rgb(255, 174, 0)" />
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
                        setPriceOffers={props.setPriceOffers}
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
                    {Number(props.priceOffers.filter(row => row.po_id === props.poid).reduce((sum, curr) => sum += Number(curr.total), 0)).toFixed(2)}
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
