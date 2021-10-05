import React, { useEffect } from "react"
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect
} from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi"
import { BsPersonCheckFill } from "react-icons/bs"
import { FcOvertime, FcCheckmark } from "react-icons/fc"
import Orders from "./Tender/Orders";

import "../styles/Tender.css"
// import Agreements from "./Orders/Agreements";
import PriceResearch from "./Tender/PriceResearch";
import useFetch from "../hooks/useFetch";
const routes = [
    {
        text: "Daxil olmuş sifarişlər",
        link: "/orders",
        icon: GiShoppingCart,
        component: Orders,
        module: 0,
        sub_module: 0,
        notif_count: "",
        props: {
            result: -3
        }
    },
    {
        text: "Gözləyən sifarişlər",
        link: "/queue",
        icon: FcOvertime,
        module: 0,
        notif_count: "",
        sub_module: 1,
        component: Orders,
        props: {
            result: 1
        }
    },
    {
        text: "İcra olunmuş araşdırmalar",
        link: "/done",
        module: 0,
        sub_module: 2,
        notif_count: "",
        icon: BsPersonCheckFill,
        component: Orders,
        props: {
            result: 31
        }
    },
    {
        text: "Təsdiq olunmuş araşdırmalar",
        link: "/confirmed",
        notif_count: "",
        icon: FcCheckmark,
        component: Orders,
        module: 0,
        sub_module: 3,
        props: {
            result: 32,
        }
    },
]
const Tender = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { path, url } = useRouteMatch();
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet("/api/notifications-by-categories/3")
            .then(respJ => {
                loadingIndicatorRef.current.style.transform = "translateX(0%)";
                loadingIndicatorRef.current.style.opacity = "0";
                loadingIndicatorRef.current.classList.add("load-to-start");
                respJ
                    .forEach(notification => {
                        const route = routes.find(route => route.sub_module === notification.sub_module);
                        if (route) {
                            route.notif_count = notification.cnt;
                        }
                    });
                setMenuData({ url: url, routes: routes });
                props.leftNavRef.current.style.display = "block";
            })
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef, fetchGet])
    return (
        <Switch>
            {
                routes.map(route =>
                    <Route key={route.link} path={`${path}${route.link}/:docid?`}>
                        <route.component path_name={`${path}${route.link}`} {...route.props} />
                    </Route>
                )
            }
            <Route path={`${path}/price-offers/:orderid?`}>
                <PriceResearch />
            </Route>
            <Redirect to={`${path}/orders/:docid?`} />
        </Switch>
    )
}

export default Tender