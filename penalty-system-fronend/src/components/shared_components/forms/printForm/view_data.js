import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons'
import React from 'react'


export default (props) => {
    const { headers, data, handleRemoveData} = props
    return (

        <div style={{width: '100%', padding: '20px 0'}}>
        <table className={["table, table-striped, table-responsive"].join()} style={{width: '100%'}}>
  
          <thead>
            
            {
              headers.map((item, index)=><th key={index} scope="col">{item}</th>)
            }

            <th scope="col">Aksiyon</th>
          </thead>
          <tbody>
              {
                data.map((item, index)=> (
                  <tr key={index}>
                      {headers.map((header, index1)=>{
                        const scope = (index1 == 0)?"row":""
                        return <td scope={scope} key={index1}  style={{padding: '15px', fontSize: '18px'}}>{ item[header] }</td>
                      })}

                      <td style={{padding: '15px', fontSize: '18px'}} >
                          <IconButton onClick={()=>{
                              handleRemoveData(index)
                          }}>
                              <Delete />
                          </IconButton>
                      </td>
                  </tr>
                ))
              }
          </tbody>
        </table>
  
        </div>
      );

}
