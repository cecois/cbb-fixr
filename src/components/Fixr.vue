<template>
  <div class="">
    <!--     <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <level>
          <level-item class="">
            <span class="navbar-item" v-for="project in projects">
              {{ msg }}
            </span>
          </level-item>
          <level-item class="">
            {{ active.carto.type }}:{{ active.carto.cartodb_id }}
          </level-item>
        </level>
      </div>
    </nav> -->

    <nav id="fxr-level-nav-top" class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <span class="navbar-item" v-for="project in projects">
            {{ msg }}
          </span>
        </div>
        <div class="level-item">
          <div class="field has-addons"></div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right has-text-right">
        <p class="level-item">
          <span v-if="active.carto">
            <!-- <strong>{{ active.carto.type }}:{{ active.carto.cartodb_id }}</strong -->
            {{ active.carto.cartodb_id }}
          </span>
        </p>
      </div>
    </nav>

    <nav class="navbar">
      <div class="field navbar-item">
        <div class="control has-icons-left has-icons-right">
          <input
            v-on:keyup.enter="jeakod"
            v-model="incoming"
            class="input is-large"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <!-- /field -->

      <div class="field navbar-item">
        <input
          class="input is-large"
          v-model="OBJ.properties.name"
          placeholder="name"
        />
        <input
          class="input is-large"
          v-model="OBJ.properties.anno"
          placeholder="anno"
        />
        <span v-on:click="taketh" class="icon is-right">
          <i class="fas fa-3x fa-play-circle bt fxr-bt"></i>
        </span>
      </div>

      <div v-model="OBJ" class="navbar-item">
        <table class="table is-fullwidth">
          <tr>
            <pre>{{ OBJ.properties.name }}</pre>
          </tr>
          <tr>
            <pre>{{ OBJ.properties.anno }}</pre>
          </tr>
        </table>
      </div>

      <div class="modal" v-bind:class="{ 'is-active': modalClass }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <pre>{{ result }}</pre>
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="modalClass = false"
        ></button>
      </div>
    </nav>
    <div class="columns">
      <div id="missings-list">
        <ul>
          <!-- <li v-for="missing in missings">{{ missing.instance }}</li> -->
          <li v-for="missing in missings">
            <div v-for="gitem in missing">
              {{ gitem.instance }} (<span
                class="fxr-trigger-activator"
                :id="gitem._id"
                :data-target-id="gitem.carto.cartodb_id"
                :data-target-type="gitem.carto.type"
                @click="setActive"
                >{{ gitem.group_key }}</span
              >)
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- /columns -->
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
    this.missings = this.getMissings();
  },
  data() {
    return {
      missings: null,
      modalClass: false,
      result: null,
      msg: "This is yr stupid FIXR",
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
          created_at: "2018-01-17T21:42:38Z",
          updated_at: "2018-01-17T21:42:38Z",
          cartodb_id: null
        }
      },
      incoming: null,
      projects: [{ nom: "CBB", active: "is-active" }]
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

      // this.active = {
      //   id: e.target.attributes["data-target-id"],
      //   type: e.target.attributes["data-target-type"],
      //   _id: e.target.attributes.id
      // };
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
      // var el = $(event.target)
      // $(el).addClass("has-text-danger")
      // var self = this;

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
#fxr-level-nav-top {
  background-color: rgba(255, 255, 255, 1);
  color: orange;
  font-weight: 800;
}
.navbar-item {
  color: inherit;
}
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

.bt:hover {
  cursor: pointer;
}

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
.fxr-bt {
  color: orange;
}
a {
  color: orange;
}
a.is-active {
  font-weight: 800;
}
</style>
