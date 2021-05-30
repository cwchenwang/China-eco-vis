async function renderPieChart(data) {
    const pieWidth = 250,
        pieHeight = 250,
        radius = Math.min(pieWidth, pieHeight) / 2

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var pieSvg = d3.select("#world-pie-svg");
    g = pieSvg.append("g")
        .attr("transform", "translate(" + (pieSvg.attr('width') / 2 - 50) + "," + (pieSvg.attr('height') / 2 + 15) + ")");

    console.log(data);
    const pieSp = d3.scalePoint().
        domain(data.map(d => d.region)).range([0, 1]);

    data = d3.group(data, d => d.dirs);
    console.log(data);

    var arcs = g.selectAll("arc")
        .data(pie(data.get("Import")))
        .enter().append("g")
        .attr("class", "arc")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.8');
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })
        .attr('transform', 'translate(0, 0)');

    arcs.append("path")
        .attr("d", arc)
        .style("fill", d => d3.interpolateSpectral(pieSp(d.data.region)));

    var legend = pieSvg
        .selectAll("text")
        .attr("class", "legend")
        .data(data.get("Import"))
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(" + 350 + "," + (i * 22 + 60) + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => d3.interpolateSpectral(pieSp(d.region)));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d.region);

    document.getElementById('import-btn').style.background = '#bdbdbd';
    function changeData(data) {
        path = d3.select("#world-pie-svg")
            .selectAll("path")
            .data(pie(data)); // Compute the new angles
        path.transition().duration(500).attr("d", arc);
    }

    d3.select("button#import-btn")
        .on("click", function () {
            console.log("click import");
            changeData(data.get("Import"));
            document.getElementById('import-btn').style.background = '#bdbdbd';
            document.getElementById('export-btn').style.background = '#000000';
        })
    d3.select("button#export-btn")
        .on("click", function () {
            changeData(data.get("Export"));
            document.getElementById('import-btn').style.background = '#000000';
            document.getElementById('export-btn').style.background = '#bdbdbd';
        })
}