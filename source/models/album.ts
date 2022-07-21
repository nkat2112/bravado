import { ObjectId } from "mongodb";

export default class Album {
  constructor(public name: string, public year: number, public id?: ObjectId) {}
}
