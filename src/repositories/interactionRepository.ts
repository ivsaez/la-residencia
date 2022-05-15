import { 
    IInteraction, 
    Interaction, 
    Phrase, 
    RolesDescriptor, 
    Timing 
} from "agents-flow";
import { TruthTable, Sentence } from "first-order-logic";
//import { SexKind } from "npc-aspect";
//import { Effect, EffectComponent, EffectKind, EffectStrength } from "npc-emotional";
//import { check } from "role-methods";

export class InteractionRepository{
    private _elements: IInteraction[];

    constructor(){
        this._elements = [];

        this._elements.push(new Interaction(
            "SubirPersiana",
            "Subir la persiana",
            new RolesDescriptor("Subidor"),
            [
                new Phrase("Subidor")
                    .withAlternative(roles => "[Subidor] sube la persiana de una de las ventanas del salón.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Subidor")).name === "Salon" 
                && roles.get("Subidor").Characteristics.is("Auxiliar"),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Luz"))
        ));

        this._elements.push(new Interaction(
            "CorrerCortinas",
            "Correr las cortinas",
            new RolesDescriptor("Corredor"),
            [
                new Phrase("Corredor")
                    .withAlternative(roles => "[Corredor] corre las cortinas de una de las ventanas del salón.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Corredor")).name === "Salon" 
                && roles.get("Corredor").Characteristics.is("Auxiliar"),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Luz"))
        ));

        this._elements.push(new Interaction(
            "EmpezarTrabajar",
            "Empezar a trabajar",
            new RolesDescriptor("Trabajador"),
            [
                new Phrase("Trabajador")
                    .withAlternative(roles => "[Trabajador] llega apresuradamente al salón."),
                new Phrase("Trabajador")
                    .withAlternative(roles => "[Trabajador]: ¡Se me ha escapado otra vez el autobús.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Trabajador")).name === "Limbo"
                && roles.get("Trabajador").Characteristics.is("Auxiliar"),
            (roles, map) => {
                map.move(roles.get("Trabajador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "BajarEscaleras",
            "Bajar las escaleras",
            new RolesDescriptor("Bajador"),
            [
                new Phrase("Bajador")
                    .withAlternative(roles => "[Bajador] baja las escaleras cuidadosamente, con paso cansado.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Bajador")).name === "Limbo"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Bajador").Characteristics.is("Residente")
                && !roles.get("Bajador").Characteristics.is("Impedido"),
            (roles, map) => {
                map.move(roles.get("Bajador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        /*this._elements.push(new Interaction(
            "SaludoInteraction",
            "Saludar a [Saludado]",
            new RolesDescriptor("Saludador", [ "Saludado"] ),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => "[Saludador]:Dame un beso [Saludado].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                (roles.get("Saludador").Aspect.sex === SexKind.Female
                || roles.get("Saludado").Aspect.sex === SexKind.Female)
                && roles.get("Saludador").Relations.knows(roles.get("Saludado").Name)
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && !postconditions.exists(Sentence.build("Saludados", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludados", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
            ));*/

        /*this._elements.push(new Interaction(
            "PalmadaInteraction",
            "Palmear la espalda de [Palmeado]",
            new RolesDescriptor("Palmero", [ "Palmeado"] ),
            [
                new Phrase("Palmero", "Palmeado")
                    .withAlternative(roles => "[Palmero] le da una sonora palmada en la espalda a [Palmeado].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Palmero").Aspect.sex === SexKind.Male
                && roles.get("Palmeado").Aspect.sex === SexKind.Male
                && roles.get("Palmero").Relations.knows(roles.get("Palmeado").Name)
                && map.areInTheSameLocation(roles.get("Palmero"), roles.get("Palmeado"))
                && !postconditions.exists(Sentence.build("Saludados", roles.get("Palmero").Individual.name, roles.get("Palmeado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludados", roles.get("Palmero").Individual.name, roles.get("Palmeado").Individual.name, true))
            ));*/

        /*this._elements.push(new Interaction(
            "PresentacionInteraction",
            "Presentar [Presentado] a [Oyente]",
            new RolesDescriptor("Presentador", [ "Oyente", "Presentado"] ),
            [
                new Phrase("Presentador", "Oyente")
                    .withAlternative(roles => "[Presentador]:Mira [Oyente], te presento a [Presentado]."),
                new Phrase("Oyente", "Presentado")
                    .withAlternative(
                        roles => "[Oyente]:Es un placer [Presentado]",
                        roles => Effect.neutral("Presentado"))
                    .withAlternative(
                        roles => "[Oyente]:Es un inmenso placer en todos los sentidos [Presentado].",
                        roles => new Effect(
                            "Presentado", 
                            [
                                EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low),
                                EffectComponent.positive(EffectKind.Sex, EffectStrength.Low),
                                EffectComponent.positive(EffectKind.Friend, EffectStrength.Low)
                            ]))
                    .withAlternative(
                        roles => "[Oyente]:Ni fu ni fa.",
                        roles => new Effect(
                            "Presentado",
                            [
                                EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                                EffectComponent.negative(EffectKind.Sex, EffectStrength.Low),
                                EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                            ])),
                new Phrase("Presentado", "Oyente")
                    .withAlternative(roles => "[Presentado]:Igualmente [Oyente].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Presentador").Relations.knows(roles.get("Presentado").Name)
                && roles.get("Presentador").Relations.knows(roles.get("Oyente").Name)
                && !roles.get("Oyente").Relations.knows(roles.get("Presentado").Name)
                && map.areInTheSameLocation(roles.get("Presentador"), roles.get("Presentado"))
                && map.areInTheSameLocation(roles.get("Presentador"), roles.get("Oyente"))
                && postconditions.exists(Sentence.build("Saludados", roles.get("Presentador").Individual.name, roles.get("Oyente").Individual.name, true)),
            (roles, map) => {
                roles.get("Oyente").logic.population.add(roles.get("Presentado").Individual);
                roles.get("Presentado").logic.population.add(roles.get("Oyente").Individual);

                return TruthTable.empty;
            }
        ));*/
        
        /*this._elements.push(new Interaction(
            "PreguntarNympho",
            "Preguntarle a [PosibleNympho] si es nimfómana",
            new RolesDescriptor("Preguntador", [ "PosibleNympho" ]),
            [
                new Phrase("Preguntador", "PosibleNympho")
                    .withAlternative(roles => "[Preguntador]:Hay algo que me ronda la cabeza [PosibleNympho]."),
                new Phrase("PosibleNympho", "Preguntador")
                    .withAlternative(roles => "[PosibleNympho]:¿Qué es si puede saberse?"),
                new Phrase("Preguntador", "PosibleNympho")
                    .withAlternative(roles => "[Preguntador]:¿Eres nimfómana?"),
                new Phrase("PosibleNympho", "Preguntador")
                    .withAlternative(
                        roles => "[PosibleNympho]:Sí, ¿te pone?",
                        roles => new Effect("Preguntador", [EffectComponent.positive(EffectKind.Sex, EffectStrength.High)]),
                        roles => Sentence.build("Nymphomaniac", roles.get("PosibleNympho").Individual.name))
                    .withAlternative(roles => "[PosibleNympho]:Que va, para nada. Soy super recatada.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) =>
                roles.get("Preguntador").Relations.knows(roles.get("PosibleNympho").Name)
                && roles.get("PosibleNympho").Aspect.sex === SexKind.Female
                && roles.get("PosibleNympho").Characteristics.exists(Sentence.build("Nymphomaniac", roles.get("PosibleNympho").Individual.name))
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("PosibleNympho"))
                && postconditions.exists(Sentence.build("Saludados", roles.get("Preguntador").Individual.name, roles.get("PosibleNympho").Individual.name, true))
                && !postconditions.exists(Sentence.build("Nymphomaniac", roles.get("PosibleNympho").Individual.name)),
            ));*/

        /*this._elements.push(new Interaction(
            "IrLavabo",
            "[Desplazado] se mete en el baño.",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] se mete en el baño.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) =>
                map.getLocation("Bath").agents.length === 0
                && map.getUbication(roles.get("Desplazado")).isConnected(map.getLocation("Bath"))
                && !postconditions.exists(Sentence.build("Meado", roles.get("Desplazado").Individual.name)),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Bath"));
                return TruthTable.empty;
            },
        ));*/

        /*this._elements.push(new Interaction(
            "Mear",
            "[Meador] mea en el lavabo.",
            new RolesDescriptor("Meador"),
            [
                new Phrase("Meador")
                    .withAlternative(roles => "[Meador] se echa una relajante meadita.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Meador")).name === map.getLocation("Bath").name
                && !postconditions.exists(Sentence.build("Meado", roles.get("Meador").Individual.name)),
            (roles, map) => new TruthTable().with(Sentence.build("Meado", roles.get("Meador").Individual.name)),
        ));*/

        /*this._elements.push(new Interaction(
            "VolverLavabo",
            "[Desplazado] vuelve del baño.",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] vuelve del baño.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Desplazado")).name === map.getLocation("Bath").name
                && postconditions.exists(Sentence.build("Meado", roles.get("Desplazado").Individual.name)),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Salon"));
                return TruthTable.empty;
            },
        ));*/

        /*this._elements.push(new Interaction(
            "Beber",
            "[Bebedor] bebe.",
            new RolesDescriptor("Bebedor"),
            [
                new Phrase("Bebedor")
                    .withAlternative(roles => "[Bebedor] bebe un trago.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Bebedor")).name === map.getLocation("Salon").name
                && check(roles.get("Bebedor").Personality.politeUnpolite)
        ));*/

        /*this._elements.push(new Interaction(
            "Bailar",
            "[Bailaor] baila.",
            new RolesDescriptor("Bailaor"),
            [
                new Phrase("Bailaor")
                    .withAlternative(roles => "[Bailaor] se marca un baile sexy.", roles => Effect.empty([ EffectComponent.positive(EffectKind.Sex, EffectStrength.Medium) ]))
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Bailaor")).name === map.getLocation("Salon").name
                && check(roles.get("Bailaor").Personality.politeUnpolite)
        ));*/
    }

    get all(){
        return this._elements;
    }

    get(name: string): IInteraction | null{
        let filtered = this._elements.filter(x => x.name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}