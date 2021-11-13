import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
// import AgreementContent from '../../components/Tender/AgreementContent'
// import { optionsReadyOrders } from '../../data/data'
import useFetch from '../../hooks/useFetch'
import PriceOffers from './PriceOffers'
import { TokenContext } from '../../App'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = OrdersSearchHOC([], [], true);
const SideBar = React.memo(SideBarContainer(WithSearch, SideBarContent));
const init = {
    userName: '',
    startDate: null,
    endDate: null,
    material_name: "",
    result: 0,
    from: 0,
    doc_type: 0,
    department_id: 0,
    until: 20
}
const Orders = (props) => {
    const matches = window.location.pathname.match(/\d+/);
    const id = matches ? matches[0] : null;
    const activeInit = { id: Number(id), ordNumb: "", departmentName: "" }
    const [active, setActive] = useState(activeInit);
    const searchStateRef = useRef({ result: props.result });
    const tokenContext = useContext(TokenContext)[0]
    const can_see_others = tokenContext.userData.previliges.includes("Sifarişləri yönləndirmək")
    const [initData, setInitData] = useState({ ...init, result: props.result });
    useEffect(() => {
        if (active.id !== Number(id)) {
            setActive(prev => ({ ...prev, id }))
        }
    }, [active.id, id])
    const fetchPost = useFetch("POST");
    const updateListContent = useCallback((data) => fetchPost('/api/get-ready-orders', data), [fetchPost])
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                path_name={props.path_name}
                setInitData={setInitData}
                updateListContent={updateListContent}
                searchStateRef={searchStateRef}
            />
            <PriceOffers
                id={active.id}
                referer={3}
                can_see_others={can_see_others}
                setInitData={setInitData}
            />
        </div>
    )
}
export default Orders