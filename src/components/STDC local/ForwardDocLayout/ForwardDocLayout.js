import React, { useState, useRef, useLayoutEffect } from 'react'
import useFetch from '../../../hooks/useFetch';
import { ForwardedPeople } from "./ForwardDocAdvanced"
const ForwardDocLayout = (props) => {
    const { textareaVisible = true } = props;
    const [empList, setEmpList] = useState([]);
    // const [props.choices.receivers, props.setChoices] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const selectRef = useRef(null);
    const empListRef = useRef(null);
    const textareaRef = useRef(null);
    const fetchGet = useFetch("GET");
    useLayoutEffect(() => {
        let mounted = true;
        if (mounted)
            fetchGet('/api/emplist')
                .then(respJ => {
                    if (mounted) {
                        empListRef.current = respJ;
                        setEmpList(respJ);
                    }
                })
                .catch(err => console.log(err));
        return () => { mounted = false }
    }, [fetchGet]);
    useLayoutEffect(() => {
        let mounted = true;
        if (mounted)
            fetchGet('/api/departments')
                .then(respJ => {
                    if (mounted) {
                        setDepartments(respJ)
                    }
                })
                .catch(err => console.log(err));
        return () => mounted = false
    }, [fetchGet]);
    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        const searchResult = empListRef.current.filter(emp => {
            if (selectRef.current.value !== "-1")
                return emp.full_name.toLowerCase().includes(str) && emp.structure_dependency_id === Number(selectRef.current.value);
            else
                return emp.full_name.toLowerCase().includes(str)
        });
        setSearchQuery(str);
        setEmpList(searchResult);
    }
    const handleStructureChange = (e) => {
        const value = Number(e.target.value);
        setEmpList(value !== -1 ? empListRef.current.filter(employee => employee.structure_dependency_id === value) : empListRef.current);
    }
    const handleSelectChange = (employee) => {
        const res = props.choices.receivers.find(emp => emp.id === employee.id);
        const newReceivers = !res ? [...props.choices.receivers, employee] : props.choices.receivers.filter(emp => emp.id !== employee.id);
        props.setChoices(prevState=>({
            ...prevState,
            receivers:newReceivers
        }))
        setSearchQuery('');
    }
    return (
        <div style={{ padding: '10px 20px' }}>
            <div style={{ marginTop: '20px' }} id="procurement-edit-section">
                {
                    textareaVisible &&
                    <textarea ref={textareaRef} />
                }
                <div style={{ minHeight: '231px' }}>
                    <select ref={selectRef} style={{ height: '30px' }} onChange={handleStructureChange}>
                        <option value="-1">-</option>
                        {
                            departments.map(structure =>
                                <option key={structure.id} value={structure.id}>{structure.name}</option>
                            )
                        }
                    </select>
                    <div>
                        <input type="text" className="search-with-query" placeholder="İşçinin adını daxil edin.." value={searchQuery} onChange={handleSearchChange}></input>
                    </div>
                    <ul className="employees-list">
                        {
                            empList.map(employee =>
                                <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                    {employee.full_name}
                                    <br />
                                    <span>{employee.vezife}</span>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <ForwardedPeople
                choices={props.choices}
                setChoices={props.setChoices}
                handleSelectChange={handleSelectChange}
            />
        </div>
    )
}
export default React.memo(ForwardDocLayout)