import { LightningElement, track } from 'lwc';
import insertMultipleContacts from '@salesforce/apex/ContactController.insertMultipleContacts';

export default class MultipleContacts extends LightningElement {
    @track contactList = [
        { key: Date.now().toString(), FirstName: '', LastName: '', Email: '', Phone: '' }
    ];
    @track insertedContacts = [];

    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' }
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
                this.insertedContacts = result;
                this.contactList = [
                    { key: Date.now().toString(), FirstName: '', LastName: '', Email: '', Phone: '' }
                ];
            })
            .catch(error => {
                console.error('Error inserting contacts: ', error);
            });
    }
}