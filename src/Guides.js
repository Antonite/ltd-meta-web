import './Guides.css';
import React, { useState, useEffect } from "react";
import Loader from "./Loader"
import NotFound from './NotFound';
import Guide from './Guide';
import Hold from './hold';
import backIcon from './back.svg';

function Guides() {
    const [guides, setGuides] = useState([])
    const [units, setUnits] = useState([])
    const [unitMap, setUnitMap] = useState([])
    const [mercs, setMercs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [holds, setHolds] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [foundGuides, setFoundGuides] = useState([])
    const [foundUnits, setFoundUnits] = useState([])

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
                    },
                    (error) => {
                        console.log(error);
                        setIsError(true);
                    }
                );
        };

        getUnits();
    }, []);

    useEffect(() => {
        let getGuides = () => {
            setIsLoading(true);
            fetch("https://api.ltdmeta.app:8081/guides")
                .then(res => res.json())
                .then(
                    (result) => {
                        setGuides(result);
                        setFoundGuides(result);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.log(error);
                        setIsLoading(false);
                        setIsError(true);
                    }
                );
        };

        getGuides();
    }, []);

    function setVal(val) {
        setSearchVal(val);
        setFoundUnits(findUnits(units, val));
        setFoundGuides(findGuides(guides, unitMap, val));
        setIsSearching(true);
    }

    function clickGuideUnit(name) {
        setVal(name);
        setHovered(false);
    }

    return (
        <div className='Guides'>
            {
                isLoading &&
                <Loader></Loader>
            }
            {
                isError &&
                <NotFound isNoBuildErr={false}></NotFound>
            }
            {
                !isLoading && !isError && !showDetails &&
                <div className='guidesBox'>
                    <div className='inputBox'>
                        <div className='guideInputPart'>
                            <input className='guideUnit' type='text' placeholder='Unit' value={searchVal} onChange={e => { setVal(e.target.value) }} onFocus={() => setVal("")} onBlur={() => setIsSearching(false)}></input>
                            {
                                (isSearching || hovered) &&
                                <div className='guideSuggestions'>
                                    {foundUnits.map(unit => (
                                        <div className='guideSuggestion' key={unit.ID} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseDown={() => { clickGuideUnit(unit.Name) }}>{unit.Name}</div >
                                    ))}
                                </div>
                            }
                            {
                                !isSearching &&
                                <div className='suggFiller'></div>
                            }
                        </div>
                    </div>
                    <div className='cardBox'>
                        {
                            foundGuides.map(g => (
                                <div className="gbox" key={"guide_box_" + g.MainUnitID + "_" + g.SecondaryUnitID}>
                                    <Guide guide={g} mercs={mercs} umap={unitMap} dfunc={setShowDetails} hfunc={setHolds} key={"guide_" + g.MainUnitID + "_" + g.SecondaryUnitID}></Guide>
                                </div>
                            ))
                        }
                    </div>

                </div>
            }
            {
                showDetails && !isLoading && !isError &&
                <div className='guideDetailsBox'>
                    <div className='backButton' onClick={() => setShowDetails(false)}>
                        <img src={backIcon} alt='back'></img>
                    </div>
                    <div className='guideHolds'>
                        {
                            holds.map((h, i) => (
                                <Hold hold={h} wave={i + 1} scroll={false} key={"hold_" + i}></Hold>
                            ))
                        }
                    </div>
                </div>

            }
        </div>
    );
}

function findGuides(guides, unitMap, name) {
    let found = [];
    let tn = name.trim().toLowerCase();

    guides.forEach(g => {
        if (tn == "" || unitMap[g.MainUnitID].Name.toLowerCase().includes(tn)) {
            found.push(g)
        } else if (unitMap[g.SecondaryUnitID].Name.toLowerCase().includes(tn)) {
            found.push(g)
        }
    })

    return found
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


export default Guides;