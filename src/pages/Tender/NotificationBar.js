import classes from "./NotificationBar.module.css";
import { useState } from "react";
import AuthContext from "./auth-context";
const NotificationBar = (props) => {
  const [notifState, setNotif] = useState("");
  const popUpHandler = () => {
    setNotif(".display_hide");
  };
  return (
      <AuthContext.Provider clickHandler={popUpHandler} >
    <div
      className={`${classes["notification_bar"]}  ${classes[notifState]}`}
   
    >
      <div className={classes.text}>{props.notifText}</div>

      <button className={classes.exit_button}>X</button>
    </div>
    </AuthContext.Provider>
  );
};
export default NotificationBar;
