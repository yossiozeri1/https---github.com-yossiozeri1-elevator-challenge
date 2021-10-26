import Building from './Building.jsx';

let NumberOfBuilding=1;
const ArrayBuilding=Array(NumberOfBuilding).fill(0);
function App() {
  return (
    <div>
    <h1>elevator-challenge</h1>
    <div style={{  
      display:"grid",  
      gridTemplateColumns: "3fr 30fr 300fr 3000fr"  
    }}>
    {ArrayBuilding.map((i)=>(<Building/>))}
    </div> 
    </div>
   );
}

export default App;
