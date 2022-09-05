
import './App.css';
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [units, setUnits] = useState([]);
  const [seachVal, setSeachVal] = useState("");
  const [foundUnits, setFoundUnits] = useState([]);
  const [loadingUnits, setLoadingUnit] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [waveVal, setWaveVal] = useState(1);
  const [holds, setHolds] = useState([])
  const [isSearchingWave, setIsSearchingWave] = useState(false)
  const [waveHovered, setWaveHovered] = useState(false)
  const waves = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  useEffect(() => {
    let getUnits = () => {
      fetch("http://localhost:8081/units")
        .then(res => res.json())
        .then(
          (result) => {
            setUnits(result);
            setLoadingUnit(false);
          },
          (error) => {
            console.log(error);
            setLoadingUnit(false);
          }
        );
    };
    getUnits();
  }, []);

  function setVal(val) {
    setSeachVal(val);
    setFoundUnits(findUnits(units, val));
    setIsSearching(true);
  }

  return (
    <div className="App">
      <div className='colFiller'></div>

      {
        loadingUnits &&
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      }

      {
        !loadingUnits &&
        <div className='searchBar'>
          <div>
            <div className='rowFiller'></div>
            <div className='inputs'>
              <div>
                <input key="unitField" type='text' placeholder='Unit' value={seachVal} onChange={e => { setVal(e.target.value) }} onFocus={() => setVal("")} onBlur={() => setIsSearching(false)}></input>
                {(isSearching || hovered) &&
                  <div className='suggestions'>
                    {foundUnits.map(unit => (
                      <div className='suggestion' key={unit.ID} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => { setSeachVal(unit.Name); setFoundUnits(findUnits(units, unit.Name)); setHovered(false); }}>{unit.Name}</div >
                    ))}
                  </div>
                }
              </div>

              <div>
                <input key="waveField" type='text' placeholder='Wave' value={waveVal} className='wave' onClick={() => setIsSearchingWave(true)} onFocus={() => setWaveVal("")} onChange={e => { setWaveVal(e.target.value); setIsSearchingWave(false); }} onBlur={() => setIsSearchingWave(false)}></input>
                {
                  (isSearchingWave || waveHovered) &&
                  <div className='suggestions waveBox'>
                    {waves.map(w => (
                      <div className='suggestion' key={"wave_" + w} onMouseEnter={() => setWaveHovered(true)} onMouseLeave={() => setWaveHovered(false)} onClick={() => { setWaveVal(w); setWaveHovered(false); }}>{w}</div>
                    ))}
                  </div>
                }
              </div>

            </div>

          </div>

        </div>
      }


      <picture className='hand'>
        <source type='image/avif' srcSet={require('./hand.avif')} ></source>
        <source type='image/webp' srcSet={require('./hand.webp')} ></source>
        <img src={require('./hand.png')}></img>
      </picture>

    </div>
  );
}

function search(e, units, unit) {
  e.preventDefault();
  findUnits(units, unit)
  console.log(unit)
}


function findUnits(units, name) {
  let found = [];
  let tn = name.trim().toLowerCase();
  units.forEach(u => {
    if (u.Name.toLowerCase().includes(tn)) {
      found.push(u)
    }
  })
  return found
}


function getHolds(wave, unit) {

}

export default App;


