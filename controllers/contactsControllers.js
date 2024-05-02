import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (_, res, next) => {
    try {
        const data = await Contact.find();
        res.send(data);
    } catch (error) {
        res.send({ message: error.message });
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const data = await Contact.findById(id);
        if (data === null) {
            return res.status(404).send({ message: "Not found" });
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ message: error.message })
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const data = await Contact.findByIdAndDelete(id);
        if (data === null) {
            return res.status(404).send({ message: "Not found" })
        }
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send({ message: error.message });
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite
    }
    try {
        await createContactSchema.validateAsync(contact);
        const data = await Contact.create(contact);
        res.status(201).send(data)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite
    }
    try {
        const result = await updateContactSchema.validateAsync(contact);
        if (result === null) {
            return res.status(400).send({ message: "Body must have at least one field" })
        }
        const data = await Contact.findByIdAndUpdate(id, contact, { new: true });
        if (data === null) {
            return res.status(404).send({ message: "Not found" });
        }
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    const { id } = req.params;
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite
    }
    try {
        const data = await Contact.findByIdAndUpdate(id, contact, { new: true });
        if (data === null) {
            return res.status(404).send({ message: "Not found" });
        }
        res.status(200).send("data")
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
        next(error);
    }

}