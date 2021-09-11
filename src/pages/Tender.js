import React, { useEffect } from "react"
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect
} from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa"
import Orders from "./Tender/Orders";
import "../styles/Tender.css"
// import Agreements from "./Orders/Agreements";
import PriceResearch from "./Tender/PriceResearch";
const routes = [
    {
        text: "Gözləyən",
        link: "/orders",
        icon: FaCartArrowDown,
        component: Orders
    },
    {
        text: "Razılaşdırılmış",
        link: "/new-offer",
        icon: FaCartArrowDown,
        component: PriceResearch
    },
    // {
    //     text: "Razılaşmalar",
    //     link: "/agreements",
    //     icon: FaTasks,
    //     component: Agreements,
    //     props: {
    //         params: {
    //             active: "id",
    //             number: "number",
    //         },
    //         method: "GET",
    //         link: "/api/tender-docs?doctype=1&",
    //         referer: "procurement"
    //     }
    // }
]
const Tender = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { path, url } = useRouteMatch();
    useEffect(() => {
        setMenuData({ url: url, routes: routes });
        loadingIndicatorRef.current.style.transform = "translateX(0%)";
        loadingIndicatorRef.current.style.opacity = "0";
        loadingIndicatorRef.current.classList.add("load-to-start");
        props.leftNavRef.current.style.display = "block";
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef])
    return (
        <Switch>
            {
                routes.map(route =>
                    <Route key={route.link} path={`${path}${route.link}/:docid?`}>
                        <route.component {...route.props} />
                    </Route>
                )
            }
            <Redirect to={`${path}/orders/:docid?`} />
        </Switch>
    )
}

export default Tender