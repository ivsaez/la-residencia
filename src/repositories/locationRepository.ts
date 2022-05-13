import { Location } from "agents-flow";

export class LocationRepository{
    private _elements: Location[];

    constructor(){
        this._elements = [];

        let salon = new Location("Salon");
        let bath = new Location("Bath");

        this._elements.push(salon);
        this._elements.push(bath);

        Location.join(salon, bath);
    }

    get all(){
        return this._elements;
    }

    get(name: string): Location | null{
        let filtered = this._elements.filter(x => x.name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}