import React, { useRef, useState } from 'react'
import { GoChevronDown } from 'react-icons/go'
import SearchBox from './SearchBox';
import useFetch from '../../hooks/useFetch';
const IconsPanel = (props) => {
    const searchBoxRef = useRef(null);
    const priorityRef = useRef({ style: { display: 'none' } })
    const {
        updateList,
        checkedAmountRef,
        setVisas,
        iconsVisible,
        searchParamsRef,
        activePageRef
    } = props;
    const [searchBoxState, setSearchBoxState] = useState(false);
    const fetchPost = useFetch("POST")
    const setBulkPriority = (e, priority) => {
        e.stopPropagation();
        priorityRef.current.classList.remove("visible");
        const data = {
            visaCards: checkedAmountRef.current.map(id =>
                [id, 0, priority]),
            update: 1
        }
        fetchPost(`/api/change-visa-state`, data)
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setVisas({ count: totalCount, visas: respJ });
            })
            .catch(error => console.log(error));
    }
    const onAdvSearchClick = () => {
        if (!searchBoxState)
            setSearchBoxState(true);
        else if (searchBoxRef.current.style.display === 'none') {
            searchBoxRef.current.classList.remove('advanced-search-bar-hide');
            searchBoxRef.current.style.display = 'block';
        }
        else {
            searchBoxRef.current.classList.add('advanced-search-bar-hide')
        }
    }

    const priorityClickHandler = () => {
        priorityRef.current.classList.toggle("visible")
    }
    const handleFocusLose = (e) => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !relatedTarget.classList.contains("priority"))
            priorityRef.current.classList.remove("visible")
    }
    return (
        <>
            {
                iconsVisible ?
                    <>
                        <div
                            onClick={priorityClickHandler}
                            className="priorities-list"
                            tabIndex="0"
                            onBlur={handleFocusLose}
                        >
                            Prioriteti dəyiş
                            <ul className="priorities-list" ref={priorityRef}>
                                <li className="priority" onBlur={handleFocusLose} tabIndex="1" onClick={(e) => setBulkPriority(e, 1)} >Yüksək</li>
                                <li className="priority" onBlur={handleFocusLose} tabIndex="2" onClick={(e) => setBulkPriority(e, 2)} >Orta</li>
                                <li className="priority" onBlur={handleFocusLose} tabIndex="3" onClick={(e) => setBulkPriority(e, 3)} >Aşağı</li>
                                <li className="priority" onBlur={handleFocusLose} tabIndex="4" onClick={(e) => setBulkPriority(e, 0)}>Prioriteti sil</li>
                            </ul>
                        </div>
                    </>
                    : <div>
                        <GoChevronDown size="24" onClick={onAdvSearchClick} />
                        {
                            searchBoxState &&
                            <SearchBox
                                searchParamsRef={searchParamsRef}
                                setVisas={setVisas}
                                updateList={updateList}
                                activePageRef={activePageRef}
                                ref={searchBoxRef}
                            />
                        }
                    </div>
            }
        </>
    )
}
export default IconsPanel