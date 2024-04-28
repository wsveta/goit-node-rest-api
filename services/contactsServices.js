import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json')

async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const data = await listContacts();
    return data.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
    const item = await getContactById(contactId);
    if (item) {
        const data = await listContacts();
        const newData = data.filter((contact) => contactId !== contact.id);
        fs.writeFile(contactsPath, JSON.stringify(newData))
        return item;
    }
    return null;
}

async function addContact(name, email, phone) {
    const data = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    data.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(data));
    return newContact;
}

async function updateContact(id, body) {
    const data = await listContacts();
    const index = data.findIndex(contact => contact.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...body };
        fs.writeFile(contactsPath, JSON.stringify(data));
        return data[index];
    } else {
        return index;
    }
}


export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact
};