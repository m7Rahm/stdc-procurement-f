import { indexOf } from "lodash";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import classes from "./Notification.module.css";
const Notifications = (props) => {
  const setNotifications = props.setNotifications;
  const timeoutRef = useRef(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (props.notifications.length) {
      timeoutRef.current = setTimeout(function () {
        setNotifications((prev) => prev.filter((_, index) => index !== 0));
      }, 2000);
    }
  });
  return (
    <div className={classes.notification_wrapper}>
      {props.notifications.map((notification, a) => (
        <Notification
          intervallyRemover={setInterval}
          key={notification.key}
          id={notification.key}
          buttonHandler={props.buttonHandler}
          notification={notification}
        />
      ))}
      ;
    </div>
  );
};
const Notification = (props) => {
  return (
    <div className={classes.notification_bar}>
      <Link className={classes.text}>{props.notification.content}</Link>
      <div
        className={classes.exit_button}
        onClick={props.buttonHandler}
        id={props.id}
      >
        X
      </div>
    </div>
  );
};

export default Notifications;
