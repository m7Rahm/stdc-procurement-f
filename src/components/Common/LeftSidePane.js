import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdMenu } from 'react-icons/io'
const icon = (Icon, active) => ({ ...props }) =>
    <Icon color={active ? "red" : '#808080'} {...props} />

const getStyle = (active) => {
    const style = active
        ? {
            background: 'rgba(0, 0, 0, 0.1)',
            color: 'black',
            boxShadow: "0px 2px 5px #AAA, 0px -2px 5px #AAA"
        }
        : {}
    return style
}
const LeftSidePane = (props, ref) => {
    const [activeLink, setActiveLink] = useState(0);
    const handleNavClick = props.handleNavClick;
    useEffect(() => {
        const escPress = (e) => {
            if (e.keyCode === 27 && ref.current.classList.contains("left-side-pane-open")) {
                ref.current.classList.remove("left-side-pane-open");
                props.backgroundRef.current.style.display = "none"
            }
        }
        document.addEventListener("keyup", escPress, false)
        return () => {
            document.removeEventListener("keyup", escPress, false)
        }
    }, [props.backgroundRef, ref])
    return (
        <div ref={ref} className="left-side-pane">
            <div>
                <div>
                    <IoMdMenu size="24" cursor="pointer" color="white" onClick={handleNavClick} />
                </div>
            </div>
            <div>
                <div>
                    {
                        props.links.map((link, index) => {
                            const active = index === activeLink ? true : false
                            const Icon = icon(link.icon, active)
                            return <div key={index} style={getStyle(active)} >
                                <Link
                                    onClick={() => {
                                        setActiveLink(index);
                                        handleNavClick();
                                    }}
                                    style={{ cursor: "pointer", color: active ? '#222222' : '', fontWeight: active ? 600 : '', display: 'flex', width: '100%', alignItems: 'flex-end' }}
                                    to={`${props.url}${link.link}`}>
                                    <Icon size="24" style={{ marginRight: '5px' }} />
                                    {link.text}
                                </Link>
                                {
                                    <span
                                        ref={element => { if (link.categoryid) props.refs.current[`${link.categoryid}-${link.docType}`] = element }}
                                        style={{
                                            background: "#123456",
                                            padding: "2px 0.5rem",
                                            marginRight: "1rem",
                                            fontWeight: 600,
                                            height: "19px",
                                            color: "white",
                                            display: link.notifCount ? "inline" : "none",
                                            borderRadius: "50%"
                                        }}
                                    >
                                        {link.notifCount}
                                    </span>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(LeftSidePane)