import { MapStructure, World, Scenario, FinishingConditions, Agents, Input } from 'agents-flow';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AgentRepository } from './repositories/agentRepository';
import { InteractionRepository } from './repositories/interactionRepository';
import { LocationRepository } from './repositories/locationRepository';
import { Functions } from './logic/functions';
import { Rules } from './logic/rules';
import { Tables } from './logic/truthTables';
import { parse } from "./reactionsParser";

const CONTINUE = "Continuar";
const START = "Comenzar";

function App() {

  const [ count, setCount ] = useState(0);
  const [ output, setOutput ] = useState([ "--LA RESIDENCIA--" ] as string[]);

  const [ world, setWorld ] = useState(null as World);
  const [ choices, setChoices ] = useState([ START ] as string[])

  let agents: AgentRepository = new AgentRepository();
  let locations: LocationRepository = new LocationRepository();
  let interactions: InteractionRepository = new InteractionRepository();

  let map: MapStructure = new MapStructure(locations.all);

  useEffect(() => {  
    window.process = {
      ...window.process,
    };

    loadLogicData();
    intializeAgentsLocation();
    initializeAgentDesires();
    createWorld();
  }, []);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [ count ]);

  function loadLogicData(): void{
    for(let agent of agents.all){
      for(let func of Functions.all){
        agent.logic.functions.add(func);
      }

      for(let axiom of Rules.all){
        agent.logic.rules.add(axiom);
      }
      
      for(let known of agent.Relations.knowns){
        agent.logic.population.add(agents.get(known).Individual);
      }

      agent.logic.table = Tables.tableFrom(agent.Name);
    }
  }

  function intializeAgentsLocation(): void{
    let limbo = map.getLocation("Limbo");

    for(let agent of agents.all){
      map.move(agent, limbo);
    }

    map.move(agents.get("Raquel"), map.getLocation("Salon"));
  }

  function initializeAgentDesires(): void{
    /*let ron = agents.get("Ron");
    let agatha = agents.get("Agatha");

    ron.Desires.append(new Desire(crowd => {
      let aga = crowd.get("Agatha");
      let relation = aga.Relations.get("Ron");
      return (relation.metrics.friendship + relation.metrics.love + agatha.Happiness.value) / 3;
    }, [ agatha.Name ]));*/
  }

  function createWorld(): void{
    var residenceScenario = new Scenario(
      "En la residencia",
      map,
      new Agents(agents.all),
      interactions.all,
      new FinishingConditions()
          .with(scenario => scenario.turn === 100));
    
    let newWorld = new World();
    newWorld.add(residenceScenario);

    setWorld(newWorld);
  }

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    const button: HTMLButtonElement = event.currentTarget;
    setCount(count + 1);

    let input = Input.void();
    if(button != null){
      if(button.innerText !== CONTINUE && button.innerText !== START){
        input = new Input(Number(button.name));
      }
    }

    let step = world.currentScenario.performStep(input);
    setWorld(world);
    
    show(step.content);

    let newChoices: string[] = [];
    if(step.hasChoices){
      for(let choice of step.choices.items){
        newChoices.push(choice);
      }

      setChoices(newChoices);
    }
    else{
      newChoices.push(CONTINUE);
      setChoices(newChoices);
    }

    if(step.hasReactions){
      let newReactions: string[] = parse(step.reactions);
      show(newReactions);
    }

    moveScrolledDivToBottom();
  };

  function moveScrolledDivToBottom(): void{
    let scrolledDiv = document.getElementById("scrolledDiv");
    if(scrolledDiv !== null){
      scrolledDiv.scrollTop = (scrolledDiv.scrollHeight as number) - 50;
    }
  }

  function show(texts: string[]): void{
    for(let text of texts){
      output.push(text);
    }
    
    setOutput(output);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-container">
          <div id="scrolledDiv" className="flex-scrolled-child">
            {output.map(text => <p>{ text }</p>)}
          </div>
          <div className="flex-child">
            {choices.map((choice, index) => <p><button name={index + ""} onClick={onButtonClick}>{ choice }</button></p>)}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
