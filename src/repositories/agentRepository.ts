import { Agent } from "agents-flow";
import { Aspect, Likes, SexKind, OriginKind, EyeColor, HairColor, HaircutStyle, ComplexionKind, SpecieKind } from "npc-aspect";
import { RelationSet, RelationFactory, RelationKind } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { TruthTable, Sentence } from "first-order-logic";

export class AgentRepository{
    private _elements: Agent[];

    constructor(){
        this._elements = [];

        this._elements.push(new Agent(
            "Ivan",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Brown, HairColor.Black, HaircutStyle.Shaved, ComplexionKind.Athletic, 176, 37),
            new RelationSet()
                .append("Ron", RelationFactory.get(RelationKind.Friend))
                .append("Agatha", RelationFactory.get(RelationKind.Friend)),
            new Happiness(0),
            new Personality(50, 50, 50, 50, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable(),
            true
        ));

        this._elements.push(new Agent(
            "Mamen",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Blue, HairColor.White, HaircutStyle.Short, ComplexionKind.Thin, 160, 45),
            new RelationSet()
                .append("Agatha", RelationFactory.get(RelationKind.Friend)),
            new Happiness(),
            new Personality(50, 50, 10, 90, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            new TruthTable()
                .with(Sentence.build("Nymphomaniac", "Mamen")),
            false
        ));

        this._elements.push(new Agent(
            "Agatha",
            new Aspect(SexKind.Female, OriginKind.American, EyeColor.Black, HairColor.Black, HaircutStyle.CurvyLong, ComplexionKind.Fat, 180, 30),
            new RelationSet()
                .append("Ivan", RelationFactory.get(RelationKind.Friend))
                .append("Ron", RelationFactory.get(RelationKind.Friend))
                .append("Mamen", RelationFactory.get(RelationKind.Best)),
            new Happiness(),
            new Personality(90, 50, 10, 90, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable(),
            false
        ));

        this._elements.push(new Agent(
            "Ron",
            new Aspect(SexKind.Male, OriginKind.American, EyeColor.Black, HairColor.Black, HaircutStyle.Short, ComplexionKind.Strongman, 190, 28),
            new RelationSet()
                .append("Ivan", RelationFactory.get(RelationKind.Friend))
                .append("Agatha", RelationFactory.get(RelationKind.Friend)),
            new Happiness(100),
            new Personality(10, 50, 90, 90, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable(),
            false
        ));
    }

    get all(){
        return this._elements;
    }

    get(name: string): Agent | null{
        let filtered = this._elements.filter(x => x.Name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}