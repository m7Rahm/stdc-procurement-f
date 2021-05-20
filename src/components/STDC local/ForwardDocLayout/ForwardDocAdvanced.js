import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import useFetch from './useFetch';
import VisaForwardPerson from './VisaForwardPerson'
import "./ForwardDocAdvanced.css"
const ForwardDocAdvanced = (props) => {
    const { handleSendClick, textareaVisible = true } = props;
    const [empList, setEmpList] = useState(['asd']);
    const [departments, setDepartments] = useState([{'id':'asd','name':'asd'},{'id':'asfasfd','name':'asfa'}]);
    const searchInputRef = useRef(null);
    const allGroupsRef = useRef([]);
    const [checked, setChecked] = useState(false);
    const selectRef = useRef(null);
    const empListRef = useRef(null);
    const textareaRef = useRef(null);
    const fetchGet = useFetch("GET");

    // useLayoutEffect(() => {
    //     let mounted = true;
    //     const abortController = new AbortController();
    //     if (mounted)
    //         fetchGet('/api/emplist', abortController)
    //             .then(respJ => {
    //                 if (mounted) {
    //                     empListRef.current = respJ;
    //                     setEmpList(respJ);
    //                 }
    //             })
    //             .catch(err => console.log(err));
    //     return () => {
    //         mounted = false;
    //         abortController.abort();
    //     }
    // }, [fetchGet]);

    // useLayoutEffect(() => {
    //     let mounted = true;
    //     const abortController = new AbortController()
    //     if (mounted)
    //         fetchGet('/api/departments', abortController)
    //             .then(respJ => {
    //                 if (mounted) {
    //                     setDepartments(respJ)
    //                 }
    //             })
    //             .catch(err => console.log(err));
    //     return () => {
    //         mounted = false;
    //         abortController.abort();
    //     }
    // }, [fetchGet]);

    // useEffect(() => {
    //     let mounted = true;
    //     const abortController = new AbortController();
    //     if (checked && allGroupsRef.current.length === 0 && mounted) {
    //         fetchGet("/api/roles", abortController)
    //             .then(respJ => {
    //                 const groups = respJ
    //                     .filter(group => group.active_passive === 1)
    //                     .map(group => ({ id: group.id, full_name: group.name }));
    //                 allGroupsRef.current = groups;
    //                 setEmpList(groups);
    //             })
    //             .catch(ex => console.log(ex))
    //     }
    //     return () => {
    //         mounted = false;
    //         abortController.abort();
    //     }
    // }, [fetchGet, checked])


    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        let searchResult
        if (!checked) {
            searchResult = empListRef.current.filter(emp => {
                if (selectRef.current && selectRef.current.value !== "-1")
                    return emp.full_name.toLowerCase().includes(str) && emp.structure_dependency_id === Number(selectRef.current.value);
                else
                    return emp.full_name.toLowerCase().includes(str)
            });
        } else {
            searchResult = allGroupsRef.current.filter(group => group.full_name.toLowerCase().includes(str))
        }
        setEmpList(searchResult);
    }

    const handleStructureChange = (e) => {
        const value = Number(e.target.value);
        setEmpList(value !== -1 ? empListRef.current.filter(employee => employee.structure_dependency_id === value) : empListRef.current);
    }

    const handleSelectChange = (employee) => {
        const res = props.receivers.find(emp => emp.id === employee.id);
        const newReceivers = !res ? [...props.receivers, employee] : props.receivers.filter(emp => emp.id !== employee.id);
        props.setReceivers(newReceivers);
        searchInputRef.current.value = ""
    }

    const handleCheckChange = () => {
        searchInputRef.current.value = "";
        setChecked(prev => {
            if (!prev) {
                setEmpList(allGroupsRef.current)
            } else {
                setEmpList(empListRef.current)
            }
            return !prev
        });
    }

    return (
        <div style={{ padding: '10px 20px'}} className="flex flex-jc-c">

            <ForwardedPeople
                receivers={props.receivers}
                setReceivers={props.setReceivers}
                handleSelectChange={handleSelectChange}
            />

            <div style={{ marginTop: '20px',marginLeft:'100px' }} id="procurement-edit-section">

                <div style={{ minHeight: '100px', minWidth: "250px" }}>
                    {
                        !checked &&
                        <select ref={selectRef} style={{ height: '30px' }} onChange={handleStructureChange}>
                            <option value="-1">-</option>
                            {
                                departments.map(structure =>
                                    <option key={structure.id} value={structure.id}>{structure.name}</option>
                                )
                            }
                        </select>
                    }
                    <div>
                        <input
                            type="text"
                            className="search-with-query"
                            placeholder="İşçinin adını daxil edin.."
                            ref={searchInputRef}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <ul className="employees-list">
                        {
                            empList.map((employee,index) =>
                                <li key={index} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                    {employee.full_name}
                                    <br />
                                    <span>{employee.vezife}</span>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>


        </div>
    )
}
export default React.memo(ForwardDocAdvanced)

export const ForwardedPeople = (props) => {
    const draggedElement = useRef(null);
    return (
        <div style={{ padding: '0px 20px', borderRadius: '5px' }}>
            <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray', borderRadius: '3px',width:'15em'}}>
                {
                    props.receivers.map((emp, index) =>
                        <VisaForwardPerson
                            key={emp.id}
                            id={emp.id}
                            emp={emp}
                            index={index}
                            draggedElement={draggedElement}
                            setReceivers={props.setReceivers}
                            handleSelectChange={props.handleSelectChange}
                        />
                    )
                }
            </div>
        </div>
    )
}