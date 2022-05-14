import { Agent } from "agents-flow";
import { Aspect, Likes, SexKind, OriginKind, EyeColor, HairColor, HaircutStyle, ComplexionKind, SpecieKind } from "npc-aspect";
import { RelationSet, RelationFactory, RelationKind, Familiar } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { TruthTable, Sentence } from "first-order-logic";

export class AgentRepository{
    private _elements: Agent[];

    constructor(){
        this._elements = [];

        this._elements.push(new Agent(
            "Anselmo Rubiales",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Brown, HairColor.White, HaircutStyle.Short, ComplexionKind.Skinny, 173, 92),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Enemy))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Friend))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.FuckFriend))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.FuckFriend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Sexy)),
            new Happiness(0),
            new Personality(60, 40, 50, 50, 60),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable()
                .with(Sentence.build("Republicano", "AnselmoRubiales")),
            false
        ));

        this._elements.push(new Agent(
            "Fructuoso Padilla",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Black, HairColor.White, HaircutStyle.Short, ComplexionKind.Fat, 168, 92),
            new RelationSet()
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Enemy))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Friend))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.FuckFriend))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.FuckFriend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Sexy)),
            new Happiness(),
            new Personality(70, 60, 80, 70, 70),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable()
                .with(Sentence.build("Nacional", "FructuosoPadilla")),
            false
        ));

        this._elements.push(new Agent(
            "Jacinta Osorio",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Green, HairColor.White, HaircutStyle.StraightLong, ComplexionKind.Skinny, 158, 80),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Friend))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.Friend))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.Friend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Neutral)),
            new Happiness(),
            new Personality(90, 30, 20, 30, 90),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            new TruthTable(),
            true
        ));

        this._elements.push(new Agent(
            "Raquel Aranda",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Brown, HairColor.Blond, HaircutStyle.Short, ComplexionKind.Fat, 178, 58),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Friend))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Friend))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.Friend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Friend)),
            new Happiness(70),
            new Personality(70, 70, 20, 50, 40),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            new TruthTable(),
            false
        ));

        this._elements.push(new Agent(
            "Maria Rosa Lloreda",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Black, HairColor.Black, HaircutStyle.CurvyLong, ComplexionKind.Thin, 165, 45),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Friend))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Friend))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Friend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Friend)),
            new Happiness(70),
            new Personality(70, 90, 40, 70, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            new TruthTable(),
            false
        ));

        this._elements.push(new Agent(
            "Antonio Fuster",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Blue, HairColor.White, HaircutStyle.Bald, ComplexionKind.Skinny, 170, 82),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Neutral))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.Neutral))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.Neutral))
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro Fuster", RelationFactory.get(RelationKind.Friend, Familiar.SonOrDaughter)),
            new Happiness(),
            new Personality(40, 30, 20, 20, 20),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            new TruthTable(),
            false
        ));

        this._elements.push(new Agent(
            "Socorro Fuster",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Blue, HairColor.Red, HaircutStyle.CurvyLong, ComplexionKind.Thin, 160, 55),
            new RelationSet()
                .append("Fructuoso Padilla", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta Osorio", RelationFactory.get(RelationKind.Neutral))
                .append("Raquel Aranda", RelationFactory.get(RelationKind.Friend))
                .append("Maria Rosa Lloreda", RelationFactory.get(RelationKind.Friend))
                .append("Antonio Fuster", RelationFactory.get(RelationKind.Friend, Familiar.Parent))
                .append("Anselmo Rubiales", RelationFactory.get(RelationKind.Neutral)),
            new Happiness(),
            new Personality(70, 30, 20, 20, 20),
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