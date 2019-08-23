<template>
<div class="">
  <div id="map"></div>
  <vue-headful :title="page.title" description="fxsxxxrrrre" />
  
  <!-- START NAV 1-->
    <nav id="mjk-navbar" class="navbar is-white">
        <!-- <div class="container"> -->
            <div class="navbar-brand">
                
                
            </div>
            <div id="navMenu" class="navbar-menu">
                <div class="navbar-start has-text-centered" style="padding-top:1em;">
                
<div class="field" id="mjk-query-field">
        <div class="control">
          <input id="mjk-query" v-model="query" class="input is-large" type="text" :placeholder="config.mode">
        </div>
        <p class="level-item"><span @click="_GEOCODE" class="fa fa-play"></span></p>
      </div nb="/.field">

      <section class="hero is-info welcome is-small">
                    <div class="hero-body">
                        <div class="container">
                            <h1 class="title">
                                <span>{{active.properties.name}}</span> <span v-if="active.properties.name" @click="_EDIT" class="fa fa-edit"></span><span v-if="active.properties.name" @click="_SEND" class="fa fa-upload"></span>
                            </h1>
                            <h2 class="subtitle">
                                {{active.properties.anno}}
                            </h2>
                        </div>
                    </div>
                </section>

                </div>

            </div>
        <!-- </div> -->
    </nav>
    <!-- END NAV 1 -->

  <!-- START NAV 2-->
    <nav id="mjk-candidates" class="navbar is-white is-marginless is-paddingless">
        <!-- <div class="container"> -->
            <div class="navbar-brand">
                
              <div class="is-left" v-for="can in candidates">{{can.properties.name}} <span @click="_SEND" v-if="can.properties.temp_id==active.properties.temp_id" class="fa fa-check"></span>|&nbsp;&nbsp;</div> 
                
            </div>
            
        <!-- </div> -->
    </nav>
    <!-- END NAV 2 -->


    <!-- <div class="container"> -->
<!--         <div class="columns">
            <div id="mjk-candidates" class="column is-3 ">
                <aside class="menu is-hidden-mobile">
                    <ul class="menu-list">
                        
                    <li v-for="can in candidates">{{can.properties.name}} <span @click="_SEND" v-if="can.properties.cartodb_id==active.properties.cartodb_id" class="fa fa-check"></span></li>
                    
                    </ul>
                </aside>
            </div> -->
            <!-- <div class="column is-9" id="mjk-active">
                
                <section class="hero is-info welcome is-small">
                    <div class="hero-body">
                        <div class="container">
                            <h1 class="title">
                                <span>{{active.nom}}</span> <span v-if="active.properties.name" @click="_SEND" class="fa fa-check"></span>
                            </h1>
                            <h2 class="subtitle">
                            </h2>
                        </div>
                    </div>
                </section>
                
            </div> -->
        <!-- </div> -->
    <!-- </div> -->

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
        
<div class="field">
        <div class="control">
          
          <input class="input is-large" v-model="activeTemp.name" placeholder="name">
          <input class="input is-medium" v-model="activeTemp.anno" placeholder="anno">
        </div>
        <p class="level-item"><span @click="_SETMANUAL" class="fa fa-parachute-box is-size-1"></span></p>
      </div nb="/.field">

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

  },
  mounted: function() {

this.MAP = new L.Map("map", {
  zoomControl: false,
  center: [51.505, -0.09],
  attributionControl: false,
  zoom: 2
});

if (! this.JKGROUP) {
        this.JKGROUP = new L.featureGroup().addTo(this.MAP);
      }

const baseLayer = new L.TileLayer(
  this.config.mode=='33'?"https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png":"http://localhost:8000/tile-T.png"
);

this.MAP.addLayer(baseLayer);

document.addEventListener("keydown", (e)=>{
  console.log('e.keyCode:',e.keyCode)
  if(e.keyCode==27){
    this.modals.result=false
    this.modals.edit=false
  }
})

  },
  data() {
    return {
      MAP:null,
      page: { title: "MIlLeriAjkR", splayed: false },
      modals: {result:false,edit:false},
      project:{loadings:{map:false,mongo:false}},
      query:'',
      activeTemp:{name:'',anno:''},
      result:null,
      active: {properties:{name:null,anno:null,cartodb_id:null}},
      candidates: [],
      dropzone: { state: "idle", msg: null },
      config: { mode: "33" }
    };
  },
  methods: {
    
    _SETMANUAL:function(){
      // there's an active been accepted, we send it to the mongo store
      console.log(JSON.stringify(this.activeTemp))
      this.active.properties.name=this.activeTemp.name
      this.active.properties.anno=this.activeTemp.anno
      this.modals.edit=false
    },
    _SEND:function() {
      
      $.ajax({
        type: "POST",
        url: "http://localhost:3030/geocode/submit/cbb",
        data: this.active,
        dataType: "json",
        beforeSend: el => {
          this.project.loadings.mongo = true;
        },
        success: data => {
          
          let pat = null;
          switch (data.response[0].geometry.type.toLowerCase()) {
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
              data.response[0].properties.cartodb_id +
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
    _GEOCODE:function(){
      // preparse input
      // send to appropriate endpoint
      this.project.loadings.map = true;
      
      // var style = this.STYLE();
      var style = { color: "#ec00ff" }

      let uri =
        this.config.mode == "T"
          ? "http://localhost:8000/spokane-fake.json"
          : "http://localhost:3030/geocode/" + this.query;
      $.get(uri, data => {
        this.project.loadings.map = false;
this.JKGROUP.clearLayers();

  console.log("(type):",(typeof data));
  console.log("DATA:",data);
let data2=null;
if(Array.isArray(data)){
  data2=this.$_.map(data,(dx,i,l)=>{
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

        L.geoJSON(data2, {
          style: style
        })
          .bindPopup(layer => {
            return "<div>name: " + layer.feature.properties.name + "</div>";
          })
          .on("popupopen", layer => {
            this.active = layer.layer.feature;
          })
          .addTo(this.JKGROUP);
        this.MAP.fitBounds(this.JKGROUP.getBounds());
      }); //.get
      // top hit goes to active
      // rest go to candidates
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$mjk-primary: #8e0009;
$mjk-secondary:#c700fe;
$mjk-bg:rgb(255,255,255);

#map{
  position:absolute;top:20%;height:80%;width:100%;z-index:0;
}

#mjk-navbar{}
#mjk-candidates{font-size:.6em;color:$mjk-secondary;background-color:$mjk-bg;}
#mjk-active{height:20vh;}
#mjk-query-field{margin-bottom:1em;}
#mjk-query{
  font-weight:900;
  color:$mjk-primary;
}
</style>
