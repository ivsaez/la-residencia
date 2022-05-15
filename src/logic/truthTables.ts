import { TruthTable, Sentence } from "first-order-logic";

export class Tables{
    private static _tables: Map<string, TruthTable> = new Map<string, TruthTable>([
        ["Anselmo", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Fructuoso", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Jacinta", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Raquel", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Maria", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Antonio", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))],
        ["Socorro", new TruthTable()],
    ]);
    
    static tableFrom(actorName: string): TruthTable{
        if(!this._tables.has(actorName))
            throw new Error("Actor doesn't exist.");
        
        return this._tables.get(actorName);
    }
}