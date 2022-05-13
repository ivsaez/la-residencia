import { TruthTable, Sentence } from "first-order-logic";

export class Tables{
    private static _tables: Map<string, TruthTable> = new Map<string, TruthTable>([
        ["Ivan", new TruthTable()
            .with(Sentence.build("Heroina", "Ron"))
            .with(Sentence.build("Cocacola", "Ron"))
            .with(Sentence.build("Mentos", "Agatha"))
            .with(Sentence.build("Anfetaminas", "Ivan"))
            .with(Sentence.build("Cocacola", "Ivan"))],
        ["Agatha", new TruthTable()
            .with(Sentence.build("Cocaina", "Agatha"))
            .with(Sentence.build("Cocacola", "Agatha"))
            .with(Sentence.build("Cocacola", "Mamen"))
            .with(Sentence.build("Anfetaminas", "Mamen"))],
        ["Mamen", new TruthTable()
            .with(Sentence.build("Cocaina", "Agatha"))
            .with(Sentence.build("Cocacola", "Agatha"))
            .with(Sentence.build("Cocacola", "Mamen"))
            .with(Sentence.build("Anfetaminas", "Mamen"))
            .with(Sentence.build("Nymphomaniac", "Mamen"))],
        ["Ron", new TruthTable()
            .with(Sentence.build("Heroina", "Ron"))
            .with(Sentence.build("Cocacola", "Ron"))
            .with(Sentence.build("Mentos", "Agatha"))
            .with(Sentence.build("Anfetaminas", "Ivan"))],
    ]);
    
    static tableFrom(actorName: string): TruthTable{
        if(!this._tables.has(actorName))
            throw new Error("Actor doesn't exist.");
        
        return this._tables.get(actorName);
    }
}