import { Agent } from "agents-flow";

import anselmo_happy from './images/toon/anselmo_happy.png';
import anselmo_normal from './images/toon/anselmo_normal.png';
import anselmo_unhappy from './images/toon/anselmo_unhappy.png';
import fructuoso_happy from './images/toon/fructuoso_happy.png';
import fructuoso_normal from './images/toon/fructuoso_normal.png';
import fructuoso_unhappy from './images/toon/fructuoso_unhappy.png';
import jacinta_happy from './images/toon/jacinta_happy.png';
import jacinta_normal from './images/toon/jacinta_normal.png';
import jacinta_unhappy from './images/toon/jacinta_unhappy.png';
import maria_happy from './images/toon/maria_happy.png';
import maria_normal from './images/toon/maria_normal.png';
import maria_unhappy from './images/toon/maria_unhappy.png';
import mariano_happy from './images/toon/mariano_happy.png';
import mariano_normal from './images/toon/mariano_normal.png';
import mariano_unhappy from './images/toon/mariano_unhappy.png';
import raquel_happy from './images/toon/raquel_happy.png';
import raquel_normal from './images/toon/raquel_normal.png';
import raquel_unhappy from './images/toon/raquel_unhappy.png';
import recepcionista_happy from './images/toon/recepcionista_happy.png';
import recepcionista_normal from './images/toon/recepcionista_normal.png';
import recepcionista_unhappy from './images/toon/recepcionista_unhappy.png';
import socorro_happy from './images/toon/socorro_happy.png';
import socorro_normal from './images/toon/socorro_normal.png';
import socorro_unhappy from './images/toon/socorro_unhappy.png';

import anselmo_happy_old from './images/old/anselmo_happy.png';
import anselmo_normal_old from './images/old/anselmo_normal.png';
import anselmo_unhappy_old from './images/old/anselmo_unhappy.png';
import fructuoso_happy_old from './images/old/fructuoso_happy.png';
import fructuoso_normal_old from './images/old/fructuoso_normal.png';
import fructuoso_unhappy_old from './images/old/fructuoso_unhappy.png';
import jacinta_happy_old from './images/old/jacinta_happy.png';
import jacinta_normal_old from './images/old/jacinta_normal.png';
import jacinta_unhappy_old from './images/old/jacinta_unhappy.png';
import maria_happy_old from './images/old/maria_happy.png';
import maria_normal_old from './images/old/maria_normal.png';
import maria_unhappy_old from './images/old/maria_unhappy.png';
import mariano_happy_old from './images/old/mariano_happy.png';
import mariano_normal_old from './images/old/mariano_normal.png';
import mariano_unhappy_old from './images/old/mariano_unhappy.png';
import raquel_happy_old from './images/old/raquel_happy.png';
import raquel_normal_old from './images/old/raquel_normal.png';
import raquel_unhappy_old from './images/old/raquel_unhappy.png';
import recepcionista_happy_old from './images/old/recepcionista_happy.png';
import recepcionista_normal_old from './images/old/recepcionista_normal.png';
import recepcionista_unhappy_old from './images/old/recepcionista_unhappy.png';
import socorro_happy_old from './images/old/socorro_happy.png';
import socorro_normal_old from './images/old/socorro_normal.png';
import socorro_unhappy_old from './images/old/socorro_unhappy.png';

export function buildPortraitFor(agent: Agent, vintage: boolean): string{
    if(agent.Name === "Anselmo"){
        return agent.Happiness.isHappy
            ? vintage ? anselmo_happy_old : anselmo_happy
            : agent.Happiness.isUnhappy
                ? vintage ? anselmo_unhappy_old : anselmo_unhappy
                : vintage ? anselmo_normal_old : anselmo_normal;
    }
    else if(agent.Name === "Fructuoso"){
        return agent.Happiness.isHappy
            ? vintage ? fructuoso_happy_old : fructuoso_happy
            : agent.Happiness.isUnhappy
                ? vintage ? fructuoso_unhappy_old : fructuoso_unhappy
                : vintage ? fructuoso_normal_old : fructuoso_normal;
    }
    else if(agent.Name === "Jacinta"){
        return agent.Happiness.isHappy
            ? vintage ? jacinta_happy_old : jacinta_happy
            : agent.Happiness.isUnhappy
                ? vintage ? jacinta_unhappy_old : jacinta_unhappy
                : vintage ? jacinta_normal_old : jacinta_normal;
    }
    else if(agent.Name === "Maria"){
        return agent.Happiness.isHappy
            ? vintage ? maria_happy_old : maria_happy
            : agent.Happiness.isUnhappy
                ? vintage ? maria_unhappy_old : maria_unhappy
                : vintage ? maria_normal_old : maria_normal;
    }
    else if(agent.Name === "Raquel"){
        return agent.Happiness.isHappy
            ? vintage ? raquel_happy_old : raquel_happy
            : agent.Happiness.isUnhappy
                ? vintage ? raquel_unhappy_old : raquel_unhappy
                : vintage ? raquel_normal_old : raquel_normal;
    }
    else if(agent.Name === "Socorro"){
        return agent.Happiness.isHappy
            ? vintage ? socorro_happy_old : socorro_happy
            : agent.Happiness.isUnhappy
                ? vintage ? socorro_unhappy_old : socorro_unhappy
                : vintage ? socorro_normal_old : socorro_normal;
    }
    else if(agent.Name === "Mariano"){
        return agent.Happiness.isHappy
            ? vintage ? mariano_happy_old : mariano_happy
            : agent.Happiness.isUnhappy
                ? vintage ? mariano_unhappy_old : mariano_unhappy
                : vintage ? mariano_normal_old : mariano_normal;
    }
    else if(agent.Name === "Recepcionista"){
        return agent.Happiness.isHappy
            ? vintage ? recepcionista_happy_old : recepcionista_happy
            : agent.Happiness.isUnhappy
                ? vintage ? recepcionista_unhappy_old : recepcionista_unhappy
                : vintage ? recepcionista_normal_old : recepcionista_normal;
    }
    
    return "";
}