
import React, { useEffect, useState } from 'react'
import { Divider, Grid, Paper, Typography } from '@material-ui/core';
import SummaryCards from '../../shared_components/summary_card';
import { SummaryCardItems } from '../../data/summaryCardItems';
import {Line,Doughnut, Bar } from 'react-chartjs-2';
import { State } from '../../data/totalPenaltiesPerWeek';
import { PaymentData } from '../../data/paymentData';
import { garage_status_state } from '../../data/vehicle_unit_garage_status';
import { useStyles } from './style';
import MenuCard from '../../shared_components/menu_card';
import Calendar from 'react-calendar';
import DashboardCard from '../../shared_components/dashboard_card';
import 'react-calendar/dist/Calendar.css';
import DataProgressRateCard from '../../shared_components/DataProgressRateCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllStatistics } from '../../../store/reducers/statistics/statistics.actions';
import ProgressSpinner from '../../shared_components/ProgressBarSpinner'
import { translateDates } from '../../../utils/functions'

export default function Dashboard(props) {
    
    
    const [calendarDate, setCalendarDate] = useState(new Date());
    const classes = useStyles();
    const dispatch = useDispatch()
    const statisticsReducer = useSelector((state) => state.statisticsReducer)
    const menuReducer = useSelector(state => state.menuReducer)
    
    const summaryCardItems = SummaryCardItems.map((item)=>{

        if(item.id === 'vehicle') {
            const total = statisticsReducer.data.todayTotalVehicles
            item.value = total?total:0
            return item
        }else if(item.id === 'penalties') {
            const total = statisticsReducer.data.todayTotalPenalties
            item.value = total?total:0
            return item
        }else if(item.id === 'total_penalties') {
            const total = statisticsReducer.data.totalPenalties
            item.value = total?total:0
            return item
        }else if(item.id === 'total_vehicles') {
            const total = statisticsReducer.data.totalVehicles
            item.value = total?total:0
            return item
        }
        return item

    })

    const getGraphData = (data) => {

        const labels = []
        const vehicleData = []
        const penaltyData = []

        if("vehicleWeeklydata" in statisticsReducer.data) {
            const allData = statisticsReducer.data.vehicleWeeklydata
            for(let i=allData.length-1; i>=0; i--) {
                for (const key in allData[i]) {
                    labels.push( translateDates(key) )
                    vehicleData.push( allData[i][key] )
                    penaltyData.push( statisticsReducer.data.penaltyWeeklydata[i][key] )
                }
            }
        }
        console.log(data.labels)
        data.labels = labels
        data.datasets["0"].data = vehicleData
        data.datasets["1"].data = penaltyData

        return data
    }

    const getVehicleUnitGarageChartData = ()=> {

        const ___data = []
          const labels = []
        if("vehicle_unit_garage_status" in statisticsReducer.data) {

            const unit_data = statisticsReducer.data.vehicle_unit_garage_status
            for(const key in  unit_data) {
                labels.push(key)
                ___data.push(unit_data[key])
            }

            return ({
                labels: labels,
                datasets: [
                  {
                    label: 'Birim',
                    backgroundColor: [
                        '#00cc99',
                        '#b3ffb3',
                        '#000000',
                        '#ff1a75',
                        '#ff9966',
                        '#0000ff',
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#668cff',
                        '#ff3300',
                        '#ff9999',
                    ],
                    borderColor: [
                        '#00cc99',
                        '#b3ffb3',
                        '#000000',
                        '#ff1a75',
                        '#ff9966',
                        '#0000ff',
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#668cff',
                        '#ff3300',
                        '#ff9999',
                    ],
                    borderWidth: 2,
                    data: ___data
                  }
                ]
              }
            )
        }

        return garage_status_state
    }
    const getvehicleTypeStats = ()=> {

        const ___data = []
          const labels = []
        if("vehicle_type" in statisticsReducer.data) {

            const vehicle_type = statisticsReducer.data.vehicle_type
            for(const key in  vehicle_type) {
                labels.push(key)
                ___data.push(vehicle_type[key])
            }

            return ({
                labels: labels,
                datasets: [
                  {
                    label: 'Arac Sayisi',
                    backgroundColor: [
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#ff6666',
                        '#0000ff',
                        '#00cc99',
                        '#00e600'
                    ],
                    borderColor: [
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#ff6666',
                        '#0000ff',
                        '#00cc99',
                        '#00e600'
                    ],
                    borderWidth: 2,
                    data: ___data
                  }
                ]
              }
            )
        }

    }


    const getVehicleStatusStats = () => {
        
        const ___data = []
          const labels = []
        if("vehicle_status" in statisticsReducer.data) {

            const vehicle_status = statisticsReducer.data.vehicle_status
            for(const key in  vehicle_status) {
                labels.push(key)
                ___data.push(vehicle_status[key])
            }

            return ({
                labels: labels,
                datasets: [
                  {
                    label: 'Arac Durum',
                    backgroundColor: [
                        '#36a2eb',
                        '#00cc66',
                        "#ff0000",
                        "#ff9900"
                    ],
                    hoverOffset: 4,
                    data: ___data
                  }
                ]
              }
            )
        }
    }

    useEffect(() => {
        
        dispatch(getAllStatistics())

    }, [])


    return (
        

        <div>

            {
                statisticsReducer.loading?
                    <ProgressSpinner />

                :
                <>
                    <Grid container spacing={1}>
                        {
                            summaryCardItems.map((item, index)=> 
                                <SummaryCards 
                                    key={index}
                                    color = {item.color} 
                                    title = {item.title}
                                    value = {item.value} 
                                    url = {item.url}
                                    icon = {item.icon}
                                />
                            )
                        }
                    </Grid>





                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>

                                <Typography className={classes.header}>Birim</Typography>
                                <Divider style={{margin: '15px 0',}}/>
                                <div  className={classes.chartCanvas}>
                                    <Bar
                                        data={getVehicleUnitGarageChartData()}
                                        options={{
                                            
                                            responsive:true,
                                            maintainAspectRatio: false,
                                            title:{
                                                display:true,
                                                text:'Birim',
                                                fontSize:12
                                            },
                                            legend:{
                                                display:true,
                                                position: 'right',
                                            },
                                        }}
                                    />

                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>

                                <Typography className={classes.header}>Arac Sayisi</Typography>
                                <Divider style={{margin: '15px 0',}}/>
                                <div  className={classes.chartCanvas}>
                                    <Bar
                                        data={getvehicleTypeStats()}
                                        options={{
                                            
                                            responsive:true,
                                            maintainAspectRatio: false,
                                            title:{
                                                display:true,
                                                text:'Arac Sayisi',
                                                fontSize:12
                                            },
                                            legend:{
                                                display:true,
                                                position: 'right',
                                            },
                                        }}
                                    />

                                </div>
                            </Paper>
                        </Grid>

                    </Grid>




                    <Grid container spacing={2} className={classes.notificationCard}>

                        
                        <Grid item xs={12} md={4}>

                            <DashboardCard header="Arac Durum">
                                <Doughnut 

                                    
                                    data={getVehicleStatusStats()}
                                    options={{
                                        
                                        responsive:true,
                                        maintainAspectRatio: true,
                                        legend:{
                                            display:true,
                                            position: 'right',
                                        },
                                    }}
                                
                                />
                            </DashboardCard>

                            </Grid>
                        <Grid item xs={12} md={4}>

                            <DashboardCard header="Ödemeler Raporu" >
                                <Doughnut 

                                    
                                    data={()=>{
                                        PaymentData.datasets["0"].data = [
                                            Math.round(statisticsReducer.data.paidPayment),
                                            Math.round(statisticsReducer.data.pendingPayment)
                                        ]
                                        return PaymentData
                                    }}
                                    options={{
                                        
                                        responsive:true,
                                        maintainAspectRatio: true,
                                        legend:{
                                            display:true,
                                            position: 'right',
                                        },
                                    }}
                                
                                />
                            </DashboardCard>

                        </Grid>
                        <Grid item xs={12} md={4}>

                            <DashboardCard header="Tüm Menü Kategorileri" >
                                
                                { 
                                    menuReducer.loading?
                                        <ProgressSpinner />
                                    :
                                    Array.isArray(menuReducer.data) && menuReducer.data.length > 0?
                                        menuReducer.data.map((item)=>(
                                            <MenuCard 
                                                key={item.id}
                                                menu_id={item.id}
                                                menu_name = {item.name}
                                                created_at = {item.created_at}
                                            />)
                                        )
                                    :<div>0 results found</div>
                                }
                            </DashboardCard>
                        </Grid>

                        
                    </Grid>


                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <DataProgressRateCard value={Math.round(statisticsReducer.data.usersMonthlyIncrease)}
                                 color="#00cc66" dataType="Kullanıcılar"/>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DataProgressRateCard value={Math.round(statisticsReducer.data.penaltiesMonthlyIncrease)} 
                                color="#36a2eb" dataType="Cezalar" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DataProgressRateCard value={Math.round(statisticsReducer.data.vehicleMonthlyIncrease)}
                             color="#ffcc00" dataType="Araçlar"/>
                        </Grid>
                    </Grid>

                    <Paper style={{margin: '15px 0'}}>

                        <Typography className={classes.header}>Toplam cezalar ve araçlar</Typography>
                        <Divider style={{margin: '15px 0',}}/>
                        <div  className={classes.chartCanvas}>
                            <Line
                                data={getGraphData(State)}
                                options={{
                                    
                                    responsive:true,
                                    maintainAspectRatio: false,
                                    title:{
                                        display:true,
                                        text:'Bu hafta verilen toplam cezalar',
                                        fontSize:12
                                    },
                                    legend:{
                                        display:true,
                                        position: 'right',
                                    },
                                }}
                            />

                        </div>
                    </Paper>



                </>
                
            }
        </div>
    )
}
