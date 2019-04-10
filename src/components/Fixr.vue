<template>
  <div class="">
    <nav id="fxr-console" class="breadcrumb is-right" aria-label="breadcrumbs">
      <ul>
        <li v-for="msg in console.msgs">{{msg}}</li>
      </ul>
    </nav>
    <nav class="level" id="fxr-level-nav-top">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">incoming</p>
          <input style="" v-on:keyup.enter="jeakod" v-model="incoming" class="input is-medium has-text-centered fxr-input-camo" type="text" placeholder="lk" />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">trns</p>
          <input style="" v-model="OBJ.properties.anno" class="input is-medium has-text-centered fxr-input-camo" type="text" placeholder="" />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">fixed type</p>
          <p class="title"><span v-if="active.type">{{active.type}}</span><span v-else>&nbsp;</span></p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">fixed id</p>
          <p class="title"><span v-if="active.id">{{active.id}}</span><span v-else>&nbsp;</span></p>
        </div>
      </div>
    </nav>
    <nav class="level" id="fxr-level-nav-top">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">name</p>
          <input style="" v-model="OBJ.properties.name" class="input is-medium has-text-centered fxr-input-camo" type="text" placeholder="lk" />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">anno</p>
          <input style="" v-model="OBJ.properties.anno" class="input is-medium has-text-centered fxr-input-camo" type="text" placeholder="" />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">result type</p>
          <p class="title"><span v-if="OBJ.geometry.type">{{OBJ.geometry.type}}</span><span v-else>&nbsp;</span></p>
        </div>
      </div>
    </nav>
    <section class="">
      <span v-on:click="taketh" class="icon is-right fxr-bt
">
          <i class="fas fa-3x fa-play-circle bt "></i>
        </span>
    </section>
    <div class="columns">
      <div id="missings-list">
        <ul>
          <!-- <li v-for="missing in missings">{{ missing.instance }}</li> -->
          <li v-for="missing in missings">
            <div v-for="gitem in missing">
              {{ gitem.instance }} (<span class="fxr-trigger-activator" :id="gitem._id" :data-target-id="gitem.carto.cartodb_id" :data-target-type="gitem.carto.type" @click="setActive">{{ gitem.group_key }}</span
              >)
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- /columns -->

    <div class="modal" v-bind:class="{ 'is-active': modalClass }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <pre>{{ result }}</pre>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="modalClass = false"></button>
      </div>

  </div>
</template>

<script>
export default {
  name: "CbBFiXR",
  created: function() {
    var mess = "CbBFiXR";
    this.msg = mess.toUpperCase();
  },
  mounted: function() {
    this.console.msgs.push("mounted")
    this.missings = this.getMissings();
  },
  data() {
    return {
      missings: null,
      console:{msgs:[]},
      modalClass: false,
      result: null,
      active: { id: null, type: null },
      OBJ: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        },
        properties: {
          name: null,
          anno: null,
          confidence: null,
          scnotes: "nominatim via milleria geocoder",
          created_at: "2019-04-10T21:42:38Z",
          updated_at: "2019-04-10T21:42:38Z",
          cartodb_id: null
        }
      },
      incoming: null,
      project: { shorthand: "CbBFiXR"}
    };
  },
  methods: {
    setActive: function(e) {
      let t = e.target.innerText.split(":");
      // console.log(t);
      let o = this.$_.find(this.missings, mi => {
        console.log("mi:", mi[0].carto);
        return mi[0].carto.type == t[0] && mi[0].carto.cartodb_id == t[1];
      });
      // console.log("o:", o);
      this.active = o[0];

    },
    jeakod: function() {
      $(event.target.parentElement).addClass("is-loading");

      if (typeof JkGroup == "undefined") {
        var JkGroup = new L.featureGroup().addTo(map);
      } else {
        JkGroup.clearLayers();
      }
      var style = this.STYLE();

      var self = this;
      $.get("http://localhost:8080/geocode/" + this.incoming, function(data) {
        $(event.target.parentElement).removeClass("is-loading");

        L.geoJSON(data, {
          style: style
        })
          .bindPopup(function(layer) {
            return "<div>name: " + layer.feature.properties.name + "</div>";
          })
          .on("popupopen", function(layer) {
            console.log("layer:");
            console.log(layer);

            self.OBJ.properties = layer.layer.feature.properties;
            self.OBJ.geometry = layer.layer.feature.geometry;
          })
          .addTo(JkGroup);
        map.fitBounds(JkGroup.getBounds());
      }); //.get
    }, //jeakod
    getMissings: function() {

      $.ajax({
        type: "GET",
        url: "http://localhost:8080/missings/all",
        dataType: "json",
        beforeSend: () => {},
        success: data => {
          let missingsMap = this.$_.map(data, mi => {
            let o = mi;
            o.group_key = mi.carto.type + ":" + mi.carto.cartodb_id;
            return o;
          });
          this.console.msgs.push("found "+data.length+" missings")
          let missingsGroups = this.$_.groupBy(missingsMap, "group_key");
          this.missings = this.$_.sortBy(
            missingsGroups,
            "carto.cartodb_id"
          ).reverse();
        } //success
      }) //ajax
        .fail((err, el) => {
          // $(el).removeClass("has-text-danger")
        })
        .done((unk, el) => {
          // $(el).removeClass("has-text-danger")
        });
    },
    taketh: function() {
      var el = $(event.target);
      $(el).addClass("has-text-danger");

      $.ajax({
        type: "POST",
        url: "http://localhost:8080/geocode/submit/cbb",
        data: this.OBJ,
        dataType: "json",
        beforeSend: (el)=>{
          $(".bt").addClass("has-text-danger");
        },
        success: (data)=>{
          var pat = null;
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

          this.modalClass = true;
        }
      })
        .fail((err, el) => {
          $(el).removeClass("has-text-danger");
        })
        .done((unk, el) => {
          $(el).removeClass("has-text-danger");
        });
    },takethOG: function() {
      var el = $(event.target);
      $(el).addClass("has-text-danger");
      var self = this;

      $.ajax({
        type: "POST",
        url: "http://localhost:8080/geocode/submit/cbb",
        data: self.OBJ,
        dataType: "json",
        beforeSend: function(el) {
          $(".bt").addClass("has-text-danger");
        },
        success: function(data) {
          var pat = null;
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
          self.result = paste;

          // $(".modal").addClass("is-active")
          self.modalClass = true;
        }
      })
        .fail((err, el) => {
          $(el).removeClass("has-text-danger");
        })
        .done((unk, el) => {
          $(el).removeClass("has-text-danger");
        });
    },
    STYLE: function() {
      return { color: "orange" };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
  z-index: 1;
}
.fxr-input-camo{
  font-weight:800;box-shadow:none;border:none;border-color:transparent;
}
#fxr-console{margin-bottom:0;background-color:rgba(255,255,255,.8);font-size:.5em;color:black;}
#fxr-level-nav-top {
  background-color: rgba(255, 255, 255, 1);
  color: orange;
  font-weight: 800;
}
/*.navbar-item {
  color: inherit;
}*/
#missings-list {
  font-size: 0.7em;
  background-color: white;
  height: inherit;
  z-index: 1;
  overflow-y: scroll;
}

.fxr-trigger-activator {
  font-weight: 800;
  font-size: 1.2em;
  cursor: pointer;
  color: #232683;
}
.fxr-trigger-activator:hover {
  color: black;
}
.fxr-trigger-activator:active {
  color: white;
}

.columns {
  z-index: 2;
}

/*.bt:hover {
  cursor: pointer;
}*/

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.fxr-bt{
  color: orange;
}
.fxr-bt:hover{cursor:pointer;color:black;}
.fxr-bt:active{color:white;}
a {
  color: orange;
}
a.is-active {
  font-weight: 800;
}
</style>
