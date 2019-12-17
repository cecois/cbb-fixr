<template>
<div class="">
  <vue-topprogress ref="topProgress"></vue-topprogress>
  <div id="map"></div>
  <vue-headful :title="page.title" description="fxsxxxrrrre" />
  
  <!-- START NAV 1-->
  <nav id="mjk-navbar" class="navbar is-white has-text-centered">

    <div id="mjk-navMenu" class="navbar-menu" :style="_SETCOLORBG('primary')">
      <div class=" is-paddingless is-marginless">

        <div class="field has-addons has-text-centered is-horizontal" id="mjk-query-field">
  <div class="control">
    <input :style="_SETCOLOR('quinary')" id="mjk-query" v-model="query" class="input is-expanded" type="text" :placeholder="config.mode">
  </div>
  <div class="control">
    <a @click="_GEOCODE" class="button is-info" :style="_SETCOLORBG('secondary')">
      <span class="icon is-large is-left">
      <i class="fas fa-map-signs"></i>
    </span>
    </a>

<div :style="_SETCOLOR('tertiary')" @click="_EDIT" class="fa fa-edit has-text-right j-btn"></div>
    <div :style="_SETCOLOR('secondary')" @click="_SEND" class="fa fa-upload has-text-right j-btn"></div>

  </div>
</div>

      </div nb="/.navbar">

<!-- <div id="mjk-active" class="columns has-text-centered" :style="_SETCOLOR('quaternary')">
              
              <div class="column is-9">
                <h1 class="is-1">{{active.properties.name}}</h1>
<h4 class="is-4">
              {{active.properties.anno}}
              </h4>
              </div nb="/.column">


  <div class="column has-text-white">
    
    
    </div nb="/.column">

            </div nb="/#mjk-active"> -->

    </div nb="/#navMenu">
  </nav>
  <!-- END NAV 1 -->
  <!-- START NAV 2-->
  <nav id="mjk-candidates" class="navbar is-white is-marginless is-paddingless">
    <div class="navbar-brand">
      
      <div class="is-left" v-for="can in candidates">{{can.properties.name}} <span @click="_SEND" v-if="can.properties.temp_id==active.properties.temp_id" class="fa fa-check"></span>|&nbsp;&nbsp;</div>
      
    </div>

    <div class="navbar-menu has-text-left" style="font-size:3em;">
<!-- <div :style="_SETCOLOR('tertiary')" @click="_EDIT" class="fa fa-edit has-text-right j-btn"></div>
    <div :style="_SETCOLOR('secondary')" @click="_SEND" class="fa fa-upload has-text-right j-btn"></div> -->
    </div>
    
  </nav>
  
    <!-- ••••••••••••••••••••••••••••••••••••••••••••••• MODALS
    •• -->
    <div class="modal" v-bind:class="{ 'is-active': modals.result }">
      <div class="modal-background"></div>
      <div class="modal-content">
      <pre>{{ result }}</pre>
    </div>
    <button
    class="modal-close is-large"
    aria-label="close"
    @click="modals.result = false"
    ></button>
  </div>
  <div class="modal" v-bind:class="{ 'is-active': modals.edit }">
    <div class="modal-background"></div>
    <div class="modal-content">
      

<!-- 
<div class="field has-addons" id="mjk-query-field">
  <div class="control">
    <input :style="_SETCOLOR('quinary')" id="mjk-query" v-model="query" class="input" type="text" :placeholder="config.mode">
  </div>
  <div class="control">
    <a @click="_GEOCODE" class="button is-info" :style="_SETCOLORBG('secondary')">
      <span class="icon is-large is-left">
      <i class="fas fa-map-signs"></i>
    </span>
    </a>
  </div>
</div>
 -->

      <div class="field">
        <div class="control">
          
          <input :style="_SETCOLOR('secondary')" class="input is-large" v-model="activeTemp.name" placeholder="name">
          <input :style="_SETCOLOR('tertiary')" class="input is-medium" v-model="activeTemp.anno" placeholder="anno">
        </div>
        <a @click="_SETMANUAL" class="button is-large is-fullwidth">Set</a>
        <!-- <p class="level-item"><span @click="_SETMANUAL" class="fa fa-parachute-box is-size-1"></span></p> -->
      </div nb="/.field">


      <div id="mjk-active" class="columns has-text-centered" :style="_SETCOLOR('quaternary')">
              
              <div class="column is-9">
                <h1 class="is-1">{{active.properties.name}}</h1>
<h4 class="is-4">
              {{active.properties.anno}}
              </h4>
              </div nb="/.column">


              <!-- Main container -->
  <div class="column has-text-white">
    
    
    </div nb="/.column">

            </div nb="/#mjk-active">

    </div>
    <button
    class="modal-close is-large"
    aria-label="close"
    @click="modals.edit = false"
    ></button>
  </div>
</div nb="app root">
</template>

<script>
export default {
  name: "milLeRIAjkR",
  created: function() {
    var mess = "Milleria Geocoder";
    this.msg = mess.toUpperCase();

    this._GETCOLORS()


//     var geojson = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-70.603637,-33.399918],[-70.614624,-33.395332],[-70.639343,-33.392466],[-70.659942,-33.394759],[-70.683975,-33.404504],[-70.697021,-33.419406],[-70.701141,-33.434306],[-70.700454,-33.446339],[-70.694274,-33.458369],[-70.682601,-33.465816],[-70.668869,-33.472117],[-70.646209,-33.473835],[-70.624923,-33.472117],[-70.609817,-33.468107],[-70.595397,-33.458369],[-70.587158,-33.442901],[-70.587158,-33.426283],[-70.590591,-33.414248],[-70.594711,-33.406224],[-70.603637,-33.399918]]]}}

//     console.log("geojson.length", this.$_.flatten(geojson.geometry.coordinates).length);

// var options = {tolerance: 0.01, highQuality: false};
// var simplified = this.$TURFSIMPLE(geojson, options);

//     console.log("simplified.coords", simplified.geometry.coordinates);
//     console.log("simplified.length", this.$_.flatten(simplified.geometry.coordinates).length);

  },
  mounted: function() {

this.MAP = new L.Map("map", {
  zoomControl: false,
  center: [51.505, -0.09],
  attributionControl: false,
  zoom: 2
});

      if (! this.JKGROUPSI) {
        this.JKGROUPSI = new L.featureGroup().addTo(this.MAP);
      }


if (! this.JKGROUP) {
        this.JKGROUP = new L.featureGroup().addTo(this.MAP).bringToFront();
      }

const baseLayer = new L.TileLayer(
  this.config.mode=='33'?"https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png":"http://localhost:8000/tile-T.png"
);

this.MAP.addLayer(baseLayer);

/* ++++++++++++++++++++++++++++++++++++++++++ dropzone */
    window.addEventListener("dragenter", e => {
      // console.log("in dragenter, e:", e);
      this.dropzone.state = "drag";
      this.dropzone.msg = "drop fil";
    });

    window.addEventListener("dragleave", e => {
      e.preventDefault();
      this.dropzone.state = "idle";
      this.dropzone.msg = "fil drop";
    });

    window.addEventListener("dragover", e => {
      e.preventDefault();
      this.dropzone.state = "drag";
    });

    window.addEventListener("drop", e => {
      e.preventDefault();
      this.dropzone.state = "idle";
      this.dropzone.msg = "tnx";

      let fil = e.dataTransfer.files;
      this._ACCEPTDROP(fil);
    });

    /* ++++++++++++++++++++++++++++++++++++++++++ /dropzone */

document.addEventListener("keydown", (e)=>{
  if(e.keyCode==27){
    this.modals.result=false
    this.modals.edit=false
  }
})

  },
  data() {
    return {
      MAP:null,
            dropzone: { state: "idle", msg: null },
      page: { title: "MIlLeriAjkR", splayed: false },
      modals: {result:false,edit:false},
      project:{loadings:{map:false,mongo:false}},
      query:'',
      activeTemp:{name:'',anno:''},
      result:null,
      active: {properties:{name:null,anno:null,cartodb_id:null}},
      candidates: [],
      dropzone: { state: "idle", msg: null },
      config: { mode: "33" },
      colors:{primary:[33,44,69],secondary:[247,242,163],tertiary:[201,216,147],quaternary:[57,141,112],quinary:[62,80,64]}
    };
  },
  watch: {
    "loadings": {
      handler: function (vnew, vold) {
        vnew?this.$refs.topProgress.start():this.$refs.topProgress.done();
      }//handler
      ,
     deep: true
    }
  } //watch
  ,methods: {
    
    _LOADDROP: function(fil) {
      this.project.loadings.map = true;
      const reader = new FileReader();
      reader.loadend = e => {
        delete e.target.result;
      };

      reader.onload = D => {

        let O = JSON.parse(D.target.result);
        console.log("OTYPE:",O.type)
        
// first clear the group
this.JKGROUP.clearLayers();
this.JKGROUPSI.clearLayers();
let style = { color: "#bc000a" }
let styleSimple = { color: "#1cc1be" }
this.project.loadings.map = false;

          L.geoJSON(O, {
            style: style
          })
            .bindPopup(layer => {
              return "<div>name: " + layer.feature.properties.name + "</div>";
            })
            .on("popupopen", layer => {
              let fea =  layer.layer.feature;
              fea.properties.name="Manual GeoJSON File"
              fea.properties.anno="(desc)"
              this.active = fea;
            })
            .addTo(this.JKGROUP);

this.$TURFSIMPLE(L.geoJSON(O,{style:styleSimple}),{tolerance: 1, highQuality: false,mutate:true}).addTo(this.JKGROUPSI)

          map.fitBounds(this.JKGROUP.getBounds());
        
      } //reader.onload

      reader.readAsText(fil, "UTF-8");
    },// loaddrop
    _SETCOLORBG:function(w){

let C = 'rgb(255,255,255)';
          switch (w) {
            case "primary":
              C={backgroundColor:'rgb('+this.colors.primary.join(',')+')'}
              break;
            case "secondary":
              C={backgroundColor:'rgb('+this.colors.secondary.join(',')+')'}
              break;
            case "tertiary":
              C={backgroundColor:'rgb('+this.colors.tertiary.join(',')+')'}
              break;
            case "quaternary":
              C={backgroundColor:'rgb('+this.colors.quaternary.join(',')+')'}
              break;
            case "quinary":
              C={backgroundColor:'rgb('+this.colors.quinary.join(',')+')'}
              break;
            default:
              C={backgroundColor:'rgb(222,222,222)'}
              break;
          }
return C

    }
    ,_SETCOLOR:function(w){

let C = 'rgb(255,255,255)';
          switch (w) {
            case "primary":
              C={color:'rgb('+this.colors.primary.join(',')+')'}
              break;
            case "secondary":
              C={color:'rgb('+this.colors.secondary.join(',')+')'}
              break;
            case "tertiary":
              C={color:'rgb('+this.colors.tertiary.join(',')+')'}
              break;
            case "quaternary":
              C={color:'rgb('+this.colors.quaternary.join(',')+')'}
              break;
            case "quinary":
              C={color:'rgb('+this.colors.quinary.join(',')+')'}
              break;
            default:
              C={color:'rgb(222,222,222)'}
              break;
          }
return C

    }
    ,_GETCOLORRAW:function(w){

let C = 'rgb(255,255,255)';
          switch (w) {
            case "primary":
              C='rgb('+this.colors.primary.join(',')+')'
              break;
            case "secondary":
              C='rgb('+this.colors.secondary.join(',')+')'
              break;
            case "tertiary":
              C='rgb('+this.colors.tertiary.join(',')+')'
              break;
            case "quaternary":
              C='rgb('+this.colors.quaternary.join(',')+')'
              break;
            case "quinary":
              C='rgb('+this.colors.quinary.join(',')+')'
              break;
            default:
              C='rgb(222,222,222)'
              break;
          }
return C

    }
    ,_LOADDROPOG: function(fil) {
      this.project.loadings.map = true;
      const reader = new FileReader();
      reader.loadend = e => {
        delete e.target.result;
      };

      reader.onload = e => {

        console.log("e.target.result:",e.target.result)

        if (JSON.parse(e.target.result).length <= 0) {
          this.dropzone.msg = "izzat json, really?!";
        } else {
          if (typeof this.JKGROUP == "undefined") {
            this.JKGROUP = new L.featureGroup().addTo(this.MAP);
          } else {
            this.JKGROUP.clearLayers();
          }
          if (typeof this.JKGROUPSI == "undefined") {
            this.JKGROUPSI = new L.featureGroup().addTo(this.MAP);
          } else {
            this.JKGROUPSI.clearLayers();
          }
          var style = { color: "#bc000a" }

          this.project.loadings.map = false;

          let go = JSON.parse(e.target.result);

          go.properties.name="geojsonfrmfil"
          go.crs = {
              type: "name",
              properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
            }

          let goo = {
            type: "FeatureCollection",
            name: "geojson",
            crs: {
              type: "name",
              properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
            },
            features: [
              {
                type: "Feature",
                properties: { name: "geojsonfromfil", anno:null, cartodb_id: null },
                geometry: {
                  type: "MultiPolygon",
                  coordinates: (JSON.parse(e.target.result).features)?JSON.parse(e.target.result).features[0].geometry.coordinates:JSON.parse(e.target.result).geometry.coordinates
                }
              }
            ]
          };

          L.geoJSON(go, {
            style: style
          })
            .bindPopup(layer => {
              return "<div>name: " + layer.feature.properties.name + "</div>";
            })
            .on("popupopen", layer => {
              this.active = layer.layer.feature;
            })
            .addTo(this.JKGROUP);
          map.fitBounds(this.JKGROUP.getBounds());
        }
      };

      reader.readAsText(fil, "UTF-8");
    },// loaddrop
    _ACCEPTDROP: function(fil) {
      console.log("fil in acceptDrop:", fil);
      // bookkeeping and prep func, if necessary
      this._LOADDROP(fil[0]);
    },
    _SETMANUAL:function(){
      // there's an active been accepted, we send it to the mongo store
      // console.log(JSON.stringify(this.activeTemp))
      this.active.properties.name=this.activeTemp.name
      this.active.properties.anno=this.activeTemp.anno
      this.modals.edit=false
    },
    _SEND:function() {
      
      $.ajax({
        type: "POST",
        url: "http://milleria.org:3030/geocode/submit/cbb",
        data: this.active,
        dataType: "json",
        beforeSend: el => {
          this.project.loadings.mongo = true;
        },
        success: data => {
          
          let pat = null;
          switch (data.response.geometry.type.toLowerCase()) {
            case "point":
              pat = "point";
              break;
            case "polygon":
              pat = "poly";
              break;
            case "multipolygon":
              pat = "poly";
              break;
            case "linestring":
              pat = "line";
              break;
            case "multilinestring":
              pat = "line";
              break;
            default:
              pat = null;
              break;
          }
          
            var paste =
              '"location_type": "' +
              pat +
              '","location_id": "' +
              data.response.properties.cartodb_id +
              '",';
            this.result = paste;
          
          this.modals.result = true;
          
        }
      })
        .fail((err, el) => {
          this.result=err
        })
        .done((unk, el) => {
          this.project.loadings.mongo = false;
        });
    },
    _EDIT:function(){
      // there's an active been accepted, we send it to the mongo store
      this.modals.edit=true
    },
    _GETCOLORS:function(){

$.ajax({
        type: "POST",
        url: 'http://colormind.io/api/',
        data: '{"model":"default"}',
        dataType: "json",
        beforeSend: el => {
          console.log('fetching random colors...')
        },
        success: data => {
          
          //map it here
          // set it
          this.colors=
{primary:data.result[0]
,secondary:data.result[1]
,tertiary:data.result[2]
,quaternary:data.result[3]
,quinary:data.result[4]
}
          
        }
      })
        .fail((err, el) => {
          console.log(err);
        });

    },
    _GEOCODE:function(){

      this.activeTemp.name=null;
this.activeTemp.anno=null;
      // preparse input
      this.$refs.topProgress.start()
      // send to appropriate endpoint
      this.project.loadings.map = true;
      
      // var style = this.STYLE();
      // var style = { color: this._GETCOLORRAW() }

      let uri =
        this.config.mode == "T"
          ? "http://localhost:8000/spokane-fake.json"
          : "http://milleria.org:3030/geocode/" + this.query;
      $.get(uri, data => {
        this.project.loadings.map = false;

this.JKGROUP.clearLayers();
this.JKGROUPSI.clearLayers();

  // console.log("(type):",(typeof data));
  // console.log("DATA:",data);
let data2=null;
if(Array.isArray(data)){
  data2=this.$_.map(this.$_.first(data,3),(dx,i,l)=>{
  let dy = dx;
  dy.properties.temp_id=i;
  dy.properties.name=this.$_.first(dx.properties.name.split(", "),2).join(", ")
  return dy;})} else {
  let dy = data;
  dy.properties.temp_id=0;
  dy.properties.name=data.properties.name.split(", ").join(", ")
  data2 = [dy];
}

this.candidates=data2

let style = { fillColor: "#859cbf",color:"#fff",opacity:.9 }
let styleSimple = { fillColor: "#44c40b",color:"#fff",opacity:.9 }

// let simples = this.$_.map(data2,(dox)=>{
//   let doo = dox;
//   doo.geometry = this.$TURFSIMPLE(dox.geometry,{tolerance: .5, highQuality: true,mutate:true})
// console.log("dox.geometry.length", doo.geometry.coordinates.length);
//   return doo
// })//map

// console.log("simples.geometry.length", simples);

L.geoJSON(data2,{style:styleSimple})
.bindPopup(layer => {
            return "<div class='has-text-weight-bold'>" + layer.feature.properties.name + "</div>";
          })
          .on("popupopen", layer => {
            // console.log("ln:",layer.layer.feature.geometry.coordinates.length)
            
            // this.active = layer.layer.feature;
// console.log('flntprev:',this.$_.flatten(layer.layer.feature.geometry.coordinates).length)
// console.log("layer.layer.feature", layer.layer.feature);

this.active={
  geometry:this.$TURFMETA.geomReduce(this.$TURFCLEAN(this.$TURFSIMPLE(layer.layer.feature.geometry,{tolerance: .2, highQuality: true,mutate:true})))
  ,properties:layer.layer.feature.properties
  ,type:layer.layer.feature.type
}

// console.log('lfattndlength:',this.$_.flatten(this.active.geometry.coordinates).length)
//             this.active = this.$_.map(layer,(lay)=>{
//               console.log("lay", lay);
//   let foot = lay;
//   foot.geometry = this.$TURFSIMPLE(lay.geometry,{tolerance: .5, highQuality: true,mutate:true})
//   return foot
// })//map


          })
.addTo(this.JKGROUPSI)

        this.MAP.fitBounds(this.JKGROUPSI.getBounds());

//         L.geoJSON(data2, {
//           style: style
//         })
//           .bindPopup(layer => {
//             return "<div>name: " + layer.feature.properties.name + "</div>";
//           })
          // .on("popupopen", layer => {
          //   this.active = layer.layer.feature;
          // })
//           .addTo(this.JKGROUP);
//         this.MAP.fitBounds(this.JKGROUP.getBounds());
      
this.$refs.topProgress.done()

      }); //.get
      
      

    }//geocode
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$mjk-primary: #8e0009;
$mjk-secondary:#c700fe;
$mjk-bg:rgb(255,255,255);

body{
  font-family: 'Merriweather Sans', sans-serif;
}

#map{
  position:absolute;top:20%;height:80%;width:100%;z-index:0;
}

#mjk-navMenu{padding:1em;}
#mjk-active{
  font-weight:900;
  font-size:1.8em;
  width:100%;
  padding-left:2em;
  font-family: 'Titillium Web', sans-serif;
  .fa{
  &:hover{color:rgb(222,222,222);cursor:pointer;}
}
}
#mjk-candidates{font-size:.6em;}
// #mjk-active{height:20vh;}
#mjk-query-field{
  // padding-top:1em;
  padding-left:1em;
}

.button{
  &:active{color:white;}
}

#mjk-query{
  font-weight:900;font-family: 'Titillium Web', sans-serif;
  &:focus{border:1px solid white;}
  width:35vw;
}

.j-btn{
  &:hover{
  text-shadow: 0px 0px 5px rgba(55,55,55,.8);
  cursor:pointer;
}
&:active{
  color:white;
}
}
</style>
