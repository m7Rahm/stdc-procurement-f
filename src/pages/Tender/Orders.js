import React, { useCallback, useRef, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
// import AgreementContent from '../../components/Tender/AgreementContent'
import { optionsReadyOrders } from '../../data/data'
import useFetch from '../../hooks/useFetch'
import PriceOffers from './PriceOffers'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = OrdersSearchHOC(optionsReadyOrders);
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


    const [visa, setVisa] = useState([{
        act_date_time: null,
        amount: 1,
        assignment: 257,
        can_influence: true,
        comment: "",
        date_time: "17/07/21 10:45",
        description: "",
        emp_version_id: 32,
        executer_id: null,
        forward_type: 2,
        full_name: "Rəhman Mustafayev",
        id: 21,
        in_warehouse_amount: 0,
        is_deleted: false,
        is_read: true,
        mat_ass: "STDC",
        mat_ass_id: 1,
        material_comment: "",
        material_id: 1372,
        material_name: "Pulsayan maşın",
        ord_numb: "32-0",
        order_id: 7,
        order_material_id: 8,
        order_type: 0,
        priority: 0,
        product_id: "900411372",
        receiver_id: 31,
        related_order_id: null,
        result: 0,
        sender_comment: "",
        sender_id: 32,
        seq: 2,
        stat: true
    },
    {
        act_date_time: null,
        amount: 12,
        assignment: 257,
        can_influence: true,
        comment: "",
        date_time: "17/07/21 10:45",
        description: "",
        emp_version_id: 32,
        executer_id: null,
        forward_type: 2,
        full_name: "Rəhman Mustafayev",
        id: 212,
        in_warehouse_amount: 0,
        is_deleted: false,
        is_read: true,
        mat_ass: "STDC",
        mat_ass_id: 1,
        material_comment: "",
        material_id: 1373,
        material_name: "Adidas",
        ord_numb: "32-0",
        order_id: 7,
        order_material_id: 9,
        order_type: 0,
        priority: 0,
        product_id: "900411372",
        receiver_id: 31,
        related_order_id: null,
        result: 0,
        sender_comment: "",
        sender_id: 32,
        seq: 2,
        stat: true
    }
    ]);


    const setRemainder = (id, value) => {
        setVisa(prev => prev.map((row, index) => row.order_material_id === id ? ({ ...row, in_warehouse_amount: value }) : row));
    }



    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                searchStateRef={searchStateRef}
            />
            <PriceOffers
                current={visa}
                setVisa={setVisa}
                canProceed={1}
                forwardType={0}
                setRemainder={setRemainder}
            />

        </div>
    )
}
export default Orders