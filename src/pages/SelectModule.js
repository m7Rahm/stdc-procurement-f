import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	lazy,
	Suspense,
	useCallback,
} from "react";

import { Link, Switch, Route, Redirect } from "react-router-dom";
import { TokenContext } from "../App";
import LeftSidePane from "../components/Common/LeftSidePane";
import Navigation from "../components/Common/Navigation";
// import PaymentLayout from "../components/Exports/PaymentLayout";
import Loading from "../components/Misc/Loading";
import Notifications from "../components/Common/Notifications";
import { v4 } from "uuid"
import classes from "../components/Common/Notification.module.css";
const Contracts = lazy(() => import("./Contracts"));
const Orders = lazy(() => import("./Orders"));
const Tender = lazy(() => import("./Tender"));
const Admin = lazy(() => import("./AdminPage"));

const availableModules = [
	{
		text: "Sifarişlər",
		label: "Orders",
		link: "/orders",
		module_id: 0,
		component: Orders,
	},
	{
		text: "Admin",
		label: "Admin",
		link: "/admin",
		module_id: 1,
		component: Admin,
	},
	{
		text: "Müqavilələr",
		label: "Contracts",
		link: "/contracts",
		module_id: 2,
		component: Contracts,
	},
	{
		text: "Tender",
		label: "Tender",
		link: "/tender",
		module_id: 3,
		component: Tender,
	},
];
const SelectModule = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const userData = tokenContext[0].userData;
	const navigationRef = useRef(null);
	const menuNavRefs = useRef({});
	const [menuData, setMenuData] = useState({ url: "", routes: [] })
	const [webSocket, setWebSocket] = useState(null);
	const leftPaneRef = useRef(null);
	const backgroundRef = useRef(null);
	const leftNavIconRef = useRef(null);
	const loadingIndicatorRef = useRef(null);
	const [notifications, setNotifications] = useState([]);
	const notificationsRef = useRef({});
	const closeNotification = (e) => {
		const target = e.currentTarget;
		const key = target.id;
		const elem = notificationsRef.current[key];
		elem.classList.add(classes["fadeoutanimation"]);
		elem.addEventListener("animationend", () => setNotifications((prev) => prev.filter((notification) => notification.key !== target.id)), false)
	};
	const createNewNotification = useCallback((header = "", content = '', link) => {
		setNotifications((prev) => {
			const newState = [
				...prev,
				{
					content: content,
					header: header,
					link: link,
					key: v4(),
				},
			];
			return newState;
		});
	}, [])
	useEffect(() => {
		let mounted = true;
		if (token && navigator.onLine) {
			const webSocket = new WebSocket(`ws://${process.env.REACT_APP_BASE_URL.substr(7)}${process.env.REACT_APP_WSS_PORT}`);
			webSocket.onopen = () => {
				const id = userData.userInfo.id;
				const data = {
					message: "recognition",
					full_name: userData.userInfo.fullName,
					userid: id // todo: get from session
				}
				webSocket.send(JSON.stringify(data));
				if (mounted)
					setWebSocket(webSocket);
			}
			return () => {
				webSocket.close();
				setWebSocket(null);
				mounted = false;
				console.log("connection closed");
			}
		}
	}, [token, userData]);
	const routes = availableModules.filter(availableModule => userData.modules.find(module => module.text === availableModule.label));
	const warehouseVisible = userData.modules.find(module => module.text === "Warehouse") ? true : false;
	const handleNavClick = () => {
		if (leftPaneRef.current) {
			leftPaneRef.current.classList.toggle("left-side-pane-open");
			const backgroundDisplay = backgroundRef.current.style.display === "none" ? "block" : "none"
			backgroundRef.current.style.display = backgroundDisplay
		}
	}
	return (
		<WebSocketContext.Provider value={webSocket}>
			<NotificationContext.Provider value={createNewNotification}>
				<Notifications
					closeNotification={closeNotification}
					notificationsRef={notificationsRef}
					notifications={notifications}
					setNotifications={setNotifications}
				/>
				<Switch>
					<Route exact path="/">
						<div className="splash-screen">
							<div className="module-select">
								{
									routes.map(module =>
										<Link key={module.link} to={module.link}>
											<div className="module-card">
												{module.text}
											</div>
										</Link>
									)
								}
								{
									warehouseVisible &&
									<a href="http://192.168.0.182:62447">
										<div className="module-card">
											Anbar
										</div>
									</a>
								}
							</div>
						</div>
					</Route>
					{
						webSocket &&
						<>
							<>
								<Navigation
									handleNavClick={handleNavClick}
									routes={routes}
									webSocket={webSocket}
									token={token}
									userData={userData}
									menuNavRefs={menuNavRefs}
									ref={loadingIndicatorRef}
									leftNavRef={leftNavIconRef}
									navigationRef={navigationRef}
									tokenContext={tokenContext}
								/>
								<div
									onClick={handleNavClick}
									ref={backgroundRef}
									style={{
										position: "fixed",
										height: "100%",
										width: "100%",
										top: 0,
										left: 0,
										display: "none",
										background: "rgba(0, 0, 0, 0.6)",
										zIndex: 2
									}}>
								</div>
							</>
							<Switch>
								{
									routes.map(route =>
										<Route key={route.link} path={route.link} >
											<LeftSidePane
												url={menuData.url}
												links={menuData.routes}
												ref={leftPaneRef}
												refs={menuNavRefs}
												backgroundRef={backgroundRef}
												handleNavClick={handleNavClick}
											/>
											<Suspense fallback={<Loading />} >
												<route.component
													handleNavClick={handleNavClick}
													menuData={menuData}
													navigationRef={navigationRef}
													module_id={route.module_id}
													loadingIndicatorRef={loadingIndicatorRef}
													leftNavRef={leftNavIconRef}
													setMenuData={setMenuData}
												/>
											</Suspense>
										</Route>
									)
								}
								<Redirect to="/" />
							</Switch>
						</>
					}
				</Switch>
			</NotificationContext.Provider>
		</WebSocketContext.Provider>
	);
};
export default SelectModule;
export const WebSocketContext = React.createContext();
export const NotificationContext = React.createContext();
