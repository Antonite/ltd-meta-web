import './Builds.css';
import React, { useState, useEffect } from "react";
import searchIcon from './search.svg';
import searchDarkIcon from './search_dark.svg';
import Hold from "./hold"
import Loader from "./Loader"
import CustomError from './error';
import NotFound from './NotFound';
import handA from "./hand.avif"
import handW from "./hand.webp"
import handP from "./hand.png"


function Builds() {
    const [versions, setVersions] = useState([])
    const [units, setUnits] = useState([])
    const [unitMap, setUnitMap] = useState([])
    const [mercs, setMercs] = useState([])
    const [searchVal, setsearchVal] = useState("")
    const [searchValSecondary, setsearchValSecondary] = useState("Any")
    const [foundUnits, setFoundUnits] = useState([])
    const [foundUnitsSecondary, setFoundUnitsSecondary] = useState(["Any"])
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [isSearchingSecondary, setIsSearchingSecondary] = useState(false)
    const [hoveredSecondary, setHoveredSecondary] = useState(false)
    const [waveVal, setWaveVal] = useState("")
    const [versionVal, setVersionVal] = useState("")
    const [holds, setHolds] = useState([])
    const [first, setFirst] = useState(0)
    const [isSearchingWave, setIsSearchingWave] = useState(false)
    const [isSearchingVersion, setIsSearchingVersion] = useState(false)
    const [waveHovered, setWaveHovered] = useState(false)
    const [versionHovered, setVersionHovered] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isNoBuildErr, setIsNoBuildErr] = useState(false)
    const waves = ["1", "2", "3", "4", "5", "6", "7", "8"]

    useEffect(() => {
        let getUnits = () => {
            fetch("https://api.ltdmeta.app:8081/units")
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

    useEffect(() => {
        let getVersions = () => {
            fetch("https://api.ltdmeta.app:8081/versions")
                .then(res => res.json())
                .then(
                    (result) => {
                        setVersions(result);
                        setVersionVal(result[0])
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        };

        getVersions();
    }, []);

    function setVal(val) {
        setsearchVal(val);
        setFoundUnits(findUnits(units, val));
        setIsSearching(true);
    }

    function setValSecondary(val) {
        setsearchValSecondary(val);
        let anyU = [{ ID: "0", Name: "Any" }]
        setFoundUnitsSecondary(anyU.concat(findUnits(units, val)));
        setIsSearchingSecondary(true);
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

    function getHolds(wave, primary, secondary, version) {
        if (wave === "" || primary === "") {
            return
        }
        if (secondary === "") {
            secondary = "Any"
        }
        let uid = findUnit(units, primary);
        if (uid === "") {
            return
        }
        if (secondary !== "Any") {
            secondary = findUnit(units, secondary);
            if (secondary === "") {
                return
            }
        }

        setIsLoading(true);
        setIsError(false);
        setIsNoBuildErr(false);

        let req = { "primary": uid, "secondary": secondary, "wave": wave, "version": version }
        fetch("https://api.ltdmeta.app:8081/holds", {
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
                            send.Icons = icons;
                            send.ID = i;
                            parsedSends.push(send);
                            i = i + 1;
                        })
                        let h = { ID: hold.ID, Score: hold.Score, Sends: parsedSends, TotalValue: hold.TotalValue, VersionAdded: hold.VersionAdded, Units: parsedUnits, Wave: waveVal, Workers: hold.Workers };
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

    function clickUnitSecondary(name) {
        setValSecondary(name);
        setFoundUnitsSecondary(findUnits(units, name));
        setHoveredSecondary(false);
    }

    return (
        <div className="Builds">
            <div className='frontPage'>
                <div className='colFiller'></div>

                {
                    isLoading &&
                    <Loader></Loader>
                }

                {
                    isError &&
                    <NotFound isNoBuildErr={isNoBuildErr}></NotFound>
                }

                {
                    !isLoading && (!isError || isNoBuildErr) &&
                    <div className='searchBar'>
                        <div className='rowFiller'></div>
                        <div className='inputs'>
                            <div className='inputPart'>
                                <input className='unit' type='text' placeholder='Unit' value={searchVal} onChange={e => { setVal(e.target.value) }} onFocus={() => setVal("")} onBlur={() => setIsSearching(false)}></input>
                                {(isSearching || hovered) &&
                                    <div className='suggestions'>
                                        {foundUnits.map(unit => (
                                            <div className='suggestion' key={unit.ID} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseDown={() => { clickUnit(unit.Name) }}>{unit.Name}</div >
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className='inputPartSlim'>
                                <div className='inputDivider'>+</div>
                            </div>

                            <div className='inputPartSlim'>
                                <input className='unit' type='text' placeholder='Any' value={searchValSecondary} onChange={e => { setValSecondary(e.target.value) }} onFocus={() => setValSecondary("")} onBlur={() => setIsSearchingSecondary(false)}></input>
                                {(isSearchingSecondary || hoveredSecondary) &&
                                    <div className='suggestions'>
                                        {foundUnitsSecondary.map(unit => (
                                            <div className='suggestion' key={unit.ID} onMouseEnter={() => setHoveredSecondary(true)} onMouseLeave={() => setHoveredSecondary(false)} onMouseDown={() => { clickUnitSecondary(unit.Name) }}>{unit.Name}</div >
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className='inputPart'>
                                <input type='text' placeholder='Wave' value={waveVal} className='wave' onClick={() => setIsSearchingWave(true)} onFocus={() => setWaveVal("")} onChange={e => { filterAndSetWaveVal(e.target.value); setIsSearchingWave(false); }} onBlur={() => setIsSearchingWave(false)}></input>
                                {
                                    (isSearchingWave || waveHovered) &&
                                    <div className='suggestions waveBox'>
                                        {waves.map(w => (
                                            <div className='suggestion' key={"wave_" + w} onMouseEnter={() => setWaveHovered(true)} onMouseLeave={() => setWaveHovered(false)} onMouseDown={() => { filterAndSetWaveVal(w); setWaveHovered(false); }}>{w}</div>
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className='inputPart'>
                                <input type='text' placeholder='Version' value={versionVal} className='wave' onClick={() => setIsSearchingVersion(true)} onFocus={() => setVersionVal("")} onChange={e => { setVersionVal(e.target.value); setIsSearchingVersion(false); }} onBlur={() => setIsSearchingVersion(false)}></input>
                                {
                                    (isSearchingVersion || versionHovered) &&
                                    <div className='suggestions waveBox'>
                                        {versions.map(w => (
                                            <div className='suggestion' key={"version_" + w} onMouseEnter={() => setVersionHovered(true)} onMouseLeave={() => setVersionHovered(false)} onMouseDown={() => { setVersionVal(w); setVersionHovered(false); }}>{w}</div>
                                        ))}
                                    </div>
                                }
                            </div>

                            <div onMouseDown={() => getHolds(waveVal, searchVal, searchValSecondary, versionVal)} className='searchButton inputPart'>
                                <img className='light' src={searchIcon} alt='find'></img>
                                <img className='dark' src={searchDarkIcon} alt='find'></img>
                            </div>

                        </div>
                    </div>
                }

                <picture className='hand'>
                    <source type='image/avif' srcSet={handA} ></source>
                    <source type='image/webp' srcSet={handW} ></source>
                    <img src={handP} alt='Legion TD 2 Mastermind'></img>
                </picture>
            </div>

            {
                isNoBuildErr &&
                <div className='nobuildsErr'>
                    <CustomError></CustomError>
                </div>
            }

            <div className='mobileFiller'></div>

            {
                !isLoading && !isError &&
                <div className='holds'>
                    {
                        holds.map(h => (
                            <Hold className="hold" hold={h} wave={0} scroll={h.ID === first} key={"hold_" + h.ID}></Hold>
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
        if (!u.Usable) {
            return
        }
        if (u.Name.toLowerCase().includes(tn)) {
            found.push(u)
        }
    })

    found.sort((a, b) => (a.Name > b.Name) ? 1 : -1);
    return found
}

function findUnit(units, name) {
    let tn = name.trim().toLowerCase();
    let out = "";
    units.forEach(u => {
        if (u.Name.toLowerCase() === tn) {
            out = u.UnitID;
        }
    })

    return out
}

export default Builds;


