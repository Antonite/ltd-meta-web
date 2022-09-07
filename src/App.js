import './App.css';
import React, { useState, useEffect } from "react";
import searchIcon from './search.svg';
import searchDarkIcon from './search_dark.svg';
import Hold from "./hold"
import mole from "./DizzyMole.png"
import tommy from "./TommyIsSus.png"
import handA from "./hand.avif"
import handW from "./hand.webp"
import handP from "./hand.png"

function App() {
  const [units, setUnits] = useState([])
  const [unitMap, setUnitMap] = useState([])
  const [mercs, setMercs] = useState([])
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
  const [isError, setIsError] = useState(false)
  const [isNoBuildErr, setIsNoBuildErr] = useState(false)
  const waves = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

  useEffect(() => {
    let getUnits = () => {
      fetch("http://localhost:8081/units")
        .then(res => res.json())
        .then(
          (result) => {
            let uMap = [];
            setUnits(result.Units);
            result.Units.forEach(u => {
              uMap[u.ID] = u;
            })
            setUnitMap(uMap);
            setMercs(result.Mercs);
            setIsLoading(false);
          },
          (error) => {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
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
    if (val === "") {
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
    if (wave === "" || unit === "") {
      return
    }
    let uid = findUnit(units, unit);
    if (uid === "") {
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
      .then((res) => {
        if (res.status === 404) {
          setIsNoBuildErr(true);
        }
        return res.json();
      })
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
              if (foundU === undefined) {
                return;
              }
              let pu = { unit: s[0], pos: { x: pos[0], y: pos[1] }, stacks: s[2], icon: foundU.IconPath };
              parsedUnits.push(pu);
            })
            let parsedSends = [];
            let i = 0;
            hold.Sends.forEach(send => {
              let icons = [];
              let ss = send.Sends.split(",");
              let k = 0;
              ss.forEach(sname => {
                let m = mercs[sname];
                if (m === undefined) {
                  return;
                }
                icons.push({ icon: m.IconPath, key: m.IconPath + k });
                k = k + 1;
              })
              send.Sends = icons;
              send.ID = i;
              parsedSends.push(send);
              i = i + 1;
            })
            let h = { ID: hold.ID, Score: hold.Score, Sends: parsedSends, TotalValue: hold.TotalValue, VersionAdded: hold.VersionAdded, Units: parsedUnits };
            parsedHolds.push(h);
          })

          if (parsedHolds.length > 0) {
            setFirst(parsedHolds[0].ID);
            setHolds(parsedHolds);
          }
          setIsLoading(false);
        },
        (error) => {
          setIsError(true);
          setIsLoading(false);
        }
      );
  }

  function clickUnit(name) {
    setVal(name);
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
          isError &&
          <div className='error'>
            <div className='errorBox'>
              {!isNoBuildErr &&
                <img src={mole} alt=''></img>
              }
              {isNoBuildErr &&
                <img src={tommy} alt=''></img>
              }
              {!isNoBuildErr &&
                <div className='error-text'>Something went wrong :(</div>
              }
              {isNoBuildErr &&
                <div className='error-text'>No good builds found for this request</div>
              }
            </div>

          </div>
        }

        {
          !isLoading && !isError &&
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
                <img className='light' src={searchIcon} alt=''></img>
                <img className='dark' src={searchDarkIcon} alt=''></img>
              </div>

            </div>
          </div>
        }

        <picture className='hand'>
          <source type='image/avif' srcSet={handA} ></source>
          <source type='image/webp' srcSet={handW} ></source>
          <img src={handP} alt=''></img>
        </picture>
      </div>


      <div className='mobileFiller'></div>

      {
        !isLoading && !isError &&
        < div className='holds'>
          {
            holds.map(h => (
              <Hold className="hold" hold={h} scroll={h.ID === first} key={"hold_" + h.ID}></Hold>
            ))
          }
        </div>
      }



    </div >
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
    if (u.Name.toLowerCase() === tn) {
      out = u.ID;
    }
  })

  return out
}

export default App;


