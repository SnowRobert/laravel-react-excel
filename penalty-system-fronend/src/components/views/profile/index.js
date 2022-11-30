import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from '../../shared_components/ProfileBanner';

export default function Profile(props) {
    
    
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        
        if(isNaN(id.trim().toLowerCase()) && id.trim().toLowerCase() !== 'current-user') {
            navigate('/404')
        }
    }, [''])

    return (

        <div>

            <ProfileBanner id={id} />

        </div>
    );

}
