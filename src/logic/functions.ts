import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Republicano", Cardinality.One),
        new Function("Nacional", Cardinality.One),
        new Function("Auxiliar", Cardinality.One),
        new Function("Trabajando", Cardinality.One),
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}