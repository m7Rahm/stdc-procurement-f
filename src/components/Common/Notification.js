import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import classes from "./Notification.module.css";

const Notification = (props) => {
  const notifPanelRef = useRef(null);
  return (
    <div ref={notifPanelRef} className={classes.notification_wrapper}>
      {props.notifications.map((notification) => (
        <NotificationItem
          key={notification.content}
          parentRef={notifPanelRef}
          setNotifications={props.setNotifications}
          content={notification.content}
        />
      ))}
    </div>
  );
};
export default Notification;

const NotificationItem = (props) => {
  useEffect(() => {
    setTimeout(() => {
      props.parentRef.current.classList.add(classes["remove-notif"]);
      props.parentRef.current.addEventListener(
        "animationend",
        () =>
          props.setNotifications((prev) =>
            prev.filter((elem) => elem.content === props.content)
          ),
        false
      );
    }, 2000);
  }, [props.parentRef, props.setNotifications, props.content]);
  return (
    <div className={classes.notification_bar}>
      <Link className={classes.text}>{props.content}</Link>
      <div className={classes.exit_button}>X</div>
    </div>
  );
};
