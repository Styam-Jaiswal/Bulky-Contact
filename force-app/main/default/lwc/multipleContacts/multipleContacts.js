import { LightningElement, track } from 'lwc';
import insertMultipleContacts from '@salesforce/apex/ContactController.insertMultipleContacts';
import updateMultipleContacts from '@salesforce/apex/ContactController.updateMultipleContacts';

export default class MultipleContacts extends LightningElement {
    @track contactList = [
        { key: Date.now().toString(), FirstName: '', LastName: '', Email: '', Phone: '' }
    ];
    @track insertedContacts = [];
    @track draftValues = [];
    originalData = [];

    columns = [                                                                                                                                                                                                                                                         
        {
            label: 'First Name',
            fieldName: 'recordLink',
            type: 'url',
            typeAttributes: { label: { fieldName: 'FirstName' }, target: '_blank' },
            editable: false
        },
        { label: 'Last Name', fieldName: 'LastName', editable: true },
        { label: 'Email', fieldName: 'Email', editable: true },
        { label: 'Phone', fieldName: 'Phone', editable: true }
    ];

    handleChange(event) {
        let index = event.target.dataset.index;
        let field = event.target.name;
        this.contactList[index][field] = event.target.value;
    }

    addRow() {
        this.contactList = [
            ...this.contactList,
            { key: Date.now().toString(), FirstName: '', LastName: '', Email: '', Phone: '' }
        ];
    }

    removeRow(event) {
        let index = event.target.dataset.index;
        if (this.contactList.length > 1) {
            this.contactList.splice(index, 1);
            this.contactList = [...this.contactList];
        }
    }

  saveContacts() {
        let contactsToInsert = this.contactList.map(c => {
            return {
                FirstName: c.FirstName,
                LastName: c.LastName,
                Email: c.Email,
                Phone: c.Phone
            };
        });

        insertMultipleContacts({ contactsList: contactsToInsert })
            .then(result => {
                this.insertedContacts = result.map(rec => {
                    return { ...rec, recordLink: '/' + rec.Id };
                });
                this.originalData = JSON.parse(JSON.stringify(this.insertedContacts));
                this.contactList = [
                    { key: Date.now().toString(), FirstName: '', LastName: '', Email: '', Phone: '' }
                ];
            })
            .catch(error => {
                console.error('Error inserting contacts: ', error);
            });
    }

   

    updateContacts() {
        updateMultipleContacts({ contactsList: this.draftValues })
            .then(result => {
                this.insertedContacts = result.map(rec => {
                    return { ...rec, recordLink: '/' + rec.Id };
                });
                this.originalData = JSON.parse(JSON.stringify(this.insertedContacts));
                this.draftValues = [];
            })
            .catch(error => {
                console.error('Error updating contacts: ', error);
            });
    }

    cancelChanges() {
        this.insertedContacts = JSON.parse(JSON.stringify(this.originalData));
        this.draftValues = [];
    }
}