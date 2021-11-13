import React, { useState, useCallback } from "react"
import AgreementCard from "../../components/VisaCards/AgreementCard"
import SideBarContainer from "../../components/HOC/SideBarContainer"
import OrdersSearchHOC from "../../components/Search/OrdersSearchHOC"
import CardsList from "../../components/HOC/CardsList"
import AgreementContent from "../../components/Orders/Agreements/AgreementContent"
// import { optionsAgreements } from "../../data/data"
import useFetch from "../../hooks/useFetch"
const SideBarContent = CardsList(AgreementCard);
const Search = React.memo(OrdersSearchHOC([]));
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
const Agreements = (props) => {
    const { link } = props;
    const doc_id = /\d+/.exec(window.location.pathname);
    const [active, setActive] = useState(doc_id ? doc_id[0] : undefined);
    const [initData, setInitData] = useState({
        offset: 0
    });
    const fetchGet = useFetch("GET")
    const updateListContent = useCallback((data) => {
        const query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "?").slice(0, -1);
        return fetchGet(link + query)
    }, [link, fetchGet])
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                newDocNotifName={props.newDocNotifName}
                path_name={props.path}
                params={props.params}
            />
            <AgreementContent
                docid={active}
                another={doc_id ? doc_id[0] : undefined}
                setActive={setActive}
                setInitData={setInitData}
                referer={props.referer}
            />
        </div>
    )
}
export default Agreements