

import { Avatar, IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import Profile from '../../images/profile.jpeg';

export const UsersTableHeader = [
    '#','profile', 'Name', 'surname', 'sign up date', 'action'
]
export const UsersData = [

    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
    {
        profile: <Avatar alt="Dennis Gitonga" src={Profile} />,
        name: 'dennis',
        surname: 'gitonga',
        sign_up_date: '12/02/2021',
        action: <>
                <IconButton color="primary"> <Edit /> </IconButton>
                <IconButton style={{color: '#ff0000'}}> <Delete /> </IconButton>
            </>
    },
];