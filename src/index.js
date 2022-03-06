import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import parseText from "./parseText";
import WordCloud from "./WordCloud";
import {Switch} from "@blueprintjs/core";

import "./styles.css";

function App() {
    const [data, setData] = useState(null);
    const [angle, setAngle] = useState(0);
    const [fontSizeSmall, setFontSizeSmall] = useState(30);
    const [fontSizeLarge, setFontSizeLarge] = useState(120);
    const [showCounts, setShowCounts] = useState(false);
    const [countSize, setCountSize] = useState(20);
    const [wordColor, setWordColor] = useState('pastel1')
    // const apiUrl = 'http://portal.mcps.com/api/word-cloud' //dev
    const apiUrl = 'https://portal.cpvs.moscow/api/word-cloud' //prod
    const [backgroundStyle, setBackgroundStyle] = useState('')


    useEffect(() => {
        let search = window.location.search;
        let question_id = 1
        if (search !== '') {
            let params = new URLSearchParams(search);
            question_id = params.get('question') || 1;
        }
        fetch(`${apiUrl}/${question_id}/settings`).then(res => res.json()).then((settings) => {
            setBackgroundStyle(`url("${settings.backgroundImage}") no-repeat 50%`)
            document.title = settings.pageTitle;
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.logo;
            setWordColor(settings.wordColor)
            setAngle(settings.angle)
            setFontSizeLarge(settings.fontSizeLarge)
            setFontSizeSmall(settings.fontSizeSmall)
            setShowCounts(settings.showCounts)
            setCountSize(settings.countSize)

            const style = document.createElement('style')
            style.innerHTML = settings.additionalCss
            document.head.appendChild(style)

            d3.json(`${apiUrl}/${question_id}/answer`).then(parseText).then(setData);
        })

    }, []);

    return (
        <div className="App">
            <React.StrictMode>
                <div className="container ">
                    <div className="background" style={{
                        background: backgroundStyle
                    }}/>
                    <div className="title item-header">
                        <h1>Облако слов</h1>
                    </div>

                    <div className="controls item-a">

                        <label>
                            Минимальный размер текста:
                            <input
                                type="text"
                                value={fontSizeSmall}
                                onChange={e => setFontSizeSmall(+e.target.value)}
                            />
                        </label>

                        <label>
                            Максимальный размер текста:
                            <input
                                type="text"
                                value={fontSizeLarge}
                                onChange={e => setFontSizeLarge(+e.target.value)}
                            />
                        </label>

                        <Switch
                            checked={showCounts}
                            label="Показывать кол-во слов"
                            onChange={e => setShowCounts(e.currentTarget.checked)}
                        />
                        <label>
                            Размер кол-ва слов:
                            <input
                                type="text"
                                value={countSize}
                                onChange={e => setCountSize(+e.target.value)}
                            />
                        </label>

                        <label>
                            Углы:
                            <input
                                type="text"
                                value={angle}
                                onChange={e => setAngle(+e.target.value)}
                            />
                        </label>

                    </div>
                    {/*870*/}
                    <div className="wordcloud item-b ">
                        <svg viewBox="0 0 1600 900">
                            <WordCloud
                                words={data}
                                // forCarol={chosenCarol}
                                width={1600}
                                height={900}
                                angle={angle}
                                fontSizeLarge={fontSizeLarge}
                                fontSizeSmall={fontSizeSmall}
                                showCounts={showCounts}
                                countSize={countSize}
                                wordColor={wordColor}
                            />
                        </svg>
                    </div>
                </div>
            </React.StrictMode>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
