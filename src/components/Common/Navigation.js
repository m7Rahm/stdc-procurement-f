import React, { lazy, useContext, useEffect, useRef, useState } from 'react'
import { IoMdMenu } from 'react-icons/io';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md'
import logo from '../../logo.svg';
import { Suspense } from 'react';
import useFetch from '../../hooks/useFetch';
import { NotificationContext } from '../../pages/SelectModule';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { get_notif_link, get_notif_text } from '../../data/helpers'
const ProfileInfo = lazy(() => import("./ProfileInfo"))
const Navigation = (props, ref) => {
    const moduleNavigationRef = useRef(null);
    const update_notifications = useRef(true);
    const update_messages = useRef(true);
    const history = useHistory();
    const location = useLocation();
    const from = useRef({ 0: 0, 1: 0 });
    const createNewNotification = useContext(NotificationContext);
    const [notifications, setNotifications] = useState({ all: [], visible: [], offsetStart: 0, offsetEnd: 0, count: '', height: 0 })
    const [messages, setMessages] = useState({ all: [], visible: [], offsetStart: 0, offsetEnd: 0, count: '', height: 0 })
    const notificationsRef = useRef(null);
    const intersectionObserver = useRef(null);
    const notificationsDelimeterRef = useRef(null);
    const messagesDelimeterRef = useRef(null);
    const [category, set_category] = useState(null);
    const [profileData, setProfileData] = useState({ visible: false })
    const fetchNotifications = useFetch("GET");
    useEffect(() => {
        const handleInAppEvent = event => {
            const { tran_id, module_id, sub_module_id, doc_type } = event.detail;
            const key = `${module_id}-${sub_module_id}`;
            if (props.menuNavRefs.current[key]) {
                const prev = Number(props.menuNavRefs.current[key].innerHTML);
                if (prev - 1 > 0)
                    props.menuNavRefs.current[key].innerHTML = prev - 1;
                else
                    props.menuNavRefs.current[key].style.display = "none"
            }
            setMessages(prev => {
                const message = prev.all.find(message => message.tran_id === tran_id && message.doc_type === doc_type && message.category_id === module_id)
                let all = prev.all;
                let visible = prev.visible;
                if (message) {
                    all = prev.all.map(mess => mess.id === message.id ? { ...mess, is_read: 1 } : mess);
                    visible = prev.all.slice(prev.offsetStart, prev.offsetEnd)
                }
                return { ...prev, all, visible, count: prev.count - 1 <= 0 ? "" : prev.count - 1 }
            })
        }
        window.addEventListener("inAppEvent", handleInAppEvent, false);
        props.webSocket.onmessage = (data) => {
            const webSockMessage = JSON.parse(data.data);
            const event_name = webSockMessage.type !== 2 && webSockMessage.type !== -1 ? `${webSockMessage.module}-${webSockMessage.sub_module}` : webSockMessage.type;
            if (webSockMessage.type !== -1) {
                const event = new CustomEvent(event_name, {
                    detail: { data: webSockMessage.data }
                });
                window.dispatchEvent(event);
                const { module, sub_module, type, doc_type, tran_id, notify } = webSockMessage
                const key = `${module}-${sub_module}`
                if (type === 0) {
                    const route = get_notif_link(module, sub_module, tran_id)
                    const text = get_notif_text({ doc_type, type, action: webSockMessage.action, doc_number: webSockMessage.doc_number })
                    createNewNotification(text, route.module + route.sub_module + route.query)
                }
                if (props.menuNavRefs.current[key]) {
                    const prev = Number(props.menuNavRefs.current[key].innerHTML);
                    if (props.menuNavRefs.current[key].style.display === "none") {
                        props.menuNavRefs.current[key].innerHTML = "1";
                        props.menuNavRefs.current[key].style.display = "inline"
                    } else
                        props.menuNavRefs.current[key].innerHTML = prev + 1;
                }
                if (notificationsRef.current.style.display !== "block") {
                    if (type === 1) {
                        update_notifications.current = true;
                        if (notify !== false)
                            setNotifications(prev => ({ ...prev, count: Number(prev.count + 1) }))
                    } else if (type === 0) {
                        update_messages.current = true;
                        if (notify !== false)
                            setMessages(prev => ({ ...prev, count: Number(prev.count + 1) }))
                    }
                } else {
                    fetchNotifications(`/api/notifications?from=0&active=1&type=${type}`)
                        .then(respJ => {
                            const update_func = prev => {
                                const updated = prev.all.map(notif => {
                                    const updated_notif = respJ.find(incoming_notif => incoming_notif.id === notif.id)
                                    return updated_notif ? updated_notif : notif
                                })
                                const newNotifications = respJ.filter(new_notification => !updated.find(prev_notif => prev_notif.id === new_notification.id));
                                const all = [...newNotifications, ...updated]
                                    .sort((a, b) => a.id < b.id)
                                    .map((notification, index) => ({ ...notification, offset: index * 62 }));
                                const height = all.length * 62;
                                const count = newNotifications[0]?.total_count;
                                const end = prev.visible.length === prev.all.length ? all.length : prev.offsetEnd
                                return { ...prev, all: all, visible: all.slice(prev.offsetStart, end), height: height, count: count || prev.count }
                            }
                            if (respJ.length !== 0) {
                                if (type === 0)
                                    setMessages(update_func)
                                else if (type === 1)
                                    setNotifications(update_func)
                            }
                        })
                        .catch(ex => console.log(ex))
                }
            }
        }
        return () => {
            window.removeEventListener("inAppEvent", handleInAppEvent, false)
        }
    }, [props.webSocket, fetchNotifications, props.menuNavRefs, createNewNotification]);
    useEffect(() => {
        let mounted = true;
        fetchNotifications('/api/notifications?from=0')
            .then(respJ => {
                if (mounted) {
                    const message_count = respJ.find(notif => notif.type === 0)?.total_count;
                    const notif_count = respJ.find(notif => notif.type === 1)?.total_count;
                    setNotifications(prev => ({
                        ...prev,
                        count: notif_count || ""
                    }))
                    setMessages(prev => ({
                        ...prev,
                        count: message_count || "",
                    }))
                }

            })
            .catch(ex => console.log(ex));
        const intersection_callback = (prev, respJ, id) => {
            const fetched = respJ
                .filter(fetchedNotif => !prev.all.find(notif => fetchedNotif.id === notif.id))
                .map((notif, index) => ({
                    ...notif,
                    offset: (from.current[id] !== 0 ? prev.height : 0) + index * 62
                }));
            const newState = [...prev.all, ...fetched];
            const visible = newState.filter(notif => notif.offset < 604);
            return ({
                ...prev,
                all: newState,
                visible: from.current[id] === 0 ? visible : prev.visible,
                offsetEnd: from.current[id] === 0 ? visible.length : prev.offsetEnd,
                height: newState.length * 62
            })
        }
        const intersectionCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (id !== "") {
                        fetchNotifications(`/api/notifications?from=${from.current[id] * 14}&active=1&type=${id}`)
                            .then(respJ => {
                                if (id === "0")
                                    update_messages.current = false;
                                else update_notifications.current = false;
                                if (respJ.length && mounted) {
                                    from.current[id] += 1;
                                    if (id === "1") {
                                        setNotifications(prev => intersection_callback(prev, respJ, id));
                                    } else if (id === "0") {
                                        setMessages(prev => intersection_callback(prev, respJ, id))
                                    }
                                } else {
                                    observer.unobserve(entry.target)
                                }
                            })
                    }
                }
            });
        }
        intersectionObserver.current = new IntersectionObserver(intersectionCallback, {
            root: notificationsRef.current,
            rootMargin: "100px"
        });
        // intersectionObserverRef.observe(messagesDelimeter)
        // intersectionObserverRef.observe(notificationsDelimeter)
    }, [fetchNotifications]);
    useEffect(() => {
        const notificationsDelimeter = notificationsDelimeterRef.current;
        const messagesDelimeter = messagesDelimeterRef.current;
        const intersectionObserverRef = intersectionObserver.current
        if (category === 0) {
            intersectionObserverRef.unobserve(notificationsDelimeter)
            notificationsDelimeter.style.display = "none";
            messagesDelimeter.style.display = "block";
            intersectionObserverRef.observe(messagesDelimeter)
        }
        else if (category === 1) {
            intersectionObserverRef.observe(notificationsDelimeter)
            messagesDelimeter.style.display = "none";
            notificationsDelimeter.style.display = "block";
            intersectionObserverRef.unobserve(messagesDelimeter)
        }
        return () => {
            intersectionObserverRef.unobserve(notificationsDelimeter);
            intersectionObserverRef.unobserve(messagesDelimeter);
        }
    }, [category])
    const handleLogOut = () => {
        props.tokenContext[2]()
    }
    const handleIconClick = () => {
        moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block' ? 'none' : 'block'
    }
    const handleNotificationsClick = () => {
        if (update_notifications.current) {
            fetchNotifications(`/api/notifications?from=0&active=1&type=1`)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setNotifications(prev => {
                            const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                            const all = [...newNotifications, ...respJ]
                                .sort((a, b) => a.id < b.id)
                                .map((notification, index) => ({ ...notification, offset: index * 62 }));
                            const height = all.length * 62;
                            const end = prev.offsetEnd === 0 ? all.length : prev.offsetEnd;
                            const visible = all.slice(prev.offsetStart, end);
                            return {
                                ...prev,
                                all: all,
                                height: height,
                                visible: visible,
                                offsetEnd: end,
                                count: respJ[0].total_count <= 0 ? "" : respJ[0].total_count
                            }
                        })
                    }
                })
                .catch(ex => console.log(ex))
        }
        if (notificationsRef.current.id === "1") {
            notificationsRef.current.style.display = "none";
            notificationsRef.current.id = "";
        } else {
            notificationsRef.current.style.display = "block";
            notificationsRef.current.id = 1;
            set_category(1)
        }
    }
    const pushHistory = (notification) => {
        const { tran_id, doc_number } = notification;
        const route = get_notif_link(notification.category_id, notification.sub_category_id, tran_id)
        history.push(route.module + route.sub_module + route.query, { tran_id, doc_number });
    }
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        if (category === 1) {
            setNotifications(prev => {
                let indexStart = prev.all.findIndex(notif => notif.offset >= scrollTop);
                indexStart = indexStart >= 2 ? indexStart - 2 : 0;
                let indexEnd = prev.all.findIndex(notif => notif.offset >= scrollTop + 500);
                indexEnd = indexEnd === -1 ? prev.all.length : indexEnd + 2;
                const visible = prev.all.slice(indexStart < 0 ? 0 : indexStart, indexEnd);
                return { ...prev, visible: visible, offsetStart: indexStart < 0 ? 0 : indexStart, offsetEnd: indexEnd }
            })
        }
        else if (category === 0) {
            setMessages(prev => {
                let indexStart = prev.all.findIndex(notif => notif.offset >= scrollTop);
                indexStart = indexStart >= 2 ? indexStart - 2 : 0;
                let indexEnd = prev.all.findIndex(notif => notif.offset >= scrollTop + 500);
                indexEnd = indexEnd === -1 ? prev.all.length : indexEnd + 2;
                const visible = prev.all.slice(indexStart < 0 ? 0 : indexStart, indexEnd);
                return { ...prev, visible: visible, offsetStart: indexStart < 0 ? 0 : indexStart, offsetEnd: indexEnd }
            })
        }
    }
    const handleModuleClick = (path) => {
        moduleNavigationRef.current.style.display = "none"
        ref.current.style.opacity = "1"
        if (path !== location.pathname.substring(0, path.length)) {
            ref.current.style.transform = "translateX(-50%)"
        }
    }
    const onProfileClick = () => {
        setProfileData({ visible: true })
    }
    const onNotificationClick = (notif) => {
        if (!notif.is_read) {
            const key = `${notif.category_id}-${notif.sub_category_id}`;
            if (props.menuNavRefs.current[key]) {
                const prev = Number(props.menuNavRefs.current[key].innerHTML);
                if (prev - 1 > 0)
                    props.menuNavRefs.current[key].innerHTML = prev - 1;
                else
                    props.menuNavRefs.current[key].style.display = "none"
            }
            fetchNotifications(`/api/update-notifcation-state/${notif.id}`)
                .then(respJ => {
                    if (respJ.length === 0) {
                        if (notif.type === 1) {
                            setNotifications(prev => {
                                const all = prev.all.map(notification => notification.id === notif.id ? ({ ...notification, is_read: true }) : notification);
                                const visible = all.slice(prev.offsetStart, prev.offsetEnd);
                                return { ...prev, all, visible, count: prev.count !== 1 ? prev.count - 1 : "" }
                            })
                        } else {
                            setMessages(prev => {
                                const all = prev.all.map(notification => notification.id === notif.id ? ({ ...notification, is_read: true }) : notification);
                                const visible = all.slice(prev.offsetStart, prev.offsetEnd)
                                return { ...prev, all, visible, count: prev.count !== 1 ? prev.count - 1 : "" }
                            })
                        }
                    }
                })
                .catch(ex => console.log(ex))
        }
        pushHistory(notif)
    }
    const handleMessagesClick = () => {
        if (update_messages.current)
            fetchNotifications(`/api/notifications?from=0&active=1&type=0`)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setMessages(prev => {
                            const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                            const all = [...newNotifications, ...respJ]
                                .sort((a, b) => a.id < b.id)
                                .map((notification, index) => ({ ...notification, offset: index * 62 }));
                            const height = all.length * 62;
                            const end = prev.offsetEnd === 0 ? all.length : prev.offsetEnd;
                            const visible = all.slice(prev.offsetStart, end);
                            return {
                                ...prev,
                                all: all,
                                height: height,
                                visible: visible,
                                offsetEnd: end,
                                count: respJ[0].total_count <= 0 ? "" : respJ[0].total_count
                            }
                        })
                    }
                })
                .catch(ex => console.log(ex))
        if (notificationsRef.current.id === "0") {
            notificationsRef.current.style.display = "none"
            notificationsRef.current.id = "";
        }
        else {
            notificationsRef.current.style.display = "block"
            notificationsRef.current.id = 0;
            set_category(0)
        }
    }
    return (
        <nav ref={props.navigationRef}>
            <div className="loading-indicator">
                <div ref={ref} className="loaded"></div>
            </div>
            {
                profileData.visible &&
                <Suspense fallback="">
                    <ProfileInfo
                        fullName={props.userData.userInfo.fullName}
                        token={props.token}
                        setProfileData={setProfileData}
                    />
                </Suspense>
            }
            <ul>
                <li>
                    <div>
                        <div className="left-side-toggle" ref={props.leftNavRef}>
                            <IoMdMenu size="24" cursor="pointer" color="#606060" onClick={props.handleNavClick} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={handleNotificationsClick}>
                                <MdNotifications color="#61DAFB" size="32" />
                                {notifications.count}
                            </span>
                            <div style={{ position: "absolute", right: "0px" }}>
                                <div className="notifications-container" style={{ display: "none", marginTop: '10px' }} onScroll={handleScroll} ref={notificationsRef}>
                                    <ul style={{ height: `${category === 1 ? notifications.height : category === 0 ? messages.height : 0}px` }}>
                                        {
                                            category === 1
                                                ? notifications.visible.map(notification =>
                                                    <li
                                                        key={notification.id}
                                                        style={{
                                                            transform: `translateY(${notification.offset}px)`,
                                                            right: 0,
                                                            left: 0,
                                                            backgroundColor: notification.is_read ? "rgb(68 112 156)" : ""
                                                        }}
                                                        onClick={() => onNotificationClick(notification)}
                                                    >
                                                        <strong style={{ fontSize: "1.2rem" }}>{notification.full_name}</strong>
                                                        <br />
                                                        <div style={{ fontSize: "12px", paddingTop: "2px" }}>
                                                            {get_notif_text(notification)}
                                                        </div>
                                                        <span>{notification.date_time}</span>
                                                    </li>
                                                )
                                                : category === 0
                                                    ?
                                                    messages.visible.map(notification =>
                                                        <li
                                                            key={notification.id}
                                                            style={{
                                                                transform: `translateY(${notification.offset}px)`,
                                                                right: 0,
                                                                left: 0,
                                                                backgroundColor: notification.is_read ? "rgb(68 112 156)" : ""
                                                            }}
                                                            onClick={() => onNotificationClick(notification)}
                                                        >
                                                            <strong style={{ fontSize: "1.2rem" }}>{notification.full_name}</strong>
                                                            <br />
                                                            <div style={{ fontSize: "12px", paddingTop: "2px" }}>
                                                                {get_notif_text(notification)}
                                                            </div>
                                                            <span>{notification.date_time}</span>
                                                        </li>
                                                    )
                                                    : null
                                        }
                                        <div id="0" ref={messagesDelimeterRef} style={{ position: "absolute", top: ` ${messages.height}px`, opacity: 0 }}>delimiter</div>
                                        <div id="1" ref={notificationsDelimeterRef} style={{ position: "absolute", top: ` ${notifications.height}px`, opacity: 0 }}>delimiter</div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={handleMessagesClick}>
                                <FaEnvelopeOpenText color="#61DAFB" size="26px" />
                                <span style={{ position: "absolute", bottom: "-5px", fontSize: "12px" }}>{messages.count}</span>
                            </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <p className="profile" onClick={onProfileClick}>{props.userData.userInfo.fullName}</p>
                            <img style={{ height: '32px', cursor: 'pointer', width: '45px' }} onClick={handleIconClick} src={logo} alt='user pic' />
                            <ul ref={moduleNavigationRef} className="profile-icon">
                                {
                                    props.routes.map(module =>
                                        <li onClick={() => handleModuleClick(module.link)} key={module.link}>
                                            <Link to={module.link}>
                                                <div>
                                                    {module.text}
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
                                <li onClick={handleLogOut}>
                                    <div style={{ minWidth: '60px' }}>Çıxış</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default React.forwardRef(Navigation)
