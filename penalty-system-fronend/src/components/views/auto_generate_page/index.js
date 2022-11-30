import React from 'react'
import { useParams } from 'react-router-dom';
import Form from '../../shared_components/forms'

export default function AutoGeneratePage(props) {

    
    const { page_type } = useParams();
    const { formType } = props;
    

    const title = (page_type)?page_type:''
    return (<Form formType={formType} title={title}/>);
    
}
