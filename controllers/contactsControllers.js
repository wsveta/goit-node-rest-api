import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const data = await Contact.find({owner: req.user.id});
        res.send(data);
    } catch (error) {
        res.send({ message: error.message });
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).send({ message: "Not found" });
        }
        const data = await Contact.findOne({_id: id, owner: req.user.id});
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
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).send({ message: "Not found" })
        }
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
        owner: req.user.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
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
    }
    try {
        await updateContactSchema.validateAsync(contact);
        if (JSON.stringify(contact) === '{}') {
            return res.status(400).send({ message: "Body must have at least one field" })
        }
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).send({ message: "Not found" });
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
        favorite: req.body.favorite
    }
    try {
        await updateStatusSchema.validateAsync(contact);
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).send({ message: "Not found" });
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

}