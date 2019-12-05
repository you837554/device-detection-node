// Checks if the package required is available locally and if unsuccessful 
// return as a module reference.
let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const ddPipelineBuilder = require("../../deviceDetectionPipelineBuilder");
const fs = require("fs");

// Create a new Device Detection pipeline and set the config.
// You can obtain a free or enhanced data file from the following git respoitory: TODO and enter the path here. 
// Alternatively, use the cloud example for an immediate result.
let pipeline = new ddPipelineBuilder({    
    performanceProfile: "MaxPerformance",
    dataFile: "../../device-detection-data/51Degrees-LiteV3.4.trie",
    autoUpdate: false
}).build();

pipeline.on("error", console.error);

let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

// Create a flow data element and process the example User-Agent.
let flowData = pipeline.createFlowData();
flowData.evidence.add("header.user-agent", userAgent);
flowData.process().then(function () {
    console.info('User-Agent = ' + userAgent + '\nIsMobile = ' + flowData.device.ismobile);
});

// Create a flow data element and process the iPhone User-Agent.
let flowData2 = pipeline.createFlowData();
flowData2.evidence.add("header.user-agent", iPhoneUA);
flowData2.process().then(function () {
    console.info('User-Agent = ' + iPhoneUA + '\nIsMobile = ' + flowData2.device.ismobile);
});