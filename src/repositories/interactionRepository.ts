import { 
    IInteraction, 
    Interaction, 
    Phrase, 
    RolesDescriptor, 
    Timing 
} from "agents-flow";
import { TruthTable, Sentence } from "first-order-logic";
import { SexKind } from "npc-aspect";
import { Effect, EffectComponent, EffectKind, EffectStrength } from "npc-emotional";
import { randomFromList, check } from "role-methods";
import { Familiar } from "npc-relations";

export class InteractionRepository{
    private _elements: IInteraction[];

    constructor(){
        this._elements = [];

        this._elements.push(new Interaction(
            "SubirPersianas",
            "Subir la persianas",
            new RolesDescriptor("Subidor"),
            [
                new Phrase("Subidor")
                    .withAlternative(roles => "[Subidor] sube las persianas de las ventanas del salón.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Subidor")).name === "Salon" 
                && roles.get("Subidor").IsActive
                && roles.get("Subidor").Characteristics.is("Auxiliar"),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Penumbra"))
        ));

        this._elements.push(new Interaction(
            "CorrerCortinas",
            "Correr las cortinas",
            new RolesDescriptor("Corredor"),
            [
                new Phrase("Corredor")
                    .withAlternative(roles => "[Corredor] corre las cortinas de las ventanas del salón.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Corredor")).name === "Salon" 
                && roles.get("Corredor").IsActive
                && roles.get("Corredor").Characteristics.is("Auxiliar")
                && postconditions.exists(Sentence.build("Penumbra")),
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
                    .withAlternative(roles => "[Trabajador]: ¡Se me ha escapado otra vez el autobús!")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Trabajador")).name === "Limbo"
                && roles.get("Trabajador").IsActive
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
                    .withAlternative(roles => randomFromList([ 
                        "[Bajador] baja las escaleras cuidadosamente, con paso cansado.",
                        "[Bajador] aparece por las escaleras con paso renqueante."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Bajador")).name === "Limbo"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Bajador").IsActive
                && roles.get("Bajador").Characteristics.is("Residente")
                && !roles.get("Bajador").Characteristics.is("Impedido")
                && !roles.get("Bajador").Characteristics.is("Demente"),
            (roles, map) => {
                map.move(roles.get("Bajador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "BajarAscensor",
            "Bajar el ascensor",
            new RolesDescriptor("Bajador"),
            [
                new Phrase("Bajador")
                    .withAlternative(roles => randomFromList([
                        "Se abre la puerta del ascensor y [Bajador] sale trabajosamente para llegar al salón.",
                        "La puerta del ascensor se abre y allí aparece [Bajador] con su silla de ruedas."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Bajador")).name === "Limbo"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Bajador").IsActive
                && roles.get("Bajador").Characteristics.is("Residente")
                && roles.get("Bajador").Characteristics.is("Impedido")
                && !roles.get("Bajador").Characteristics.is("Demente"),
            (roles, map) => {
                map.move(roles.get("Bajador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "BuscarDemente",
            "Ir a buscar al residente demente",
            new RolesDescriptor("Buscador", [ "Demente" ]),
            [
                new Phrase("Buscador", "Demente")
                    .withAlternative(roles => "[Buscador]: Subo a buscar a [Demente]."),
                new Phrase("Buscador", "Demente")
                    .withAlternative(roles => "[Buscador] baja por el ascensor con [Demente] sentado en su silla de ruedas.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Buscador")).name === "Salon"
                && map.getUbication(roles.get("Demente")).name === "Limbo"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Buscador").IsActive
                && roles.get("Buscador").Characteristics.is("Auxiliar")
                && roles.get("Demente").Characteristics.is("Residente")
                && roles.get("Demente").Characteristics.is("Demente"),
            (roles, map) => {
                map.move(roles.get("Demente"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "SaludoResidenteAuxiliar",
            "[Saludador] saluda a una [Saludado]",
            new RolesDescriptor("Saludador", [ "Saludado" ]),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => "[Saludador]: ¡Buenos dias [Saludado]!"),
                new Phrase("Saludado")
                    .withAlternative(roles => roles.get("Saludador").Aspect.sex === SexKind.Male
                        ? "[Saludado]: Buenos dias caballero."
                        : "[Saludado]: Buenos dias señorita.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && roles.get("Saludado").Characteristics.is("Auxiliar")
                && roles.get("Saludador").Characteristics.is("Residente")
                && !roles.get("Saludador").Characteristics.is("Demente")
                && !roles.get("Saludado").Characteristics.is("Demente")
                && roles.get("Saludado").IsActive
                && roles.get("Saludador").IsActive
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "SaludoAuxiliarResidente",
            "[Saludador] saluda a una [Saludado]",
            new RolesDescriptor("Saludador", [ "Saludado" ]),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => roles.get("Saludado").Aspect.sex === SexKind.Male
                        ? "[Saludador]: Buenos dias don [Saludado]."
                        : "[Saludador]: Buenos dias doña [Saludado]."),
                new Phrase("Saludado")
                    .withAlternative(roles => "[Saludado]: Buenos dias guapa.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && roles.get("Saludador").Characteristics.is("Auxiliar")
                && roles.get("Saludado").Characteristics.is("Residente")
                && !roles.get("Saludador").Characteristics.is("Demente")
                && !roles.get("Saludado").Characteristics.is("Demente")
                && roles.get("Saludado").IsActive
                && roles.get("Saludador").IsActive
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "Sentarse",
            "[Sentador] se sienta",
            new RolesDescriptor("Sentador"),
            [
                new Phrase("Sentador")
                    .withAlternative(roles => "[Sentador] se sienta pesadamente en un butacón del salón.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Sentador")).name === "Salon" 
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Sentador").IsActive
                && roles.get("Sentador").Characteristics.is("Residente")
                && !roles.get("Sentador").Characteristics.is("Impedido")
                && !roles.get("Sentador").Characteristics.is("Demente"),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "AbrirLavabo",
            "[Abridor] abre el lavabo",
            new RolesDescriptor("Abridor"),
            [
                new Phrase("Abridor")
                    .withAlternative(roles => "[Abridor] quita la llave de la puerta del lavabo.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                !postconditions.exists(Sentence.build("Lavabo"))
                && roles.get("Abridor").IsActive
                && map.getUbication(roles.get("Abridor")).name === "Salon" 
                && map.getLocation("Salon").agents.length >= 4
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Abridor").Characteristics.is("Auxiliar"),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Lavabo"))
        ));

        this._elements.push(new Interaction(
            "AbrirBalcon",
            "[Abridor] abre el balcon",
            new RolesDescriptor("Abridor"),
            [
                new Phrase("Abridor")
                    .withAlternative(roles => "[Abridor] quita la llave de la puerta del balcón.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                !postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Abridor").IsActive
                && map.getUbication(roles.get("Abridor")).name === "Salon" 
                && map.getLocation("Salon").agents.length >= 4
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Abridor").Characteristics.is("Auxiliar"),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Balcon"))
        ));

        this._elements.push(new Interaction(
            "IrBalcon",
            "[Desplazado] sale al balcón",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] sale al balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                map.getLocation("Terraza").agents.length === 0
                && roles.get("Desplazado").IsActive
                && roles.get("Desplazado").Happiness.isUnhappy
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Desplazado").Characteristics.is("Auxiliar")
                && map.getUbication(roles.get("Desplazado")).isConnected(map.getLocation("Terraza")),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Terraza"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "Fumar",
            "[Fumador] se fuma un cigarro",
            new RolesDescriptor("Fumador"),
            [
                new Phrase("Fumador")
                    .withAlternative(roles => randomFromList([
                        "[Fumador] se fuma un cigarro mientras dirige su mirada perdida a la calle.",
                        "[Fumador] se fuma un cigarro con ansia.",
                        "[Fumador] apura un cigarro mirando alrededor.",
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Fumador").Happiness.isUnhappy
                && roles.get("Fumador").IsActive
                && roles.get("Fumador").Characteristics.is("Auxiliar")
                && map.getUbication(roles.get("Fumador")).name === "Terraza",
            (roles, map) => 
            {
                roles.get("Fumador").Happiness.increase(30);
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "VolverBalcon",
            "[Desplazado] vuelve del balcón",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] vuelve del balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Desplazado")).name === "Terraza"
                && roles.get("Desplazado").IsActive
                && !roles.get("Desplazado").Happiness.isUnhappy
                && map.getUbication(roles.get("Desplazado")).isConnected(map.getLocation("Salon")),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Salon"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "LlegaSocorro",
            "Socorro entra en el salón.",
            new RolesDescriptor("Llegador", [ "Visitado" ]),
            [
                new Phrase("Llegador", "Visitado")
                    .withAlternative(roles => "[Llegador], la hija de [Visitado], entra en el salón."),
                new Phrase("Llegador")
                    .withAlternative(roles => "[Llegador]: Hola papá, ¿qué tal has pasado la noche? Seguro que muy bien, ¿a que sí?")
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Llegador")).name === "Limbo"
                && map.getUbication(roles.get("Visitado")).name === "Salon"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Llegador").Name === "Socorro"
                && roles.get("Visitado").Name === "Antonio"
                && roles.get("Llegador").IsActive
                && roles.get("Visitado").IsActive
                && map.getUbication(roles.get("Llegador")).isConnected(map.getLocation("Salon")),
            (roles, map) => 
            {
                map.move(roles.get("Llegador"), map.getLocation("Salon"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "SaludoSocorroAuxiliares",
            "[Saludador] saluda a las auxiliares",
            new RolesDescriptor("Saludador", [ "Saludado1", "Saludado2" ]),
            [
                new Phrase("Saludador")
                    .withAlternative(roles => "[Saludador]: Buenos dias chicas. ¿Qué tal todo por aquí?"),
                new Phrase("Saludado1")
                    .withAlternative(roles => "[Saludado1]: Hola guapísima."),
                new Phrase("Saludado2")
                    .withAlternative(roles => "[Saludado2]: ¡Mira Antonio quién ha venido a verte!")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado1"))
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado2"))
                && roles.get("Saludado1").Characteristics.is("Auxiliar")
                && roles.get("Saludado2").Characteristics.is("Auxiliar")
                && roles.get("Saludador").Name === "Socorro"
                && roles.get("Saludado1").IsActive
                && roles.get("Saludado2").IsActive
                && roles.get("Saludador").IsActive
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado1").Individual.name, true))
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado2").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado1").Individual.name, true))
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado2").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "SaludoResidenteSocorro",
            "[Saludador] saluda a una Socorro",
            new RolesDescriptor("Saludador", [ "Saludado" ]),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => "[Saludador]: Hola Socorro, que bueno verte por aquí."),
                new Phrase("Saludado")
                    .withAlternative(roles => "[Saludado]: Hola don [Saludador], igualmente."),
                new Phrase("Saludador")
                    .withAlternative(
                        roles => "[Saludador]: Guapa y elegante, como siempre.", 
                        roles => new Effect("Saludado", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low) ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && roles.get("Saludador").Characteristics.is("Nacional")
                && roles.get("Saludado").Name === "Socorro"
                && roles.get("Saludador").IsActive
                && roles.get("Saludado").IsActive
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
        ).intimate());

        this._elements.push(new Interaction(
            "HijaAyudaFamiliar",
            "[Hija] ayuda a [Padre]",
            new RolesDescriptor("Hija", [ "Padre" ]),
            [
                new Phrase("Hija")
                    .withAlternative(roles => randomFromList([
                        "[Hija] arregla el cuello de la camisa de [Padre].",
                        "[Hija] limpia un hilillo de saliva de [Padre].",
                        "[Hija] arregla con sus dedos el despeinado pelo de [Padre].",
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Hija")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Hija"), roles.get("Padre"))
                && check(roles.get("Hija").Personality.pesimisticOptimistic)
                && roles.get("Hija").IsActive
                && roles.get("Hija").Relations.get(roles.get("Padre").Name).familiarity === Familiar.Parent,
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "TosCarraspeo",
            "[Tosedor] tose o carraspea cerca de [Escuchador]",
            new RolesDescriptor("Tosedor", [ "Escuchador" ]),
            [
                new Phrase("Tosedor", "Escuchador")
                    .withAlternative(roles => randomFromList([
                        "[Tosedor] tose con fuerza al lado de [Escuchador].",
                        "[Tosedor] carraspea profusamente cerca de [Escuchador].",
                    ]),
                    roles => new Effect("Escuchador", [ 
                        EffectComponent.negative(EffectKind.Sex, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Tosedor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Tosedor"), roles.get("Escuchador"))
                && roles.get("Tosedor").Characteristics.is("Residente")
                && roles.get("Escuchador").Characteristics.is("Auxiliar")
                && roles.get("Tosedor").IsActive
                && roles.get("Escuchador").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Tosedor").Individual.name, roles.get("Escuchador").Individual.name, true))
                && check(100 - roles.get("Tosedor").Personality.politeUnpolite),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "EncenderTele",
            "[Encendedor] enciende la tele",
            new RolesDescriptor("Encendedor"),
            [
                new Phrase("Encendedor")
                    .withAlternative(roles => "[Encendedor] enciende el televisor del salón."),
                new Phrase("Encendedor")
                    .withAlternative(roles => "En la tele están dando el \"Sálvame\".")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Encendedor")).name === "Salon"
                && roles.get("Encendedor").Characteristics.is("Auxiliar")
                && roles.get("Encendedor").IsActive
                && postconditions.exists(Sentence.build("Luz"))
                && postconditions.exists(Sentence.build("Balcon"))
                && postconditions.exists(Sentence.build("Lavabo"))
                && !postconditions.exists(Sentence.build("Tele")),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TeleCorazon"))
        ));

        this._elements.push(new Interaction(
            "PreguntaRacista",
            "[Preguntador] hace pregunta racista",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: Oye guapa, ¿todavía te juntas con el negro ese?",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    ),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: Perdone pero \"el negro ese\" tiene un nombre.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Residente")
                && !roles.get("Preguntador").Characteristics.is("Demente")
                && roles.get("Preguntador").Aspect.sex === SexKind.Male
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Racista", roles.get("Preguntador").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "PreguntaRacista2",
            "[Preguntador] hace pregunta racista y sexista",
            new RolesDescriptor("Preguntador", [ "Preguntada"/*, "Oyente", "Oyenta"*/ ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: Si sigues con el negro seguro que tiene un buen mondongo."),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada] hace como que no ha oído la frase.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Residente")
                && !roles.get("Preguntador").Characteristics.is("Demente")
                && roles.get("Preguntador").Aspect.sex === SexKind.Male
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Racista", roles.get("Preguntador").Individual.name)),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "PreguntaDomingo",
            "[Preguntador] pregunta por el marido",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: ¿Hoy no viene Domingo contigo de visita guapa?"),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: No cielo, hoy mi Domingo tiene un congreso de baile."),
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: ¡Uy qué peligro nena! Quién pudiera estar hoy en un congreso de baile...",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    )
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Auxiliar")
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "PreguntaDomingo2",
            "[Preguntador] pregunta por el marido fuera de tono",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: Qué pena que no haya venido Domingo. ¡Ese sí que me alegraría la mañana!"),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: A la única que alegra las mañanas Domingo es a mi bonita."),
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: No me extraña que te pongas celosa. Yo en tu lugar lo estaría, y mucho.",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    )
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Auxiliar")
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "ComentarioCorazon",
            "[Comentador] hace un comentario sobre programa del corazon",
            new RolesDescriptor("Comentador"),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele aparece una notícia sobre ${randomFromList([ 
                        "Isabel Preysler", 
                        "Isabel Pantoja", 
                        "Alba Carrillo", 
                        "Cristina Ortiz",
                        "Belén Esteban",
                        "Aída Nizar",
                        "Yola Berrocal",
                        "Aramis Fuster",
                        "Lydia Lozano",
                        "Nuria Bermúdez"
                    ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: No hay manera de que esta mujer se centre un poco.",
                        "[Comentador]: Qué vida más movida llevan algunas.",
                        "[Comentador]: Siempre está igual ésta. Cuando no es con uno es con otro.",
                        "[Comentador]: A saber de dónde saca tanto dinero esta tipa."
                    ])),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && roles.get("Comentador").Aspect.sex === SexKind.Female
                && roles.get("Comentador").IsHuman === false
                && roles.get("Comentador").IsActive
                && postconditions.exists(Sentence.build("TeleCorazon"))
                && !postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "CambiarCanal",
            "Pedir a [Cambiador] que cambie de canal la tele",
            new RolesDescriptor("Pedidor", [ "Cambiador" ]),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => "[Pedidor]: Nena, ¿por qué no cambias la tele a otra cosa?"),
                new Phrase("Cambiador")
                    .withAlternative(roles => "[Cambiador]: Como usted mande reina."),
                new Phrase("Pedidor")
                    .withAlternative(roles => "En la tele dan \"Estudio estadio\".")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Pedidor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Pedidor"), roles.get("Cambiador"))
                && roles.get("Cambiador").Characteristics.is("Auxiliar")
                && roles.get("Pedidor").Name === "Jacinta"
                && roles.get("Cambiador").IsActive
                && roles.get("Pedidor").IsActive
                && postconditions.exists(Sentence.build("TeleCorazon"))
                && !postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Pedidor").Individual.name, roles.get("Cambiador").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TeleDeportes"))
        ));

        this._elements.push(new Interaction(
            "ComentarioDeporte",
            "[Comentador] hace un comentario sobre programa de deporte",
            new RolesDescriptor("Comentador"),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele aparece una notícia sobre ${randomFromList([ 
                        "Usain Bolt", 
                        "Cristiano Ronaldo", 
                        "Radamel Falcao", 
                        "Edinson Cavani",
                        "Iker Casillas",
                        "Sergio Ramos",
                        "Gerard Piqué",
                        "Manuel Neuer",
                        "Didier Drogba"
                    ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => roles.get("Comentador").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[Comentador]: Menudo paquete. Los deportistas de hoy día van todos drogados.",
                            "[Comentador]: Un inútil. A hacer la vendimia lo ponía yo a ver cuanto duraba.",
                            "[Comentador]: Si no fuera por el Eufemiano Fuentes a este no lo conocen ni en su casa.",
                            "[Comentador]: Va éste más depilado que mi señora esposa que en paz descanse."
                        ])
                        : randomFromList([
                            "[Comentador]: Las piernas de este tio deberían estar prohibidas.",
                            "[Comentador]: No me importaría tener que untar aceite en esos muslos.",
                            "[Comentador]: Quién agarrara a uno de estos, me solucionaba la vida.",
                            "[Comentador]: Uno como ese me tengo que cazar yo, y a vivir como una reina."
                        ])),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").IsHuman === false
                && roles.get("Comentador").IsActive
                && (roles.get("Comentador").Characteristics.is("Auxiliar") || roles.get("Comentador").Characteristics.is("Residente"))
                && postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "CambiarCanal2",
            "Pedir a [Cambiador] que cambie de canal la tele",
            new RolesDescriptor("Pedidor", [ "Cambiador" ]),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => "[Pedidor]: Nena, esto me aburre. Pon otra cosa anda."),
                new Phrase("Cambiador")
                    .withAlternative(roles => "[Cambiador]: Como usted prefiera doña Jacinta."),
                new Phrase("Pedidor")
                    .withAlternative(roles => "En la tele ahora dan el telediario.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Pedidor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Pedidor"), roles.get("Cambiador"))
                && roles.get("Cambiador").Characteristics.is("Auxiliar")
                && roles.get("Pedidor").Name === "Jacinta"
                && roles.get("Cambiador").IsActive
                && roles.get("Pedidor").IsActive
                && postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Pedidor").Individual.name, roles.get("Cambiador").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TelePolitica"))
        ));

        this._elements.push(new Interaction(
            "CaeAlgo",
            "A [Caedor] se le cae algo",
            new RolesDescriptor("Caedor", [ "Recogedor" ]),
            [
                new Phrase("Caedor", "Recogedor")
                    .withAlternative(roles => randomFromList([
                        "[Caedor] tira disimuladamente un pañuelo al suelo cuando [Recogedor] pasa por su lado.",
                        "[Caedor] tira fingiendo un despiste su reloj de bolsillo al suelo cuando [Recogedor] pasa por su lado."
                    ])),
                new Phrase("Recogedor", "Caedor")
                    .withAlternative(
                        roles => "[Recogedor] se agacha justo delante de [Caedor] y se lo devuelve.",
                        roles => new Effect("Caedor", [
                            EffectComponent.positive(EffectKind.Sex, EffectStrength.Medium),
                            EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low)
                        ])),
                new Phrase("Caedor", "Recogedor")
                    .withAlternative(roles => "[Caedor]: Muchas gracias guapísima.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Caedor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Caedor"), roles.get("Recogedor"))
                && roles.get("Recogedor").Characteristics.is("Auxiliar")
                && roles.get("Caedor").Characteristics.is("Residente")
                && !roles.get("Caedor").Characteristics.is("Demente")
                && roles.get("Caedor").Aspect.sex === SexKind.Male
                && roles.get("Recogedor").IsActive
                && roles.get("Caedor").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Caedor").Individual.name, roles.get("Recogedor").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "Medicacion",
            "[Medicador] da la medicación a [Medicado]",
            new RolesDescriptor("Medicador", [ "Medicado" ]),
            [
                new Phrase("Medicador", "Medicado")
                    .withAlternative(roles => "[Medicador] prepara el pastillero y un vasito de agua para [Medicado]."),
                new Phrase("Medicador", "Medicado")
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente")
                            ? "[Medicador]: Venga, le abrimos la boquita y pa'dentro."
                            : randomFromList([
                                "[Medicador]: Venga [Medicado], ya tienes preparadas tus chucherías de la mañana.",
                                "[Medicador]: Venga [Medicado], aquí tienes el vasito con los caramelitos matutinos.",
                                "[Medicador]: Venga [Medicado], todas de un trago. Que te vea yo.",
                            ]),
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? Effect.null() 
                            : new Effect("Medicado", [ EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) ])
                    ),
                new Phrase("Medicado")
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? "[Medicado] se traga las pastillas mecánicamente." 
                            : "[Medicado] se traga las pastillas a disgusto.",
                        roles => Effect.null(),
                        roles => Sentence.build("Medicado", roles.get("Medicado").Individual.name)
                    )
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? "[Medicado] se traga las pastillas mecánicamente." 
                            : "[Medicado] finge tragarse las pastillas para escupirlas después.",
                        roles => Effect.null(),
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? Sentence.build("Medicado", roles.get("Medicado").Individual.name)
                            : Sentence.build("MedicadoFake", roles.get("Medicado").Individual.name)
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Medicador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Medicador"), roles.get("Medicado"))
                && roles.get("Medicador").Characteristics.is("Auxiliar")
                && roles.get("Medicado").Characteristics.is("Residente")
                && roles.get("Medicador").IsActive
                && roles.get("Medicado").IsActive
                && postconditions.exists(Sentence.build("Luz"))
                && postconditions.exists(Sentence.build("Balcon"))
                && postconditions.exists(Sentence.build("Lavabo"))
                && !postconditions.exists(Sentence.build("Tele"))
                && !postconditions.exists(Sentence.build("Medicado", roles.get("Medicado").Individual.name))
                && !postconditions.exists(Sentence.build("MedicadoFake", roles.get("Medicado").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Medicador").Individual.name, roles.get("Medicado").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "IrLavabo",
            "[Meador] pide a [Portador] que le ayude a ir al lavabo",
            new RolesDescriptor("Meador", [ "Portador" ]),
            [
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador]: Perdona [Portador], creo que tengo una urgencia. ¿Podrías ayudarme a ir al lavabo?"),
                new Phrase("Portador", "Meador")
                    .withAlternative(roles => "[Portador]: Faltaría más don [Meador], vamos ahora mismo."),
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador] se mete en el lavabo con la ayuda de [Portador].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Meador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Meador"), roles.get("Portador"))
                && roles.get("Portador").Characteristics.is("Auxiliar")
                && roles.get("Meador").Characteristics.is("Residente")
                && !roles.get("Meador").Characteristics.is("Demente")
                && roles.get("Meador").Characteristics.is("Impedido")
                && roles.get("Meador").Aspect.sex === SexKind.Male
                && roles.get("Portador").IsActive
                && roles.get("Meador").IsActive
                && map.getLocation("Lavabo").agents.length === 0
                && postconditions.exists(Sentence.build("Lavabo"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Meador").Individual.name, roles.get("Portador").Individual.name, true)),
            (roles, map) => {
                map.move(roles.get("Meador"), map.getLocation("Lavabo"));
                map.move(roles.get("Portador"), map.getLocation("Lavabo"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "VerPechuga",
            "[Salido] pide a [Mostrador] que le enseñe pechuga",
            new RolesDescriptor("Salido", [ "Mostrador" ]),
            [
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Oye [Mostrador] bonita, se que es feo que lo pida pero, ¿podrías enseñarme un poco de pechuga ahora que no nos ve nadie?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Siempre estamos igual don [Salido]..."),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Soy un hombre mayor encerrado, solo Dios sabe lo que me queda en este mundo. ¿Qué gusto me puedo dar yo a estas alturas?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Bueno bueno, a ver que se puede hacer. ¿Tiene usted por ahí 20 eurillos?"),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(
                        roles => "[Salido] se saca un billete de 20 de la camisa y se lo da a [Mostrador] que lo guarda rápidamente en su bolsillo.",
                        roles => new Effect("Mostrador", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) ])
                    ),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(
                        roles => "[Mostrador] se desabrocha la bata y la blusa, y enseña durante unos segundos el sostén a [Salido]. Al poco se abrocha todo de nuevo.",
                        roles => new Effect("Salido", [ 
                            EffectComponent.positive(EffectKind.Sex, EffectStrength.High), 
                            EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salido")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Salido"), roles.get("Mostrador"))
                && roles.get("Mostrador").Characteristics.is("Auxiliar")
                && roles.get("Salido").Characteristics.is("Residente")
                && !roles.get("Salido").Characteristics.is("Demente")
                && roles.get("Salido").Characteristics.is("Impedido")
                && roles.get("Salido").Aspect.sex === SexKind.Male
                && roles.get("Mostrador").IsActive
                && roles.get("Salido").IsActive
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Salido").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Pobre", roles.get("Salido").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "VerPechugaFallido",
            "[Salido] pide a [Mostrador] que le enseñe pechuga",
            new RolesDescriptor("Salido", [ "Mostrador" ]),
            [
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Oye [Mostrador] bonita, se que es feo que lo pida pero, ¿podrías enseñarme un poco de pechuga ahora que no nos ve nadie?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Siempre estamos igual don [Salido]..."),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Soy un hombre mayor encerrado, solo Dios sabe lo que me queda en este mundo. ¿Qué gusto me puedo dar yo a estas alturas?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Bueno bueno, a ver que se puede hacer. ¿Tiene usted por ahí 20 eurillos?"),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Es que no me queda ya nada para este mes. ¿Podrías hacerle el gusto a este pobre viejo?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(
                        roles => "[Mostrador]: Me temo que no don [Salido]. Habrá que esperar a que su familia le de su próximo aguinaldo.",
                        roles => new Effect("Salido", [ 
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salido")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Salido"), roles.get("Mostrador"))
                && roles.get("Mostrador").Characteristics.is("Auxiliar")
                && roles.get("Salido").Characteristics.is("Residente")
                && !roles.get("Salido").Characteristics.is("Demente")
                && roles.get("Salido").Characteristics.is("Impedido")
                && roles.get("Salido").Aspect.sex === SexKind.Male
                && roles.get("Mostrador").IsActive
                && roles.get("Salido").IsActive
                && postconditions.exists(Sentence.build("Pobre", roles.get("Salido").Individual.name)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "Cagar",
            "[Caganer] caga",
            new RolesDescriptor("Caganer", [ "Otro" ]),
            [
                new Phrase("Caganer")
                    .withAlternative(roles => "[Caganer] hace de vientre entre estridentes flatulencias."),
                new Phrase("Caganer", "Otro")
                    .withAlternative(
                        roles => "[Caganer]: ¡Se me esta resistiendo el condenado!",
                        roles => new Effect("Otro", [ EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) ])
                    ),
                new Phrase("Otro", "Caganer")
                    .withAlternative(roles => "[Otro]: Hay que comer más fibra don [Caganer].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Caganer")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Caganer"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Caganer").Characteristics.is("Residente")
                && !roles.get("Caganer").Characteristics.is("Demente")
                && roles.get("Caganer").Characteristics.is("Impedido")
                && roles.get("Caganer").Aspect.sex === SexKind.Male
                && roles.get("Otro").IsActive
                && roles.get("Caganer").IsActive
                && !postconditions.exists(Sentence.build("Cagado", roles.get("Caganer").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Cagado", roles.get("Caganer").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "VolverLavabo",
            "[Meador] y [Portador] vuelven del lavabo",
            new RolesDescriptor("Meador", [ "Portador" ]),
            [
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador] y [Portador] vuelven del lavabo.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Meador")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Meador"), roles.get("Portador"))
                && roles.get("Portador").Characteristics.is("Auxiliar")
                && roles.get("Meador").Characteristics.is("Residente")
                && !roles.get("Meador").Characteristics.is("Demente")
                && roles.get("Meador").Characteristics.is("Impedido")
                && roles.get("Meador").Aspect.sex === SexKind.Male
                && roles.get("Portador").IsActive
                && roles.get("Meador").IsActive
                && postconditions.exists(Sentence.build("Lavabo"))
                && map.getLocation("Lavabo").agents.length === 2
                && postconditions.exists(Sentence.build("Pobre", roles.get("Meador").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Meador"), map.getLocation("Salon"));
                map.move(roles.get("Portador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "IrBalconResidente",
            "[Salidor] sale al balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] se levanta y se va andando pesadamente al balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Salon"
                && roles.get("Salidor").Characteristics.is("Residente")
                && roles.get("Salidor").Characteristics.is("Fumador")
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Salidor").IsActive
                && map.getLocation("Terraza").agents.length === 1
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Salidor").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Terraza"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "FumarEstrangis",
            "[Fumador] pide a [Otro] que le deje fumar",
            new RolesDescriptor("Fumador", [ "Otro" ]),
            [
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Oye [Otro] bonita, se que no debería pero, ¿podrías dejarme darle una caladita a uno de esos cigarros?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: A su edad don [Fumador]..."),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: ¿Qué otro gusto me puedo dar ya a estas alturas?. Una caladita no me va a matar mujer."),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: Bueno bueno, piense que el tabaco va muy caro hoy en día. ¿Tiene usted por ahí 5 eurillos?"),
                new Phrase("Fumador", "Otro")
                    .withAlternative(
                        roles => "[Fumador] saca un billete de 5 del bolsillo y se lo da a [Otro] que lo mete cuidadosamente en un bolsillo de la bata.",
                        roles => new Effect("Otro", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.Medium) ])
                    ),
                new Phrase("Otro", "Fumador")
                    .withAlternative(
                        roles => "[Otro] le acerca un pitillo encendido a [Fumador], que aspira como si le fuera la vida en ello. Después tose grotescamente hasta casi la arcada.",
                        roles => new Effect("Fumador", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Fumador")).name === "Terraza"
                && map.areInTheSameLocation(roles.get("Fumador"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Fumador").Characteristics.is("Residente")
                && roles.get("Fumador").Characteristics.is("Fumador")
                && roles.get("Otro").IsActive
                && roles.get("Fumador").IsActive
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Fumador").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Pobre", roles.get("Fumador").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "FumarEstrangisFallido",
            "[Fumador] pide a [Otro] que le deje fumar",
            new RolesDescriptor("Fumador", [ "Otro" ]),
            [
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Oye [Otro] bonita, se que no debería pero, ¿podrías dejarme darle una caladita a uno de esos cigarros?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: A su edad don [Fumador]..."),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: ¿Qué otro gusto me puedo dar ya a estas alturas?. Una caladita no me va a matar mujer."),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: Bueno bueno, piense que el tabaco va muy caro hoy en día. ¿Tiene usted por ahí 5 eurillos?"),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Es que no me queda ya nada para este mes. ¿No podrías dejarme ni siquiera una caladita?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(
                        roles => "[Otro]: No va a poder ser don [Fumador]. Habrá que esperar a que su familia le de algo más de dinerillo.",
                        roles => new Effect("Fumador", [ 
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Fumador")).name === "Terraza"
                && map.areInTheSameLocation(roles.get("Fumador"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Fumador").Characteristics.is("Residente")
                && roles.get("Fumador").Characteristics.is("Fumador")
                && roles.get("Otro").IsActive
                && roles.get("Fumador").IsActive
                && postconditions.exists(Sentence.build("Pobre", roles.get("Fumador").Individual.name)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "VolverBalconResidente",
            "[Salidor] vuelve del balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] entra de nuevo en el salón y se deja caer sobre una butaca.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Terraza"
                && roles.get("Salidor").Characteristics.is("Residente")
                && !roles.get("Salidor").Characteristics.is("Demente")
                && !roles.get("Salidor").Characteristics.is("Impedido")
                && roles.get("Salidor").IsActive
                && map.getLocation("Terraza").agents.length === 1
                && postconditions.exists(Sentence.build("Pobre", roles.get("Salidor").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "ResidenteDuerme",
            "[Dormidor] se duerme",
            new RolesDescriptor("Dormidor"),
            [
                new Phrase("Dormidor")
                    .withAlternative(roles => roles.get("Dormidor").Aspect.sex === SexKind.Male 
                        ? "[Dormidor] se queda dormido."
                        : "[Dormidor] se queda dormida."
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Dormidor")).name === "Salon"
                && roles.get("Dormidor").Characteristics.is("Residente")
                && roles.get("Dormidor").IsActive
                && postconditions.exists(Sentence.build("Medicado", roles.get("Dormidor").Individual.name))
                && !postconditions.exists(Sentence.build("Descansado", roles.get("Dormidor").Individual.name)),
            (roles, map) => {
                roles.get("Dormidor").deactivate();
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "ResidenteDespierta",
            "[Dormidor] se despierta",
            new RolesDescriptor("Dormidor"),
            [
                new Phrase("Dormidor")
                    .withAlternative(roles => roles.get("Dormidor").Aspect.sex === SexKind.Male 
                        ? randomFromList([
                            "[Dormidor] se despierta sobresaltado, mirando alrededor.",
                            "[Dormidor] se despierta taciturno."
                         ])
                        : "[Dormidor] se despierta tranquilamente."
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Dormidor")).name === "Salon"
                && roles.get("Dormidor").Characteristics.is("Residente")
                && !roles.get("Dormidor").IsActive,
            (roles, map) => {
                roles.get("Dormidor").activate();
                return new TruthTable()
                    .with(Sentence.build("Descansado", roles.get("Dormidor").Individual.name));
            }
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoFavorableIzquierdas",
            "[Comentador] comenta noticia sobre política favorable a la izquierda",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre ${randomFromList([ "el PSOE", "IU" ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: La izquierda siempre le ha venido bien a este país.",
                        "[Comentador]: Cuando gobierna la izquierda las cosas se hacen bien.",
                        "[Comentador]: Como siempre la izquierda defendiéndonos a todos de los explotadores de siempre."
                    ])),
                new Phrase("Contrario", "Comentador")
                    .withAlternative(
                        roles => "[Contrario]: si hubieran ganado la guerra ahora seríamos como Cuba.",
                        roles => new Effect("Comentador", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.High),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.High)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Republicano")
                && roles.get("Contrario").Characteristics.is("Nacional")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoFavorableDerechas",
            "[Comentador] comenta noticia sobre política favorable a la derecha",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre ${randomFromList([ "el PP", "Ciudadanos" ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: Menos mal que la derecha siempre pone orden.",
                        "[Comentador]: Con la derecha la economía siempre va bien.",
                        "[Comentador]: Cuando gobierna la derecha hay trabajo para todo el mundo, menos para los vagos."
                    ])),
                new Phrase("Contrario", "Comentador")
                    .withAlternative(
                        roles => "[Contrario]: si no hubieran ganado la guerra ahora seríamos como Inglaterra o Francia.",
                        roles => new Effect("Comentador", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.High),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.High)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Nacional")
                && roles.get("Contrario").Characteristics.is("Republicano")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoChanchulloDerechas",
            "[Comentador] comenta noticia sobre política desfavorable a la derecha",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre un escándalo ${randomFromList([ "del PP", "de Ciudadanos" ])}.`),
                new Phrase("Comentador", "Contrario")
                    .withAlternative(
                        roles => randomFromList([
                            "[Comentador]: Ahí lo tienes [Contrario], los descendientes de Franco haciendo de las suyas.",
                            "[Comentador]: Ahí van los tuyos [Contrario], más que un partido son una banda criminal."
                        ]),
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.High),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.High)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Republicano")
                && roles.get("Contrario").Characteristics.is("Nacional")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoChanchulloIzquierdas",
            "[Comentador] comenta noticia sobre política desfavorable a la izquierda",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre un chanchullo ${randomFromList([ "del PSOE", "de IU" ])}.`),
                new Phrase("Comentador", "Contrario")
                    .withAlternative(
                        roles => randomFromList([
                            "[Comentador]: Ahí lo tienes [Contrario], los comunistas siempre amasando el dinero ajeno.",
                            "[Comentador]: Ahí van los tuyos [Contrario], fusilados tendrían que acabar todos esos."
                        ]),
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.High),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.High)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Nacional")
                && roles.get("Contrario").Characteristics.is("Republicano")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => TruthTable.empty
        ));

        // -----------------------------------------------------------------------------------------------------------------------------------------
        // -----------------------------------------------------------------------------------------------------------------------------------------
        // -----------------------------------------------------------------------------------------------------------------------------------------

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