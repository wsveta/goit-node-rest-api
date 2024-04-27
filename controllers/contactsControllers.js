import contactsService from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res) => {
    const data = await contactsService.listContacts()
    res.send(data)
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(404).send({ message: "Not found" })
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(404).send({ message: "Not found" })
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        await createContactSchema.validateAsync({ name, email, phone });
        const data = await contactsService.addContact(name, email, phone);
        res.status(201).send(data)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        if (Object.keys(body).length === 0) {
            res.status(400).send({ message: "Body must have at least one field" })
        } else {
            await updateContactSchema.validateAsync(body);
            const data = await contactsService.updateContact(id, body);
            if (data === -1) {
                res.status(404).send({ message: "Not found" });
            } else {
                res.status(200).send(data)
            }
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
};
