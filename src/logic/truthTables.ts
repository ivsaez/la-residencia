import { TruthTable, Sentence } from "first-order-logic";

export class Tables{
    private static _tables: Map<string, TruthTable> = new Map<string, TruthTable>([
        ["Anselmo", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Fructuoso", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Jacinta", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Raquel", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Maria", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Antonio", new TruthTable()
            .with(Sentence.build("Republicano", "Anselmo"))
            .with(Sentence.build("Nacional", "Fructuoso"))
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
        ["Socorro", new TruthTable()
            .with(Sentence.build("Auxiliar", "Raquel"))
            .with(Sentence.build("Auxiliar", "Maria"))
            .with(Sentence.build("Residente", "Anselmo"))
            .with(Sentence.build("Residente", "Fructuoso"))
            .with(Sentence.build("Residente", "Jacinta"))
            .with(Sentence.build("Residente", "Antonio"))
            .with(Sentence.build("Impedido", "Fructuoso"))
            .with(Sentence.build("Impedido", "Jacinta"))
            .with(Sentence.build("Impedido", "Antonio"))],
    ]);
    
    static tableFrom(actorName: string): TruthTable{
        if(!this._tables.has(actorName))
            throw new Error("Actor doesn't exist.");
        
        return this._tables.get(actorName);
    }
}