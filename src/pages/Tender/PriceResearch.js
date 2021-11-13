import React, { Suspense, useContext, useEffect, useRef, useState } from "react"
import { FaCheck, FaPlus, FaPlusCircle, FaRegFileImage, FaTimes, FaUserEdit } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { TokenContext } from "../../App";
import InputSearchList from "../../components/Misc/InputSearchList";
import useFetch from "../../hooks/useFetch";
import table from "../../styles/Table.module.css"
import PriceResearchMetarialsRow from "./PriceResearchMetarialsRow";
import { RiDeleteBack2Fill, RiSave3Fill } from "react-icons/ri"
import { IoIosArrowBack, IoIosSend, IoIosBulb } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AiOutlineRight } from "react-icons/ai";
import Modal from "../../components/Misc/Modal"
const PriceOfferActions = React.lazy(() => import("../../components/Tender/PriceOfferActions"));
const ForwardPriceOffer = React.lazy(() => import("../../components/Tender/ForwardPriceOffer"));
const NewVendorModal = React.lazy(() => import("./NewVendorModal"));
const PriceResearch = (props) => {
    const visa = useLocation().state?.visa || props.visa;
    const id = useLocation().state?.id || props.id;
    const visaMaterials = useRef(visa ? visa : []);
    const [priceOffers, setPriceOffers] = useState([]);
    const [uniquePriceOffers, setUniquePriceOffers] = useState([]);
    const [alertbox, set_alertbox] = useState(false);
    const [versions, setVersions] = useState([]);
    const tokenContext = useContext(TokenContext)[0];
    const user_id = tokenContext.userData.userInfo.id
    const fetchGet = useFetch("GET");
    const [best_prices, set_best_prices] = useState(visa || [])
    const history = useHistory();
    const previliges_ref = useRef(
        {
            can_select: tokenContext.userData.previliges.includes("Qiymət təklifi seçmək"),
            can_forward: tokenContext.userData.previliges.includes("Qiymət təklifi yönəltmək"),
            can_return: tokenContext.userData.previliges.includes("Qiymət təklifi düzəliş")
        }
    )
    const [showVendorModal, setShowVendorModal] = useState(false)
    const [vendorList, setVendorList] = useState([]);
    const [actions_modal, set_actions_modal] = useState({ state: false, component: null, props: null });
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
                const parent_materials = visaMaterials.current.map(material => {
                    const materials = resp.filter(po => po.parent_offers_material_id === material.id);
                    let min = materials[0];
                    for (let i = 0; i < materials.length; i++) {
                        if (materials[i].price < min.price) {
                            min = materials[i];
                        }
                    }
                    return ({
                        result: material.result,
                        material_id: material.id,
                        title: min?.title,
                        id: min?.id,
                        price: min?.price,
                        vendor_id: min?.vendor_id,
                        vendor_name: min?.vendor_name,
                        total: (material.amount * min?.price * 1.18).toFixed(2)
                    })
                })
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
                set_best_prices(parent_materials)
                setPriceOffers(resp.map(row => ({ ...row, total: (row.price * row.amount * 1.18).toFixed(2) })));
                setUniquePriceOffers(vendors)
                setVersions(Object.values(versions))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet, user_id, visaMaterials]);
    const handleChange = (e, id) => {
        const name = e.target.name;
        const value = e.target.value;
        const allowed = /^\d+(\.\d{0,2})?$/.test(value) || value === "";
        if (allowed) {
            setPriceOffers(prev => prev.map(row => row.id === id ? ({ ...row, [name]: value, total: (value * row.amount * 1.18).toFixed(2) }) : row));
            const price_offer = priceOffers.find(po => po.id === id);
            set_best_prices(prev => prev.map(material =>
                material.material_id === price_offer.parent_offers_material_id && material.price > Number(value)
                    ? ({
                        ...material,
                        price: value,
                        total: (material.amount * Number(value) * 1.18).toFixed(2),
                        id,
                        vendor_id: price_offer.vendor_id,
                        vendor_name: price_offer.vendor_name
                    })
                    : material
            ))
        }
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
    const handle_actions_click = (e) => {
        const doc_id = id;
        const action_id = e.currentTarget.id;
        const component = action_id === "3" ? ForwardPriceOffer : PriceOfferActions;
        const props = { id: action_id, doc_id, handle_done: () => set_actions_modal({ state: false }) }
        if (action_id === "1") {
            props.selected_materials = priceOffers.filter(po => po.result === 1)
        }
        set_actions_modal({ state: true, component: component, props: props });
    }
    const rm_price_offer = () => {
        if (Number(alertbox.id)) {
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
        } else {
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
        }
    }
    const removeVendor = (id, userid) => {
        set_alertbox({ state: true, id, user_id: userid })
    }
    const addNewVendor = () => {
        const { id: userid, fullName } = tokenContext.userData.userInfo;
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
        <div style={{ height: "calc(100vh - 56px)", marginTop: "56px", display: "flex", overflow: "auto" }}>
            {
                <div className={table["actions-ribbon"]}>
                    <div className={table["actions-ribbon-container"]}>
                        {
                            !previliges_ref.current.can_select &&
                            <div id="1" onClickCapture={handle_actions_click} title="Təzdiq et">
                                <FaCheck color="rgb(15, 157, 88)" size="2rem" />
                            </div>
                        }
                        {
                            !previliges_ref.current.can_return &&
                            <div id="2" onClickCapture={handle_actions_click} title="Geri göndər (Düzəliş üçün)">
                                <FaUserEdit color="rgb(244, 180, 0)" size="2rem" />
                            </div>
                        }
                        {
                            !previliges_ref.current.can_forward &&
                            <div id="3" onClickCapture={handle_actions_click} title="Rəy üçün yönəlt">
                                <IoIosSend color="rgb(64, 168, 196)" size="2rem" />
                            </div>
                        }
                        {
                            !previliges_ref.current.can_select &&
                            <div id="-1" onClickCapture={handle_actions_click} title="Etiraz et">
                                <FaTimes color="rgb(217, 52, 4)" size="2rem" />
                            </div>
                        }
                    </div>
                    <div style={{ position: "absolute", top: "50%", right: "0", transform: "translateY(50%)" }}>
                        <div>
                            <AiOutlineRight size="2rem" />
                        </div>
                    </div>
                </div>
            }
            {
                showVendorModal &&
                <Suspense fallback="">
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
                </Suspense>
            }
            {
                actions_modal.state &&
                <Suspense fallback="">
                    <Modal
                        style={{ minWidth: "10rem", width: "45rem", backgroundColor: "white" }}
                        title={"untitled"}
                        childProps={actions_modal.props}
                        changeModalState={() => set_actions_modal({ state: false, component: null })}
                    >
                        {actions_modal.component}
                    </Modal>
                </Suspense>
            }
            <BestPrices best_prices={best_prices.filter(p => p.vendor_id)} />
            <div style={{ padding: "0px 20px" }}>
                <div style={{ clear: "both", float: "left", backgroundColor: "rgb(255,255,255)", zIndex: "2", top: "58px", minWidth: "300px", }}>
                    <span style={{ cursor: "pointer" }}>
                        <IoIosArrowBack onClick={() => history.goBack()} size="40" color="#606770" />
                    </span>
                </div>
                <div style={{ clear: "both", float: "left", minHeight: "40px", top: "0px", paddingBottom: "10px", zIndex: "1", minWidth: "300px", backgroundColor: "white", position: "sticky", left: 0 }}>
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
                            Qiymət təklifini silməyə əminsinizmi?
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
                                                tokenContext={tokenContext}
                                                disabled={po.disabled}
                                                best_prices={best_prices}
                                                set_best_prices={set_best_prices}
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
const BestPrices = React.memo(({ best_prices }) => {
    const vendors = []
    for (let i = 0; i < best_prices.length; i++) {
        const index = vendors.findIndex(elem => elem.vendor_id === best_prices[i].vendor_id)
        if (index === -1) {
            vendors.push(best_prices[i])
        }
    }
    return (
        <span className={table["hint"]}>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "0px" }}>
                    <IoIosBulb color="gold" size="40" />
                </span>
            </div>
            <div style={{ marginTop: "50px", borderRadius: "5px", overflow: "hidden" }}>
                {
                    vendors.map(vendor =>
                        <div className={table["selected-materials-row"]} key={vendor.vendor_id + "a"}>
                            <div style={{ position: "relative" }}>
                                <span style={{ top: "50%", transform: "translateY(-50%)", position: "absolute", left: "10px" }}>
                                    {vendor.vendor_name}
                                </span>
                            </div>
                            <div>
                                {
                                    best_prices.filter(pom => pom.vendor_id === vendor.vendor_id).map(pom =>
                                        <div key={pom.id}>
                                            <div style={{ flex: 1 }}>{pom.title}</div>
                                            <div>{pom.price}</div>
                                            <div>{pom.total}</div>
                                            <div style={{ textAlign: "center" }}>{pom.result === 1 ? <FaCheck color="green" /> : null}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </span>
    )
})
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
                <div onDrop={onDrop} onDragOver={handleDragEnter} onDragLeave={handleDragLeave} onDragEnter={handleDragEnter} style={{ position: "absolute", left: 5, right: 0, bottom: "35px", borderRadius: "5px", borderWidth: "1px" }}>
                    {props.files.map(file =>
                        file.fetched
                            ? <a href={`http://172.16.3.64/original/${file.name}`} target="_blank" rel="noreferrer" key={file.name} title={file.name} style={{ borderRadius: "5px", cursor: "pointer" }}>
                                <FaRegFileImage size="24" color={`#${props.version?.color}`} />
                            </a>
                            :
                            <span key={file.name} title={file.name}>
                                <FaRegFileImage size="24" color={`#${props.version?.color}`} />
                            </span>
                    )}
                    {!props.disabled &&
                        <>
                            <label htmlFor={`files-${props.id}`} title="Fayl əlavə et" style={{ float: "right", cursor: "pointer" }}>
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
                    style={{ top: "26px", width: "90%" }}
                    inputStyle={{ border: "none" }}
                    handleItemClick={setVendor}
                />
            </div>
            <div className={table["price-research-material-cell"]}>
                {props.residency === 1 ? "Yerli" : props.residency === 2 ? "Xarici" : ""}
            </div>
            <div className={table["price-research-material-cell"]}>
                {props.tax_type === 1 ? "ƏDV ödəyicisi" : props.tax_type === 2 ? "Sadələşdirilmiş" : ""}
            </div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.delivery_terms} ref={delivery_terms_ref} /></div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.delivery_duration} ref={delivery_duration_ref} /></div>
            <div className={table["price-research-material-cell"]}><input disabled={props.disabled} defaultValue={props.log_expenses} ref={log_expenses_ref} /></div>
            <div className={table["price-research-materials-header"]}>
                <div className={table["price-research-material-cell"]}>Təklif olunan</div>
                <div style={{ fontSize: "12px" }} className={table["price-research-material-cell"]}>1 ədədin qiyməti</div>
                <div style={{ fontSize: "12px" }} className={table["price-research-material-cell"]}>1 ədəd ƏDV daxil qiymət</div>
                <div style={{ fontSize: "12px" }} className={table["price-research-material-cell"]}>18% ƏDV daxil toplam qiyməti</div>
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
                        best_prices={props.best_prices}
                        set_best_prices={props.set_best_prices}
                        removeAlternative={props.removeAlternative}
                        disabled={props.disabled}
                        setPriceOffers={props.setPriceOffers}
                        orderType={props.orderType}
                        tokenContext={props.tokenContext}
                        addAlternative={props.addAlternative}
                        handleChange={props.handleChange}
                    />
                )
        }
        </div>
    )
}
const PriceOfferMaterialsFooter = () => {
    return (
        <div className={table["price-research-material-footer"]}>
            <div className={table["price-research-material-cell"]}>
                <div style={{ flex: 1, textAlign: "right", fontWeight: "600" }}>
                    {/* {Number(props.priceOffers.filter(row => row.po_id === props.poid).reduce((sum, curr) => sum += Number(curr.total), 0)).toFixed(2)} */}
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
