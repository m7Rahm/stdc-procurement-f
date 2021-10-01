import React, { useRef, useState, useEffect } from 'react'
import Pagination from '../Misc/Pagination'
import CalendarUniversal from '../Misc/CalendarUniversal'
import { GoChevronDown } from 'react-icons/go'
import { BsArrowUpShort } from 'react-icons/bs'
import InputSearchList from '../Misc/InputSearchList'
import useFetch from '../../hooks/useFetch'
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const OrdersSearchHOC = (options = [], docTypes = [], with_departments) => function SearchBar(props) {
    const activePageRef = useRef(0);
    const advSearchRef = useRef(null);
    const iconRef = useRef(null);
    const [items, set_items] = useState([]);
    const departments = useRef([]);
    const notifIcon = useRef(null);
    const fetchGet = useFetch("GET");
    const modelListRef = useRef(null);
    const [searchBarState, setSearchBarState] = useState(false);
    const selectRef = useRef(null);
    const docTypesRef = useRef(null);
    const inputNumberRef = useRef(null);
    const material_name_ref = useRef(null);
    const department_ref = useRef(0);
    const searchStateRef = useRef({
        ...props.initData,
        startDate: '',
        endDate: '',
        number: ''
    });
    const time_out_ref = useRef(null);
    useEffect(() => {
        if (props.newDocNotifName) {
            const showNotificationIcon = () => {
                notifIcon.current.style.display = "block";
            }
            window.addEventListener(props.newDocNotifName, showNotificationIcon, false)
            return () => window.removeEventListener(props.newDocNotifName, showNotificationIcon)
        }
    }, [props.newDocNotifName]);
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController()
        if (with_departments)
            fetchGet('/api/departments', abortController)
                .then(respJ => {
                    if (mounted) {
                        set_items(respJ)
                        departments.current = respJ;
                    }
                })
                .catch(err => console.log(err));
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [fetchGet])
    const handleInputChange = (name, value, immedaite = false) => {
        searchStateRef.current[name] = value;
        if (immedaite) {
            paginate(0, false, 0)
        }
    }
    const showSearchBar = () => {
        if (advSearchRef.current) {
            advSearchRef.current.style.animation = 'visibility-hide 0.2s ease-in both';
            iconRef.current.style.transform = 'rotate(0deg)'
            advSearchRef.current.addEventListener('animationend', () => {
                setSearchBarState(false);
            })
        }
        else {
            iconRef.current.style.transform = 'rotate(180deg)'
            setSearchBarState(true);
        }
    }
    const refreshList = (from, update_search_bar) => {
        const searchData = { ...searchStateRef.current, from, number: inputNumberRef.current.value };
        if (material_name_ref.current.value) {
            searchData.material_name = material_name_ref.current.value;
        }
        if (selectRef.current)
            searchData.result = selectRef.current.value;
        if (docTypesRef.current)
            searchData.docType = docTypesRef.current.value;
        if (with_departments)
            searchData.department_id = department_ref.current
        props.updateList(searchData)
        if (update_search_bar) {
            props.setInitData(searchData)
        }
    }
    const paginate = (from, update_search_bar, timeout = 0) => {
        if (time_out_ref.current) {
            clearTimeout(time_out_ref.current)
        }
        time_out_ref.current = setTimeout(() => {
            refreshList(from, update_search_bar)
        }, timeout);
    }
    const onNotifIconClick = () => {
        notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
        const onAnimationEnd = () => {
            notifIcon.current.style.display = 'none';
            notifIcon.current.style.animation = 'anim-up-to-down 1.5s ease-in both';
            notifIcon.current.removeEventListener('animationend', onAnimationEnd)
        }
        notifIcon.current.addEventListener('animationend', onAnimationEnd, false);
        props.updateList(props.initData)
    }
    const setItem = (e, item, inputRef) => {
        inputRef.current.value = item.name;
        department_ref.current = item.id;
        paginate(0, false, 0)
    }
    const handleInputSearch = (e) => {
        const value = e.target.value;
        const reg_exp = new RegExp(value, "ig");
        if (value === "" && department_ref.current) {
            department_ref.current = 0;
            paginate(0, false, 0);
        }
        set_items(departments.current.filter(department => reg_exp.test(department.name)))
    }
    const handle_input_change = () => {
        paginate(0, false, 500);
    }
    return (
        <>
            <div>
                <div>
                    <div onClick={showSearchBar} style={{ transition: 'all 0.4s', transformOrigin: 'center', float: 'right', cursor: 'pointer' }} ref={iconRef}>
                        <GoChevronDown size="24" color="steelblue" />
                    </div>
                    {
                        searchBarState &&
                        <div ref={advSearchRef} className="adv-search-box" style={{ padding: '20px 10px' }}>
                            {
                                with_departments &&
                                <div style={{ position: 'relative', marginBottom: "10px" }}>
                                    <InputSearchList
                                        listid="modelListRef"
                                        disabled={props.disabled}
                                        defaultValue={items.find(dep => dep.id === props.initData.department_id)?.name}
                                        placeholder="Şöbələr üzrə axtarış"
                                        listRef={modelListRef}
                                        name="model"
                                        text="name"
                                        style={{ top: "46px", with: "100%" }}
                                        items={items}
                                        inputStyle={{ width: "100%", border: "none", padding: "6px" }}
                                        handleInputChange={handleInputSearch}
                                        handleItemClick={setItem}
                                    />
                                </div>
                            }
                            <div style={{ marginBottom: '10px' }} className="doc-number-container">
                                <input name="number" defaultValue={props.initData.number} onChange={handle_input_change} ref={inputNumberRef} placeholder="Sənəd nömrəsi üzrə axtarış" />
                            </div>
                            <div style={{ marginBottom: '10px' }} className="doc-number-container">
                                <input name="material-name" defaultValue={props.initData.material_name} onChange={handle_input_change} ref={material_name_ref} placeholder="Məhsul üzrə axtarış" />
                            </div>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', position: 'relative' }}>
                                <CalendarUniversal
                                    year={year}
                                    month={month}
                                    placeholder="Tarixdən"
                                    name="startDate"
                                    handleInputChange={handleInputChange}
                                />
                                <CalendarUniversal
                                    year={year}
                                    month={month}
                                    placeholder="Tarixədək"
                                    name="endDate"
                                    handleInputChange={handleInputChange}
                                />
                            </div>
                            {
                                options.length !== 0 &&
                                <select defaultValue="0" style={{ padding: '6px 0px', float: 'left' }} ref={selectRef}>
                                    {
                                        options.map(option =>
                                            <option key={option.val} value={option.val}>{option.text}</option>
                                        )
                                    }
                                </select>
                            }
                            {
                                docTypes.length !== 0 &&
                                <select defaultValue="0" style={{ padding: '6px 0px', float: 'right', margin: "0px 5px" }} ref={docTypesRef}>
                                    {
                                        docTypes.map(option =>
                                            <option key={option.val} value={option.val}>{option.text}</option>
                                        )
                                    }
                                </select>
                            }
                            {/* <div className="search-ribbon">
                                <div onClick={handleSearchClick}>Axtar</div>
                                <div onClick={resetState}>Filteri təmizlə</div>
                            </div> */}
                        </div>
                    }
                </div>
            </div>
            <div onClick={onNotifIconClick} ref={notifIcon} style={{ display: "none" }} className="new-visa-notification">
                <span >
                    <span style={{ verticalAlign: "middle" }}>
                        <BsArrowUpShort color="#00acee" size="24" style={{ marginRight: '8px', color: "white" }} />
                    </span>
                    Yeni bildiriş
                </span>
            </div>
            {props.children}
            <Pagination
                count={props.count}
                activePageRef={activePageRef}
                updateList={paginate}
            />
        </>
    )
}
export default OrdersSearchHOC
