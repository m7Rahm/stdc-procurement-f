import { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useHistory } from "react-router-dom";
import classes from "./Notification.module.css";
const Notifications = (props) => {
  const setNotifications = props.setNotifications;
  const timeoutRef = useRef(null);
  const notificationWrapperRef = useRef(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (props.notifications.length >= 1) {
      timeoutRef.current = setTimeout(function () {
        const key = props.notifications[0].key;
        const elem = props.notificationsRef.current[key];

        if (elem.classList.contains(classes["fadeinanimation"])) {
          elem.classList.replace(
            classes["fadeinanimation"],
            classes["fadeoutanimation"]
          );
        } else if (elem.classList.contains(classes["initialanimation"])) {
          elem.classList.replace(
            classes["initialanimation"],
            classes["fadeoutanimation"]
          );
        }

        elem.addEventListener(
          "animationend",
          () => {
            if (props.notifications.length > 1) {
              const key2 = props.notifications[1].key;
              const elem2 = props.notificationsRef.current[key2];

              elem2.classList.replace(
                classes["fadeinanimation"],
                classes["initialanimation"]
              );
            }
            setNotifications((prev) => prev.filter((_, index) => index !== 0));
          },
          false
        );
      }, 2000);
    }
  });
  return (
    <div
      ref={notificationWrapperRef}
      className={`${classes.notification_wrapper}`}
    >
      {props.notifications.map((notification) => (
        <Notification
          intervallyRemover={setInterval}
          key={notification.key}
          id={notification.key}
          notificationsRef={props.notificationsRef}
          refer={notification.ref}
          to={notification.link}
          closeNotification={props.closeNotification}
          notification={notification}
        />
      ))}
    </div>
  );
};
const Notification = (props) => {
  const history = useHistory();
  const navigateTo = () => {
    history.push(props.to)
  }
  return (
    <div
      ref={(elem) => (props.notificationsRef.current[props.id] = elem)}
      className={`${classes.notification_bar} ${classes.fadeinanimation} `}
    >
      <div className={classes["text"]} onClick={navigateTo}>
        {props.notification.content}
      </div>
      <div
        className={classes.exit_button}
        onClickCapture={props.closeNotification}
        id={props.id}
      >
        <MdClose size="20" />
      </div>
    </div>
  );
};

export default Notifications;
