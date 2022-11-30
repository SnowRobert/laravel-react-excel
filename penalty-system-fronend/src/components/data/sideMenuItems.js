import BarChartIcon from '@material-ui/icons/BarChart';
import CommuteIcon from '@material-ui/icons/Commute';
import GavelIcon from '@material-ui/icons/Gavel';
import GroupIcon from '@material-ui/icons/Group';
import List from '@material-ui/icons/FeaturedPlayListSharp';
import { AccountCircle, LibraryAdd, Print } from '@material-ui/icons';

export const SideMenuItems = [
    {
        item: 'Gösterge Paneli',
        url: '/ana-sayfa',
        icon: <BarChartIcon />
    },
    {
        item: 'Araç Ekle',
        url: '/arac',
        icon: <CommuteIcon />
    },
    {
        item: 'Ceza Ekle',
        url: '/ceza',
        icon: <GavelIcon />
    },
    {
        item: 'Menü Ekle',
        url: '/kategori/veri',
        icon: <LibraryAdd />
    },
    {
        item: 'kullanıcı ekle',
        url: '/personel',
        icon: <GroupIcon />
    },
    {
        item: 'profili Düzenle',
        url: '/profil/current-user',
        icon: <AccountCircle />
    },
    {
        item: 'Verileri Yazdır',
        url: '/yazdir',
        icon: <Print />
    },
]