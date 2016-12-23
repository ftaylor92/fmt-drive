function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
}

var textpackage = namespace('fmt.text');
var mathpackage = namespace('fmt.math');
var utilpackage = namespace('fmt.util');
var risesetpackage = namespace('fmt.sundial.sunrise.svg');
var sundialpackage = namespace('fmt.sundial');
var sundialTwopackage = namespace('fmt.sundialTwo');
var astropackage = namespace('fmt.astro');
var navypackage = namespace('fmt.navy');
var datepackage = namespace('fmt.datetime');
var threeDpackage = namespace('fmt.threeD');
var twoDpackage = namespace('fmt.twoD');
var shapepackage = namespace('fmt.shapes');
var sundialLocationpackage = namespace('fmt.sundial.location');
var sundialShadowpackage = namespace('fmt.sundial.shadow');
var locationpackage = namespace('fmt.location');
var calcpackage = namespace('fmt.scratch');
var sundialTimepackage = namespace('fmt.sundial.time');
var androidpackage = namespace('fmt.android');
var hayespackage = namespace('fmt.hayes');
var comparepackage = namespace('fmt.compare');
var broadcastpackage = namespace('fmt.broadcast');
var compasspackage = namespace('fmt.compass');
var protractorpackage = namespace('fmt.protractor');
var tiltpackage = namespace('fmt.tilt');
var recordpackage = namespace('fmt.file.recorder');


