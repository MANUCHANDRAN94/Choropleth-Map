const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "#bc658d";

      } else if (percentage <= 25) {
        return "#82c4c3";
      }else if (percentage <= 35) {
        return "#62760c";
      }  
      else if (percentage <= 45) {

        return "#f9d89c";
      } else {
        return "#900d0d";
      }
    })
    .attr("data-fips", (countyDataItem) => {
      return countyDataItem["id"];
    })
    .attr("data-education", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countyDataItem) => {
      tooltip.transition().style("visibility", "visible");

      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        county["fips"] +
          " - " +
          county["area_name"] +
          ", " +
          county["state"] +
          " : " +
          county["bachelorsOrHigher"] +
          "%"
      );

      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

//this is another method for XMLHttpREquest. inbuilt method of d3. it also fetches the file as json no need to parse
d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(countyData);
        console.log(educationData);
        drawMap();
      }
    });
  }
});

/*d3 need the data to be in geojson n0t in topojson. 
this conversion is done with topojson.feature(object needed to be converted , the data inside object
     which should be converted) */
