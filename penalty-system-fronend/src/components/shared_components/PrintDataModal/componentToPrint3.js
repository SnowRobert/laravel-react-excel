import React from 'react'
import logo from '../../../images/Istanbul_Buyuksehir_Belediyesi.png'



export default class ComponentToPrint extends React.PureComponent {

  state = {date: new Date()}

  render() {
    const d = new Date()
    const weekday = ["pazar","pazartesi","salı","çarşamba","perşembe","cumā","cumartesi"]
    const month = ["ocak","şubat","mart","nīsan","mayıs","hazīran","temmuz","ağustos","eylül","ekim","kasım","aralık"];

    return (

      <div style={{width: '100%', padding: '40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px 0', alignItems: 'center', fontWeight: '600', color: '#5a585dcc'}}>
          <div style={{width: '100%', textAlign: 'start'}}>
            <img src={logo} alt='istanbul' style={{width: '100px'}}/>
          </div>
          <div style={{fontSize: '24px', textAlign: 'center', width: '100%'}}>
            <p style={{margin: '0'}}>Trafik Idari  Para Cezası</p>
            <p style={{margin: '0'}}>{this.props.title}</p>
          </div>
          <div style={{width: '100%', textAlign: 'right'}}>
            {/* <span>Date {this.state.date.toLocaleDateString()}</span> */}
            <p style={{margin: '0', paddingBottom: '7px'}}>{d.getDate()} {month[d.getMonth()]} {d.getFullYear()} {weekday[d.getDay()]}</p>
            <p style={{marginBottom: '0'}}>{d.getHours()}:{d.getMinutes()}:{d.getSeconds()}</p>
          </div>
        </div>
        <table className={["table, table-striped"].join()} style={{width: '100%'}}>

          <thead>
            
            {
              this.props.headers.slice(0,9).map((item, index)=>
                  <th style={{backgroundColor: '#0275d8', padding: '1px', color: '#fff', fontSize: '17px'}} key={index} scope="col">{item}</th>)
            }
          </thead>
          <tbody>
              {
                this.props.data.map((item, index)=> (
                  <tr key={index}>
                      {this.props.headers.slice(0,9).map((header, index1)=>{
                        const scope = (index1 == 0)?"row":""
                        return <td scope={scope} key={index1}  style={{padding: '1px', fontSize: '16px', color:'#000'}}>{ item[header] }</td>
                      })}
                  </tr>
                ))
              }
          </tbody>
        </table>
        <p style={{padding: '60px 0 0 0', fontSize: '20px'}}>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Yukarıda dökümü bulunan trafik idari para cezalarını tebliğ tarihinden itibaren 15 gün içinde ödemediğim takdirde ceza tutarının katlanacağı tarafıma
          anlatılmış olup; Teslim aldığım trafik idari para cezalarını gecikmeye mahal bırakmadan ödemeyi, ödendi makbuzlarını garaj amirliğine teslim etmeyi
          taahhüt ederim.
        </p>
        <div style={{width: '100%', textAlign: 'right', paddingTop: '20px', paddingRight: '40px'}}>
            {
              this.props.data.map((item, index)=> (
                <label key={index}>
                    {this.props.headers.slice(9,10).map((header, index1)=>{
                      const scope = (index1 == 0)?"row":""
                      return <td scope={scope} key={index1}  style={{padding: '1px', fontSize: '17px', color:'#000'}}>{ item[header] }</td>
                    })}
                </label>
                ))
            }
        </div>

      </div>
    );
  }
}
