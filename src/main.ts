
import { Engine } from './core/Engine';
import './style.css'


function game() {

  const engine = new Engine("gameCanvas", "hudCanvas");
  engine.start();

}

window.addEventListener("load", game);