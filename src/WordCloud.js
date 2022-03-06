import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import chroma from "chroma-js";

function count(words) {
    let array = [];

    for (let w in words) {
        // console.log("trying to count words: " + w + " : " + words[w]);
        array[words[w]] = (array[words[w]] || 0) + 1;
    }
    array = Object.entries(array)
        .sort((a, b) =>{
            return b[1] - a[1]
        })
    let counts = []
    for (let i in array) {
        counts[array[i][0]] = array[i][1]
    }
    return counts;
}

class Word extends React.Component {
    ref = React.createRef();
    state = {transform: this.props.transform};

    componentDidUpdate() {
        const {transform} = this.props;
        d3.select(this.ref.current)
            .transition()
            .duration(500)
            .attr("transform", this.props.transform)
            .on("end", () => this.setState({transform}));
    }

    render() {
        const {style, counter, showCounts, countSize, children} = this.props, {transform} = this.state;
        //console.log("Value of showCounts inside word is: " + showCounts);
        //debugger;
        return (
            <text
                transform={transform}
                textAnchor="middle"
                style={style}
                ref={this.ref}
            >
                <div> {showCounts} </div>
                {children}
                {counter > 1 && showCounts && (
                    // <tspan fontSize={style.fontSize - 3} baseline-shift="super">
                    //   {" " + counter}
                    // </tspan>
                    <tspan fontSize={countSize}>{" " + counter}</tspan>
                )}
            </text>
        );
    }
}

function createCloud({
                         words,
                         width,
                         height,
                         angle,
                         fontSizeSmall,
                         fontSizeLarge,
                     }) {
    return new Promise(resolve => {
        const counts = count(words);

        // const mappedWords = Object.keys(counts)
        //     // .filter(w => counts[w] > 1)
        //     .map(text => ({ text }));
        //
        // const arrayedWords = Object.keys(counts);

        const fontSize = d3
            .scaleLinear()
            .domain(d3.extent(Object.values(counts)))
            .range([fontSizeSmall, fontSizeLarge]);

        const layout = d3Cloud()
            .size([width, height])
            .words(
                Object.keys(counts)
                    // .filter(w => counts[w] > 1)
                    .map(word => ({ word }))
            )
            .padding(7)
            // .spiral(spiral[Math.floor(Math.random() * 2)])
            .spiral('archimedean')
            .font("Roboto")
            .fontSize(d => fontSize(counts[d.word]))
            // .text(d => d.word + (counts[d.word] > 1 ? "-" + counts[d.word] : ""))
            .text(d => d.word)
            .rotate(function () {
                //                debugger;
                return ~~(Math.random() * 2) * angle;
            })
            // .rotate(0)
            .on("end", resolve);

        layout.start();
        // debugger;
    });
}

const WordCloud = ({
                       words,
                       width,
                       height,
                       angle,
                       fontSizeSmall,
                       fontSizeLarge,
                       showCounts,
                       countSize,
                       wordColor
                   }) => {
    const [cloud, setCloud] = useState(null);
    useEffect(() => {
        createCloud({
            words,
            width,
            height,
            angle,
            fontSizeSmall,
            fontSizeLarge
        }).then(setCloud);
    }, [
        words,
        width,
        height,
        angle,
        fontSizeSmall,
        fontSizeLarge
    ]);
    const colors = chroma.brewer[wordColor]
    const counts = count(words);
    return (
        cloud && (
            <>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {cloud.map((w, i) => (
                        <Word
                            transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                            style={{
                                fontSize: w.size,
                                fontWeight: 500,
                                fontFamily: 'Roboto',
                                fill: colors[i % colors.length],
                                stroke: "white",
                                strokeWidth: "0.2px"
                            }}
                            counter={counts[w.word]}
                            key={w.word}
                            showCounts={showCounts}
                            countSize={countSize}
                        >
                            {w.word}
                        </Word>
                    ))}
                </g>
            </>
        )
    );
};
export default WordCloud;
