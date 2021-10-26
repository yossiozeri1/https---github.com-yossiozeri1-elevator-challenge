import React from 'react';
import img from './elv.png';


function Elevators(props){
  return(
    <img src={img} className="Elevator" alt="Elevators"  width= "110px"
    height= "110px" style={{position: "relative", top:((props.floors-1)*110)-110*props.floor,transition:`top ${props.time}s linear`}}></img>
  );
}
export default Elevators;
