import './App.css';
import React, { useState, useEffect } from "react";
import searchIcon from './search.svg';
import searchDarkIcon from './search_dark.svg';
import Hold from "./hold"

function App() {
  const [units, setUnits] = useState([])
  const [unitMap, setUnitMap] = useState([])
  const [searchVal, setsearchVal] = useState("")
  const [foundUnits, setFoundUnits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [waveVal, setWaveVal] = useState("")
  const [holds, setHolds] = useState([])
  const [first, setFirst] = useState(0)
  const [isSearchingWave, setIsSearchingWave] = useState(false)
  const [waveHovered, setWaveHovered] = useState(false)
  const waves = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

  useEffect(() => {
    let getUnits = () => {
      fetch("http://localhost:8081/units")
        .then(res => res.json())
        .then(
          (result) => {
            let uMap = [];
            setUnits(result);
            result.map(u => {
              uMap[u.ID] = u;
            })
            setUnitMap(uMap);
            setIsLoading(false);
          },
          (error) => {
            console.log(error);
            setIsLoading(false);
          }
        );
    };
    getUnits();
  }, []);

  function setVal(val) {
    setsearchVal(val);
    setFoundUnits(findUnits(units, val));
    setIsSearching(true);
  }

  function filterAndSetWaveVal(val) {
    if (val == "") {
      setWaveVal(val);
      return
    }

    if (!isNaN(val)) {
      let i = parseInt(val);
      if (i < 11 && i > 0) {
        setWaveVal(val);
        return
      }
    }
  }

  function getHolds(wave, unit) {
    if (wave == "" || unit == "") {
      return
    }
    let uid = findUnit(units, unit);
    if (uid == "") {
      return
    }

    setIsLoading(true);

    let req = { "id": uid, "wave": wave }
    fetch("http://localhost:8081/holds", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(req), method: "POST"
    })
      .then(res => res.json())
      .then(
        (result) => {
          let parsedHolds = [];
          result.forEach(hold => {
            let us = hold.Position.split(",");
            let parsedUnits = [];
            us.forEach(u => {
              let s = u.split(":");
              if (s.length < 3) {
                return;
              }
              let pos = s[1].split("|");
              let foundU = unitMap[s[0]]
              if (foundU == undefined) {
                return;
              }
              let pu = { unit: s[0], pos: { x: pos[0], y: pos[1] }, stacks: s[2], icon: foundU.IconPath };
              parsedUnits.push(pu);
            })
            let h = { ID: hold.ID, Score: hold.Score, Sends: hold.Sends, TotalValue: hold.TotalValue, VersionAdded: hold.VersionAdded, Units: parsedUnits };
            parsedHolds.push(h);
          })
          console.log(parsedHolds);

          if (parsedHolds.length > 0) {
            setFirst(parsedHolds[0].ID);
            setHolds(parsedHolds);
          }
          setIsLoading(false);
        },
        (error) => {
          console.log(error);
          setIsLoading(false);
        }
      );
  }

  function clickUnit(name) {
    setsearchVal(name);
    setFoundUnits(findUnits(units, name));
    setHovered(false);
  }



  return (
    <div className="App">
      <div className='frontPage'>
        <div className='colFiller'></div>

        {
          isLoading &&
          <div className="loader">
            <div className="inner one"></div>
            <div className="inner two"></div>
            <div className="inner three"></div>
          </div>
        }

        {
          !isLoading &&
          <div className='searchBar'>
            <div className='rowFiller'></div>
            <div className='inputs'>
              <div className='inputPart' >
                <input className='unit' type='text' placeholder='Unit' value={searchVal} onChange={e => { setVal(e.target.value) }} onFocus={() => setVal("")} onBlur={() => setIsSearching(false)}></input>
                {(isSearching || hovered) &&
                  <div className='suggestions'>
                    {foundUnits.map(unit => (
                      <div className='suggestion' key={unit.ID} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseDown={() => { clickUnit(unit.Name) }}>{unit.Name}</div >
                    ))}
                  </div>
                }
              </div>

              <div className='inputPart' >
                <input type='text' placeholder='Wave' value={waveVal} className='wave ' onClick={() => setIsSearchingWave(true)} onFocus={() => setWaveVal("")} onChange={e => { filterAndSetWaveVal(e.target.value); setIsSearchingWave(false); }} onBlur={() => setIsSearchingWave(false)}></input>
                {
                  (isSearchingWave || waveHovered) &&
                  <div className='suggestions waveBox'>
                    {waves.map(w => (
                      <div className='suggestion' key={"wave_" + w} onMouseEnter={() => setWaveHovered(true)} onMouseLeave={() => setWaveHovered(false)} onMouseDown={() => { filterAndSetWaveVal(w); setWaveHovered(false); }}>{w}</div>
                    ))}
                  </div>
                }
              </div>

              <div onMouseDown={() => getHolds(waveVal, searchVal)} className='searchButton inputPart'>
                <img className='light' src={searchIcon}></img>
                <img className='dark' src={searchDarkIcon}></img>
              </div>

            </div>
          </div>
        }

        <picture className='hand'>
          <source type='image/avif' srcSet={require('./green_hand.avif')} ></source>
          <source type='image/webp' srcSet={require('./green_hand.webp')} ></source>
          <img src={require('./green_hand.png')}></img>
        </picture>
      </div>


      <div className='mobileFiller'></div>

      {
        !isLoading &&
        <div className='holds'>
          {
            holds.map(h => (
              <Hold className="hold" hold={h} scroll={h.ID == first} key={"hold_" + h.ID}></Hold>
            ))
          }
        </div>
      }



    </div>
  );
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

function findUnit(units, name) {
  let tn = name.trim().toLowerCase();
  let out = "";
  units.forEach(u => {
    if (u.Name.toLowerCase() == tn) {
      out = u.ID;
    }
  })

  return out
}

export default App;


