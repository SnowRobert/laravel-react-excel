import React, {useEffect, useState} from 'react';
import {formTypes} from '../../../utils/constants'
import NewVehicleForm from './new_vehicle'
import NewUserForm from './new_user'
import NewPenaltyForm from './new_penalty'
import LoginForm from './loginForm'
import SignUpForm from './signupForm'
import ForgotPasswordForm from './forgotPassword'
import NewPasswordForm from './forgotPassword/new_password'
import AutoGeneratedForm from './newAutoGeneratedForm'
import TemplateForm from './template_form'
import PrintForm from './printForm'


export default function MainForm(props) {

    const {formType, title, isUpdate, data} = props;
    const [formData, setFormData] = useState(data);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const isUpdatingData = (typeof isUpdate === "boolean") ? isUpdate : false;
    const formToRender = () => {

        if (formType === formTypes.newVehicle) {
            //new vehicle form

            return <NewVehicleForm isUpdate={isUpdatingData} data={formData}/>

        } else if (formType === formTypes.newUser) {
            //new User form

            return <NewUserForm isUpdate={isUpdatingData} data={formData}/>

        } else if (formType === formTypes.newPenalty) {
            //new User form

            return <NewPenaltyForm isUpdate={isUpdatingData} data={formData}/>

        } else if (formType === formTypes.login) {
            //new User form

            return <LoginForm/>

        } else if (formType === formTypes.signUp) {
            //new User form

            return <SignUpForm/>

        } else if (formType === formTypes.forgotPassword) {
            //new User form

            return <ForgotPasswordForm/>

        } else if (formType === formTypes.newPassword) {
            //new User form

            return <NewPasswordForm/>

        } else if (formType === formTypes.newAutoGeneratedForm) {
            return <AutoGeneratedForm/>
        } else if (formType === formTypes.autoGenerateForm) {
            return <TemplateForm title={title} isUpdate={isUpdatingData} data={formData}/>
        } else if (formType === formTypes.newPrint) {
            return <PrintForm/>
        }
    }

    return (
        <div>

            {formToRender()}

        </div>
    )


}

