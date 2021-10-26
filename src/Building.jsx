import React from 'react';
import Elevators from './Elevators.jsx';
import song from "./ding.mp3";
import './help.css';
import './main.css';

const NumberOfFloors=15;
const NumberOfElevators=3;


let array=[];
function arrayFill(array){
  for (let i = NumberOfFloors-1, j = 0; i >= 0; i--,j++) {
    array[j]=i;
  }
}
arrayFill(array);

function play(){
  let audio= new Audio(song);
  audio.play()}

function indexMin(array){
  let min=[array[0],0];
  for(let i=1;i<array.length;i++){
    if(array[i]<min[0]){
      min=[array[i],i];
    }
  }
  return min;}


class Building extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      designatedElavators:Array.from({ length: NumberOfElevators }, () => ([0,0])), colorFloor:Array(NumberOfFloors).fill(0),
      check : Array(NumberOfFloors).fill(false), queueElevatoes : Array.from({ length: NumberOfElevators }, () => ([])),
      elevatorStop : Array(NumberOfElevators).fill(0), ElevatorLocation : Array(NumberOfElevators).fill(0),
      timeElevator : Array(NumberOfElevators).fill(0)
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => {
        this.updateTimeElevatorsToFloor();
        this.updateTimeElevatorToQueue(); 
        
        for (let elevator = 0; elevator < NumberOfElevators; elevator++) {
          if(this.state.queueElevatoes[elevator].length){
            if(this.state.queueElevatoes[elevator][0]!==this.state.ElevatorLocation[elevator]){
              this.updateElevatorLocation(elevator);
              this.suondElevator(elevator)
            }else if(this.waitingTwoSeconds(elevator)){
              this.updataCheck(this.state.queueElevatoes[elevator][0],false);
              this.state.queueElevatoes[elevator].shift()
              if(this.state.queueElevatoes[elevator].length){
                this.updateLocathinAndTime(this.state.queueElevatoes[elevator][0],elevator);
              }}
          }
        }
         }, 500 );
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
  }
  // Returns true when the elevator waited two seconds on the ordered floor
  waitingTwoSeconds(elevator){
    
      if(this.state.elevatorStop[elevator]!==3){
        const elevatorStop = this.state.elevatorStop.slice();
        elevatorStop[elevator] = this.state.elevatorStop[elevator]+1;
        this.setState({elevatorStop: elevatorStop, });
        return false
      }else{
      const elevatorStop = this.state.elevatorStop.slice();
      elevatorStop[elevator] = 0;
      this.setState({elevatorStop: elevatorStop, });
      return true;
    }
  }
  // Update the elevator location at any given moment
  updateElevatorLocation(elevator){
    
    if(this.state.queueElevatoes[elevator].length){
      if(this.state.queueElevatoes[elevator][0]>this.state.ElevatorLocation[elevator]){
        const ElevatorLocation = this.state.ElevatorLocation.slice();
        ElevatorLocation[elevator] = this.state.ElevatorLocation[elevator]+1;
        this.setState({ElevatorLocation: ElevatorLocation, });
      }else if(this.state.queueElevatoes[elevator][0]<this.state.ElevatorLocation[elevator]){
        const ElevatorLocation = this.state.ElevatorLocation.slice();
        ElevatorLocation[elevator] = this.state.ElevatorLocation[elevator]-1;
        this.setState({ElevatorLocation: ElevatorLocation, });
      }
    }
  }
  // Make a sound when an elevator reaches the floor
  suondElevator(elevator){
    if(this.state.ElevatorLocation[elevator]===this.state.queueElevatoes[elevator][0]){
      play();}
  }
  // Update the time the elevator marks the queue for all elevators
  updateTimeElevatorToQueue(){
    for (let elevator = 0; elevator < NumberOfElevators; elevator++) {
      const timeElevator = this.state.timeElevator.slice();
      timeElevator[elevator] = this.state.timeElevator[elevator] ? this.state.timeElevator[elevator]-(0.5) : 0;
      this.setState({timeElevator: timeElevator, });}
  }
  // Update elevator arrival time for each floor
  updateTimeElevatorsToFloor(){
    for(let floor=0;floor<NumberOfFloors;floor++){
      const StandbyTime = this.state.colorFloor.slice();
      StandbyTime[floor] = this.state.colorFloor[floor] ? this.state.colorFloor[floor]-(0.5) : 0;
      this.setState({
        colorFloor: StandbyTime,
      });
    }
  }
  // Calculate which elevator will get to the ordered floor the fastest
  fastestQueue(floor){
    const min = new Array(NumberOfElevators).fill(0);
    for (let i = 0; i < NumberOfElevators; i++) {
      if(this.state.queueElevatoes[i].length){
        min[i]=this.state.timeElevator[i]+(Math.abs(this.state.queueElevatoes[i][this.state.queueElevatoes[i].length-1]-floor)/2);
      }else{min[i]=this.state.timeElevator[i]+(Math.abs(this.state.ElevatorLocation[i]-floor)/2);}
    }
    const timeElevator = this.state.timeElevator.slice();
    timeElevator[indexMin(min)[1]] = indexMin(min)[0]+2;
    this.setState({timeElevator: timeElevator, });
    return indexMin(min);
  }
  // Update for the animation of the elevator to which floor to reach and for how long
  updateLocathinAndTime(floor,elevator){
    const time=Math.abs(this.state.designatedElavators[elevator][0]-floor)/2
    const designatedElavators = this.state.designatedElavators.slice();
    designatedElavators[elevator] =[ floor,time]
    this.setState({
      designatedElavators: designatedElavators,
    });
  }
  // Update if an elevator has been ordered for this floor
  updataCheck(floor,state){
    const check = this.state.check.slice();
    check[floor] = state;
    this.setState({check: check, });
  }
  // Update the time it will take for the elevator that has been ordered to reach the floor
  updateTimeElevatorToFloor(floor,time){
    const colorFloor = this.state.colorFloor.slice();
    colorFloor[floor] = this.state.colorFloor[floor] ? 0 :time;
    this.setState({
      colorFloor: colorFloor,
    });
  }

  elevatorOrder(event){
    if(!this.state.check[Number(event.id)]){
      const min = this.fastestQueue(Number(event.id));
      if(!this.state.queueElevatoes[min[1]].length){
        this.updateLocathinAndTime(Number(event.id),min[1])
      }
      
      this.state.queueElevatoes[min[1]].push(Number(event.id));
      
      this.updataCheck(Number(event.id),true);
      
      this.updateTimeElevatorToFloor(event.id,min[0]);
    } 
  }

  render() {
    return (
      <div style={{  
          display:"grid",  
          gridTemplateColumns: "3fr 30fr 300fr 3000fr 30000fr"  
        }}>
        <div>
         {array.map((floor) => (
           <div>
           <div className="blackline"></div>
           <div className="floor"
           style={{ width: "200px",
                    height: "103px",
                    display:"grid",  
                    gridTemplateColumns: "200fr 40fr "  
              }}>
           <button class="metal linear" style={{color:this.state.colorFloor[floor] ? "green" : "black" }} id={floor} onClick={(e) => this.elevatorOrder(e.target)}>{floor}</button>
           <h4>{this.state.colorFloor[floor]? this.state.colorFloor[floor]:''}</h4>
           </div> 
           </div>        
         ))}
       </div>
      {this.state.designatedElavators.map((Elevator) =>(
      <Elevators floor={Elevator[0]} time={String(Elevator[1])} floors={NumberOfFloors}/>))}
      </div>
    );
    }
  }

  export default Building;