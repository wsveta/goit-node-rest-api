import contactsService from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
    console.log(req)
    res.json({
        status: 'success',
        code: 200,
        data: { contacts: await contactsService.listContacts() }
    })
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (data) {
        res.json({
            status: 'success',
            code: 200,
            data: data,
        })

    } else {
        res.json({
            code: 404,
            message: "Nof found"
        })
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (data) {
        res.json({
            status: 'success',
            code: 200,
            data,
        })

    } else {
        res.json({
            code: 404,
            message: "Nof found"
        })
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        createContactSchema.validateAsync({ name, email, phone });
        const data = await contactsService.addContact(name, email, phone);
        res.json({
            status: 201,
            data,
        })
    } catch (error) {
        res.json({
            code: 400,
            message: error.message
        })
    }
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        const contact = await updateContactSchema.validateAsync({ name, email, phone });
        const data = await contactsService.updateContact(id, contact);
        res.json({
            status: 200,
            data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: error.message
        })
    }
};
