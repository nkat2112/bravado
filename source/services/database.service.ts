// First we configure and load all environment variables:
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });
import * as mongoDB from "mongodb";

export const collections: { albums?: mongoDB.Collection } = {}

export async function connectToDatabase () {
  const connectionString: string = process.env.DB_CONN_STRING ?? 'mongodb://albumsadmin:123456@localhost:27017/albumsdb';

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connectionString);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const collectionName: string = process.env.ALBUMS_COLLECTION_NAME ?? 'albums';
  const albumsCollection: mongoDB.Collection = db.collection(collectionName);

  collections.albums = albumsCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${albumsCollection.collectionName}`);
}
