import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import EnhancedTable from '../../../../components/Table/EnhancedTable'
import makeData from './makeData'

const ProductTable = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Ad',
        accessor: 'ad',
      },
      {
        Header: 'Nömrə',
        accessor: 'nomre',
      },
      {
        Header: 'Kod',
        accessor: 'kod',
      },
      {
        Header: 'Ölçü vahidi',
        accessor: 'olcu_vahidi',
      },
      {
        Header: 'Say',
        accessor: 'say',
      },
      {
        Header: 'İstifadə yeri',
        accessor: 'istifade_yeri',
      },
    ],
    []
  )

  const [data, setData] = React.useState(React.useMemo(() => makeData(20), []))
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }


  // Handling selected data
  const [rowId, setRowId] = React.useState(null);

  const buttonClickHandler = () =>{
    props.setWhichPage(3);
    let dataArray = [];
    Object.keys(rowId).map(k => {
        dataArray.push(data[k]);
    })
    props.setSelectedData(dataArray);
  }

  return (
    <div>
      <CssBaseline />
      <EnhancedTable
        columns={columns}
        data={data}
        setData={setData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        setRowId={setRowId}
      />
        <div className="flex gap-3 "
            style={{'float':'right'}}>
            <button
            className="btn btn-primary btn-modal bg-red py-4 mt-8"
            style={{'width':'150px'}}
            type="button"
            onClick={()=>props.setWhichPage(1)}
            >
            Geri
            </button>

            <button
            className="btn btn-primary btn-modal bg-green py-4 mt-8"
            style={{'float':'right','width':'150px'}}
            type="button"
            onClick={buttonClickHandler}
            >
            Davam
            </button>
        </div>
    </div>
  )
}

export default ProductTable
