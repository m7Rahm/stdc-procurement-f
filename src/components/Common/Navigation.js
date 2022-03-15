import React, { lazy, useContext, useEffect, useRef, useState } from 'react'
import { IoMdMenu } from 'react-icons/io';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md'
import logo from '../../logo.svg';
import { Suspense } from 'react';
import useFetch from '../../hooks/useFetch';
import { NotificationContext } from '../../pages/SelectModule';
import { app_routes } from '../../data/data';
import { constr_notif_text } from '../../data/helpers';
const ProfileInfo = lazy(() => import("./ProfileInfo"))
const Navigation = (props, ref) => {
    const moduleNavigationRef = useRef(null);
    const update = useRef(true);
    const history = useHistory();
    const location = useLocation();
    const from = useRef(0);
    const createNewNotification = useContext(NotificationContext);
    const [notifications, setNotifications] = useState({ all: [], visible: [], offsetStart: 0, offsetEnd: 0, count: '', height: 0 })
    const notificationsRef = useRef(null);
    const delimterRef = useRef(null);
    const [profileData, setProfileData] = useState({ visible: false })
    const fetchNotifications = useFetch("GET");
    useEffect(() => {
        const handleInAppEvent = event => {
            const { docType, tranid, categoryid } = event.detail;
            const key = `${categoryid}-${docType}`;
            if (props.menuNavRefs.current[key]) {
                const prev = Number(props.menuNavRefs.current[key].innerHTML);
                if (prev - 1 > 0)
                    props.menuNavRefs.current[key].innerHTML = prev - 1;
                else
                    props.menuNavRefs.current[key].style.display = "none"
            }
            setNotifications(prev => {
                const all = prev.all.map(notif => notif.tran_id === tranid && notif.doc_type === docType && notif.category_id === categoryid ? { ...notif, is_read: 1 } : notif);
                const visible = prev.all.slice(prev.offsetStart, prev.offsetEnd)
                return { ...prev, all, visible, count: prev.count - 1 <= 0 ? "" : prev.count - 1 }
            })
        }
        window.addEventListener("inAppEvent", handleInAppEvent, false);
        props.webSocket.onmessage = (data) => {
            const webSockMessage = JSON.parse(data.data);
            const { mt: message_type, nt: notif_type, m: module_id, s: sub_module_id, d: doc_type, data: message_data, snn: sender_full_name } = webSockMessage;
            const key = `${module_id}-${sub_module_id}`
            const event_name = message_type === "notification" ? key : message_type;
            if (event_name !== "recognition") {
                const event = new CustomEvent(event_name, {
                    detail: { data: message_data }
                });
                window.dispatchEvent(event);
            }
            if (message_type === "notification") {
                const text = constr_notif_text(doc_type, notif_type, message_data.action, message_data.doc_number);
                const module = app_routes[module_id].link;
                const sub_module = app_routes[module_id].subs[sub_module_id];
                createNewNotification(sender_full_name, text, module + sub_module + "/" + message_data.tran_id)
                if (props.menuNavRefs.current[key]) {
                    const prev = Number(props.menuNavRefs.current[key].innerHTML);
                    if (props.menuNavRefs.current[key].style.display === "none") {
                        props.menuNavRefs.current[key].innerHTML = "1";
                        props.menuNavRefs.current[key].style.display = "inline"
                    }
                    else
                        props.menuNavRefs.current[key].innerHTML = prev + 1;
                }
                if (notificationsRef.current.style.display !== "block")
                    setNotifications(prev => {
                        update.current = true;
                        return ({ ...prev, count: Number(prev.count + 1) })
                    })
                else {
                    fetchNotifications(`/api/notifications?from=0&active=1`)
                        .then(respJ => {
                            if (respJ.length !== 0) {
                                setNotifications(prev => {
                                    const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                                    const all = [...newNotifications, ...respJ]
                                        .sort((a, b) => a.id < b.id)
                                        .map((notification, index) => ({ ...notification, offset: index * 62 }));
                                    const height = all.length * 62;
                                    return { ...prev, all: all, visible: all.slice(prev.offsetStart, prev.offsetEnd), height: height, count: newNotifications[0].total_count }
                                })
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
                if (mounted)
                    setNotifications(prev => ({ ...prev, count: respJ[0].total_count === 0 ? "" : respJ[0].total_count }))
            })
            .catch(ex => console.log(ex))
        const intersectionCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchNotifications(`/api/notifications?from=${from.current * 14}&active=1`)
                        .then(respJ => {
                            update.current = false;
                            if (respJ.length && mounted) {
                                const fromIndex = from.current;
                                from.current += 1;
                                setNotifications(prev => {
                                    const fetched = respJ
                                        .filter(fetchedNotif => !prev.all.find(notif => fetchedNotif.id === notif.id))
                                        .map((notif, index) => ({
                                            ...notif,
                                            offset: (fromIndex !== 0 ? prev.height : 0) + index * 62
                                        }));
                                    const newState = [...prev.all, ...fetched];
                                    const visible = newState.filter(notif => notif.offset < 604);
                                    return ({
                                        ...prev,
                                        all: newState,
                                        visible: fromIndex === 0 ? visible : prev.visible,
                                        offsetEnd: fromIndex === 0 ? visible.length : prev.offsetEnd,
                                        height: newState.length * 62
                                    })
                                });
                            } else {
                                observer.unobserve(delimterRef.current)
                            }
                        })
                }
            });
        }
        const delimeterRef = delimterRef.current;
        const intersectionObserver = new IntersectionObserver(intersectionCallback, {
            root: notificationsRef.current,
            rootMargin: "100px"
        });
        intersectionObserver.observe(delimterRef.current)
        return () => {
            intersectionObserver.unobserve(delimeterRef);
            mounted = false
        }
    }, [fetchNotifications]);
    const handleIconClick = () => {
        moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block' ? 'none' : 'block'
    }
    const handleNotificationsClick = () => {
        if (update.current) {
            fetchNotifications(`/api/notifications?from=0&active=1`)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setNotifications(prev => {
                            const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                            const all = [...newNotifications, ...respJ]
                                .sort((a, b) => a.id < b.id)
                                .map((notification, index) => ({ ...notification, offset: index * 62 }));
                            const height = all.length * 62;
                            const end = prev.offsetEnd === 0 ? all.length - 1 : prev.offsetEnd
                            return { ...prev, all: all, height: height, visible: all.slice(prev.offsetStart, end), offsetEnd: end, count: respJ[0].total_count <= 0 ? "" : respJ[0].total_count }
                        })
                    }
                })
                .catch(ex => console.log(ex))
        }
        notificationsRef.current.style.display = notificationsRef.current.style.display === "block" ? "none" : "block"
    }
    const pushHistory = (notification) => {
        let module = "/orders";
        let subModule = "";
        if (notification.category_id > 2) {
            module = notification.category_id === 3
                ? "/tender"
                : "/contracts";
            subModule = notification.doc_type === 0 ? "/orders" : ""
        } else {
            subModule = notification.doc_type === 0 && notification.category_id === 1
                ? "/visas?"
                : notification.doc_type === 0 && notification.category_id === 2 && notification.action !== 2
                    ? "/my-orders?"
                    : notification.doc_type === 0 && notification.category_id === 2 && notification.action === 2
                        ? "/returned?"
                        : notification.doc_type === 1
                            ? "/agreements?"
                            : notification.doc_type === 2
                                ? "/contracts?"
                                : "/payments?"
        }
        const { tran_id: tranid, doc_number: docNumber } = notification;

        let link = module + subModule + `i=${tranid}&r=${notification.init_id}`
        if (notification.category_id === 10) {
            link = "/other?i=" + tranid + "&dt=" + notification.doc_type
        }
        history.push(link, { tranid, initid: notification.init_id, docNumber: docNumber });
    }
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setNotifications(prev => {
            let indexStart = prev.all.findIndex(notif => notif.offset >= scrollTop);
            indexStart = indexStart >= 2 ? indexStart - 2 : 0;
            let indexEnd = prev.all.findIndex(notif => notif.offset >= scrollTop + 500);
            indexEnd = indexEnd === -1 ? prev.all.length : indexEnd + 2;
            const visible = prev.all.slice(indexStart < 0 ? 0 : indexStart, indexEnd);
            return { ...prev, visible: visible, offsetStart: indexStart < 0 ? 0 : indexStart, offsetEnd: indexEnd }
        })
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
            const key = `${notif.category_id}-${notif.doc_type}`;
            if (props.menuNavRefs.current[key]) {
                const prev = Number(props.menuNavRefs.current[key].innerHTML);
                if (prev - 1 > 0)
                    props.menuNavRefs.current[key].innerHTML = prev - 1;
                else
                    props.menuNavRefs.current[key].style.display = "none"
            }
            fetchNotifications(`/api/update-notifcation-state/${notif.id}`)
                .then(respJ => {
                    if (respJ.length === 0)
                        setNotifications(prev => {
                            const all = prev.all.map(notification => notification.id === notif.id ? ({ ...notification, is_read: true }) : notification);
                            const visible = all.slice(prev.offsetStart, prev.offsetEnd)
                            return { ...prev, all, visible, count: prev.count !== 0 && prev.count !== "" ? prev.count - 1 : "" }
                        })
                })
                .catch(ex => console.log(ex))
        }
        pushHistory(notif)
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
                            <div style={{ position: "absolute", right: "10px" }}>
                                <div className="notifications-container" style={{ display: "none", marginTop: '10px' }} onScroll={handleScroll} ref={notificationsRef}>
                                    <ul style={{ height: `${notifications.height}px` }}>
                                        {
                                            notifications.visible.map(notification =>
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
                                                        {getNotifText(notification)}
                                                    </div>
                                                    <span>{notification.date_time}</span>
                                                </li>
                                            )
                                        }
                                        <div ref={delimterRef} style={{ position: "absolute", top: `${notifications.height}px`, opacity: 0 }}>delimiter</div>
                                    </ul>
                                </div>
                            </div>
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
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default React.forwardRef(Navigation)

const getNotifText = (notif) => {
    let text = notif.doc_type === 2
        ? "Müqavilə Razılaşması"
        : notif.doc_type === 1
            ? "Qiymət Təklifi Araşdırması"
            : notif.doc_type === 3
                ? "Ödəniş Razılaşması"
                : "Sifariş"
    if (notif.category_id === 10) {
        text = notif.doc_type === 1
            ? "Büdcə Artırılması Razılaşması"
            : notif.doc_type === 2
                ? "Silinmə Sənədi"
                : ""
    }
    if (notif.category_id === 1 || notif.category_id === 10)
        return <> Yeni {text}</>
    else if (notif.category_id === 2)
        return (
            <>
                № <span style={{ color: 'tomato' }}>{notif.doc_number}</span> sənəd {
                    notif.action === 1
                        ? 'təsdiq edildi'
                        : notif.action === 2
                            ? "redaktəyə qaytarıldı"
                            : notif.action === 3
                                ? "redaktə edildi"
                                : notif.action === -1
                                    ? "etiraz edildi"
                                    : "ləğv edildi"
                }
            </>
        )
}