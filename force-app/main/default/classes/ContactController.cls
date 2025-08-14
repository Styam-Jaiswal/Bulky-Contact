public with sharing class ContactController {
    @AuraEnabled
    public static List<Contact> insertMultipleContacts(List<Contact> contactsList) {
        if (contactsList == null || contactsList.isEmpty()) {
            return new List<Contact>();
        }

        insert contactsList;

        return [
            SELECT Id, FirstName, LastName, Email, Phone
            FROM Contact
            WHERE Id IN :contactsList
        ];
    }
}