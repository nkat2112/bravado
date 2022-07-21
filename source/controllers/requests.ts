import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import {ObjectId, WithId} from "mongodb";
import { collections } from "../services/database.service";
import Album from "../models/album";

// GET /albums
const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
    if (collections.albums) {  // TODO: Would prefer not to have to make this check.
        try {
            // Would have preferred to convert them into an array of Album.
            //const posts = (await collections.albums.find({}).toArray()) as Album[];
            const albums = (await collections.albums.find({}).toArray()) as WithId<Document>[];

            return res.status(200).send(albums);
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(500).send("collections.albums is undefined.");
    }
};

// GET /albums/:id
const getAlbum = async (req: Request, res: Response, next: NextFunction) => {
    const idString: string = req.params.id;

    if (collections.albums && idString) {
        const id: number = +idString;
        const query = { id: id };

        try {
            const album = (await collections.albums.findOne(query)) as WithId<Document>;
            return res.status(200).send(album);
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    } else {
        res.status(500).send("collections.albums is undefined.");
    }
};

// PUT /albums/:id
const updateAlbum = async (req: Request, res: Response, next: NextFunction) => {
    const idString: string = req.params.id;
    const updatedAlbum: Album = req.body as Album;

    if (collections.albums && idString && updatedAlbum) {
        const id: number = +idString;
        const query = { id: id };

        try {
            const result = (await collections.albums.updateOne(query, { $set: updatedAlbum}));

            result
              ? res.status(200).send(`Successfully updated game with id ${id}`)
              : res.status(304).send(`Game with id: ${id} not updated`);
        } catch (error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    } else {
        res.status(500).send("collections.albums is undefined.");
    }
};

// DELETE /albums/:id
const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
    const idString: string = req.params.id;

    if (collections.albums && idString) {
        const id: number = +idString;
        const query = { id: id };

        try {
            const result = await collections.albums.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(`Successfully removed album with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove album with id ${id}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`Album with id ${id} does not exist`);
            }
        } catch (error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    } else {
        res.status(500).send("collections.albums is undefined.");
    }
};

// POST /albums
const addAlbum = async (req: Request, res: Response, next: NextFunction) => {
    if (collections.albums) {
        try {
            const newAlbum = req.body as Album;
            const result = await collections.albums.insertOne(newAlbum);

            result
              ? res.status(201).send(`Successfully created a new album with id ${result.insertedId}`)
              : res.status(500).send("Failed to create a new album.");
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
};

export default { getAlbums, getAlbum, updateAlbum, deleteAlbum, addAlbum };
