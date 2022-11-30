import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from "@material-ui/core/Slide";
import Form from '../forms'
import {IconButton} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import userEvent from "@testing-library/user-event";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function EditDataModal(props) {

    const {editModalOpen, handleEditDataModalClose, formType, page_type} = props

    const [formData, setFormData] = useState(editModalOpen.data);

    useEffect(() => {
        setFormData(editModalOpen.data);
    }, [editModalOpen]);

    const title = (page_type) ? page_type : ''

    return (
        <div id="modalTest">
            <Dialog open={editModalOpen.open}
                    onClose={handleEditDataModalClose}
                    TransitionComponent={Transition}
                    keepMounted
                    disableEnforceFocus>

                <DialogActions>
                    <IconButton onClick={handleEditDataModalClose}>
                        <Close/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <Form formType={formType} title={title} isUpdate={true} data={formData}/>
                </DialogContent>

            </Dialog>
        </div>
    );
}
