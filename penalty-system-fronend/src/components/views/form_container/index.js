import React from 'react'
import Form from '../../shared_components/forms'

export default (props) => {

    const { formType } = props;
    return (<Form formType={formType} />);
    
}
