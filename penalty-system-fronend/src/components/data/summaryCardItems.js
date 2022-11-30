

import CommuteOutlinedIcon from '@material-ui/icons/CommuteOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import ReceiptIcon from '@material-ui/icons/Receipt';
import GroupIcon from '@material-ui/icons/Group';
// import AccountBalance from '@material-ui/icons/AccountBalance';
// import ArtTrack from '@material-ui/icons/ArtTrack';


const SummaryIconsStyle = {

    width: '40px',
    height: '40px',
    color: '#4d4d4d',
};
export const SummaryCardItems = [

    {
        id: 'vehicle',
        color: '#0066ff',
        title: 'Günümüzün yeni araçları',
        value: '0',
        url: '/arac', 
        icon: <CommuteOutlinedIcon style={{...SummaryIconsStyle, color: 'white'}} />
    },
    {
        id: 'penalties',
        color: '#ff0000',
        title: 'Bugünün yeni cezaları',
        value: '0',
        url: '/ceza', 
        icon: <GavelIcon style={{...SummaryIconsStyle, color: 'white'}}/>
    },
    {
        id: 'total_penalties',
        color: '#009933',
        title: 'Toplam Cezalar',
        value: '0',
        url: '/ceza', 
        icon: <GroupIcon style={{...SummaryIconsStyle, color: 'white'}} />
    },
    {
        id: 'total_vehicles',
        color: '#ffcc00',
        title: 'Toplam araç',
        value: '0',
        url: '/arac', 
        icon: <ReceiptIcon style={{...SummaryIconsStyle, color: 'white'}} />
    },
    // {
    //     id: 'license_penalty',
    //     color: '#6610f2',
    //     title: 'Lisans Cezası',
    //     value: '0',
    //     url: '/arac', 
    //     icon: <AccountBalance style={{...SummaryIconsStyle, color: 'white'}} />
    // },
    // {
    //     id: 'directorate_fines',
    //     color: '#fd7e14',
    //     title: 'Müdürlük Cezaları',
    //     value: '0',
    //     url: '/arac', 
    //     icon: <ArtTrack style={{...SummaryIconsStyle, color: 'white'}} />
    // }

];