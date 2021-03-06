import React, { useEffect } from "react"
import MyOrders from "./Orders/MyOrders"
import Visas from "./Orders/Visas"
import Agreements from "./Orders/Agreements"
import ContractsHOC from "../components/HOC/ContractsHOC"
import { IoMdDocument, IoMdCheckmarkCircleOutline, IoMdCart } from "react-icons/io"
import { FaHandshake } from "react-icons/fa"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { MdPayment } from "react-icons/md"
import "../styles/Orders.css"
import PaymentContent from "../components/Orders/Contracts/PaymentContent"
import ContractContent from "../components/Orders/Contracts/ContractContent"
import useFetch from "../hooks/useFetch"

const Contracts = ContractsHOC(ContractContent);
const Payments = ContractsHOC(PaymentContent);
const routes = [
    {
        text: "Sifarişlərim",
        link: "/my-orders",
        icon: IoMdCart,
        sub_module_id: 0,
        component: MyOrders,
        props: {
            inParams: {
                dateFrom: '',
                dateTill: '',
                status: -3,
                date: '',
                ordNumb: "",
                departments: []
            },
            method: "POST",
            link: "/api/orders",
            referer: "protected"
        },
    },
    {
        text: "Redaktəyə qaytarılmış",
        link: "/returned",
        docType: 0,
        categoryid: 2,
        sub_module_id: 1,
        icon: IoMdDocument,
        component: MyOrders,
        props: {
            inParams: {
                dateFrom: '',
                dateTill: '',
                status: -3,
                date: '',
                ordNumb: ""
            },
            method: "GET",
            link: "/api/returned-orders?from=0&until=20",
            referer: "returned",
            inLink: (from) => `/api/returned-orders?from=${from}&until=20`
        }
    },
    {
        text: "Vizalar",
        link: "/visas",
        icon: IoMdCheckmarkCircleOutline,
        component: Visas,
        sub_module_id: 2,
        docType: 0,
        categoryid: 1
    },
    {
        text: "Q/T razılaşmaları",
        link: "/agreements",
        icon: IoMdCart,
        sub_module_id: 3,
        component: Agreements,
        props: {
            link: "/api/get-user-agreements",
            params: {
                active: "message_id",
                number: "number",
            },
            method: "POST",
            newDocNotifName: "oA"
        },
        docType: 1,
        categoryid: 1
    },
    {
        text: "Müqavilə razılaşmaları",
        link: "/contracts",
        icon: FaHandshake,
        sub_module_id: 4,
        component: Contracts,
        docType: 2,
        categoryid: 1,
        props: {
            link: "/api/get-user-contracts",
            method: "POST",
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "message_id",
                tranid: "id",
                number: "number"
            },
            docType: 2,
            newDocNotifName: "oC"
        }
    },
    {
        text: "Ödəniş razılaşmaları",
        link: "/payments",
        sub_module_id: 5,
        icon: MdPayment,
        component: Payments,
        docType: 3,
        categoryid: 1,
        props: {
            link: "/api/get-user-payments",
            method: "POST",
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "message_id"
            },
            docType: 3,
            newDocNotifName: "oP"
        }
    }
];

const Orders = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { path, url } = useRouteMatch();
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet("/api/notifications-by-categories")
            .then(respJ => {
                loadingIndicatorRef.current.style.transform = "translateX(0%)";
                loadingIndicatorRef.current.style.opacity = "1";
                loadingIndicatorRef.current.classList.add("load-to-start");
                respJ.forEach(notif => {
                    routes.find(route => route.docType === notif.doc_type && route.categoryid === notif.category_id).notifCount = notif.cnt;
                });
                setMenuData({ url: url, routes: routes });
                props.leftNavRef.current.style.display = "block";
            })
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef, fetchGet]);
    return (
        <div className="dashboard">
            <Switch>
                {
                    routes.map(route =>
                        <Route key={route.link} path={`${path}${route.link}`}>
                            <route.component
                                navigationRef={props.navigationRef}
                                sub_module_id={route.sub_module_id}
                                module_id={props.module_id}
                                {...route.props}
                            />
                        </Route>
                    )
                }
                <Redirect to={`${path}/my-orders`} />
            </Switch>
        </div>
    )
}
export default Orders