import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Luz", Cardinality.None),
        new Function("Lavabo", Cardinality.None),
        new Function("Balcon", Cardinality.None),
        new Function("Republicano", Cardinality.One),
        new Function("Nacional", Cardinality.One),
        new Function("Auxiliar", Cardinality.One),
        new Function("Residente", Cardinality.One),
        new Function("Impedido", Cardinality.One),
        new Function("Demente", Cardinality.One),
        new Function("Saludo", Cardinality.Two),
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}