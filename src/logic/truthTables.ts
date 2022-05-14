import { TruthTable, Sentence } from "first-order-logic";

export class Tables{
    private static _tables: Map<string, TruthTable> = new Map<string, TruthTable>([
        ["Anselmo Rubiales", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Fructuoso Padilla", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Jacinta Osorio", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Raquel Aranda", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Maria Rosa Lloreda", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Antonio Fuster", new TruthTable()
            .with(Sentence.build("Republicano", "AnselmoRubiales"))
            .with(Sentence.build("Nacional", "FructuosoPadilla"))],
        ["Socorro Fuster", new TruthTable()],
    ]);
    
    static tableFrom(actorName: string): TruthTable{
        if(!this._tables.has(actorName))
            throw new Error("Actor doesn't exist.");
        
        return this._tables.get(actorName);
    }
}