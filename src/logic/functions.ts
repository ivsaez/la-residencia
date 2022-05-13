import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Anfetaminas", Cardinality.One),
        new Function("Heroina", Cardinality.One),
        new Function("Cocaina", Cardinality.One),
        new Function("Mentos", Cardinality.One),
        new Function("Cocacola", Cardinality.One),
        new Function("Idiota", Cardinality.One),
        new Function("Nymphomaniac", Cardinality.One),
        new Function("FiestaBlanca", Cardinality.Two, "x", "y", true),
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}