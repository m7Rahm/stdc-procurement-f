import React, { useCallback, useRef, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
// import AgreementContent from '../../components/Tender/AgreementContent'
// import { optionsReadyOrders } from '../../data/data'
import useFetch from '../../hooks/useFetch'
import PriceOffers from './PriceOffers'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = OrdersSearchHOC();
const SideBar = React.memo(SideBarContainer(WithSearch, SideBarContent));

const init = {
    userName: '',
    startDate: null,
    endDate: null,
    result: 0,
    from: 0,
    until: 20
}
const Orders = () => {
    const startIndex = window.location.search.indexOf("i=")
    const id = startIndex !== -1 ? window.location.search.substring(startIndex + 2) : null
    const state = window.history.state;
    const activeInit = { id: Number(id), ordNumb: "", departmentName: "" }
    if (state && state.on) {
        activeInit.ordNumb = state.on;
        activeInit.departmentName = state.dn
    }
    // useEffect(() => {
    //     if (Number(id) && !window.history.state.bo) {
    //         setActive(prev => ({ ...prev, id }))
    //     }
    // }, [id])
    // eslint-disable-next-line
    const [active, setActive] = useState(activeInit);
    const searchStateRef = useRef({ result: 0 });
    // eslint-disable-next-line
    const [initData, setInitData] = useState(init);
    const fetchPost = useFetch("POST");
    const updateListContent = useCallback((data) => fetchPost('/api/get-ready-orders', data), [fetchPost])

    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                searchStateRef={searchStateRef}
            />
            <PriceOffers
                id={active.id}
                setInitData={setInitData}
            />

        </div>
    )
}
export default Orders