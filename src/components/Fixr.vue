<template>
  <div class="">
    <vue-headful :title="page.title" description="fxsxxxrrrre" />
    <nav id="fxr-console" class="breadcrumb is-right" aria-label="breadcrumbs">
      <ul>
        <li v-for="msg in console.msgs">{{ msg }}</li>
      </ul>
    </nav>
    <nav class="level" id="fxr-level-nav-top">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">incoming {{ dropzone.msg }}</p>
          <input
            id="dropzone"
            style=""
            v-on:keyup.enter="jeakod"
            v-model="incoming"
            class="input is-medium has-text-centered fxr-input-camo"
            type="text"
            placeholder="lk"
          />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading"></p>
          <input
            style=""
            class="input is-medium has-text-centered fxr-input-camo"
            type="text"
            placeholder=" "
          />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">fix type</p>
          <p class="title">
            <span v-if="active.carto.type">{{ active.carto.type }}</span
            ><span v-else>&nbsp;</span>
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">fix id</p>
          <p class="title">
            <span v-if="active.carto.cartodb_id">{{
              active.carto.cartodb_id
            }}</span
            ><span v-else>&nbsp;</span>
          </p>
        </div>
      </div>
    </nav>
    <nav class="level" id="fxr-level-nav-top">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">name</p>
          <input
            style=""
            v-model="OBJ.properties.name"
            class="input is-medium has-text-centered fxr-input-camo"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">anno</p>
          <input
            style=""
            v-model="OBJ.properties.anno"
            class="input is-medium has-text-centered fxr-input-camo"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <!--       <div class="level-item has-text-centered">
        <div>
          <p class="heading">result type</p>
          <p class="title"><span v-if="OBJ.geometry.type">{{OBJ.geometry.type}}</span><span v-else>&nbsp;</span></p>
        </div>
      </div> -->
      <div class="level-item has-text-centered">
        <div>
          <p
            v-bind:class="[project.loading ? 'is-loading' : '']"
            class="heading"
          >
            <span
              v-on:click="taketh"
              class="icon is-right fxr-bt
"
            >
              <i class="fas fa-3x fa-play-circle bt "></i>
            </span>
          </p>
        </div>
      </div>
    </nav>
    <div class="columns">
      <div
        id="missings-list"
        v-bind:class="[this.page.splayed ? 'is-hidden' : '']"
      >
        <ul>
          <li v-for="missing in missings">
            <!-- <div v-for="gitem in missing"> -->
            <a
              target="_blank"
              v-bind:href="'https://www.earwolf.com/episode/' + missing.slug"
              >{{ missing.episode }}</a
            >.{{ missing.tstart }}.{{ missing.instance }} (<span
              class="fxr-trigger-activator"
              :id="missing._id"
              :data-target-id="missing.cartodb_id"
              :data-target-type="missing.type"
              @click="setActive"
              >{{ missing.group_key }}</span
            >)
            <!-- </div> -->
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
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="modalClass = false"
      ></button>
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
    this.console.msgs.push("mounted");
    this.missings = this.getMissings();

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
      this.acceptDrop(fil);
    });

    /* ++++++++++++++++++++++++++++++++++++++++++ /dropzone */

    window.addEventListener("keyup", event => {
      if (event.keyCode == 18) {
        this.page.splayed = !this.page.splayed;
      }
    });
  },
  data() {
    return {
      page: { title: "cbbfixr", splayed: false },
      dropzone: { state: "idle", msg: null },
      config: { mode: "33" },
      missings: null,
      console: { msgs: [] },
      modalClass: false,
      result: null,
      active: {
        _id: null,
        carto: {
          cartodb_id: null,
          type: null
        },
        tstart: null,
        instance: null,
        tags: null,
        episode: {
          $numberInt: null
        },
        slug: null
      },
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
      project: { loading: false, shorthand: "CbBFiXR" }
    };
  },
  methods: {
    setActive: function(e) {
      let t = e.target.innerText.split(":");
      let o = this.$_.find(this.missings, mi => {
        // console.log("mi:", mi);
        return mi.carto.type == t[0] && mi.carto.cartodb_id == t[1];
      });
      // console.log("o", o);
      this.active = o;
    },
    loadDrop: function(fil) {
      this.project.loading = true;
      const reader = new FileReader();
      reader.loadend = e => {
        delete e.target.result;
      };

      reader.onload = e => {
        if (JSON.parse(e.target.result).length <= 0) {
          this.dropzone.msg = "izzat json, really?!";
        } else {
          if (typeof JkGroup == "undefined") {
            var JkGroup = new L.featureGroup().addTo(map);
          } else {
            JkGroup.clearLayers();
          }
          var style = this.STYLE();
          // console.log("e.target.result:", e.target.result);

          this.project.loading = false;

          console.log(JSON.parse(e.target.result));

          let go = JSON.parse(e.target.result);

          console.log("GO:", go);
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
                properties: { name: "geojsonfromfil", cartodb_id: null },
                geometry: {
                  // type: "MultiPolygon",
                  type: "LineString",
                  coordinates: JSON.parse(e.target.result).features.geometry
                    .coordinates
                }
              }
            ]
          };

          console.log("go", go);
          L.geoJSON(go, {
            style: style
          })
            .bindPopup(layer => {
              return "<div>name: " + layer.feature.properties.name + "</div>";
            })
            .on("popupopen", layer => {
              this.OBJ.properties = layer.layer.feature.properties;
              this.OBJ.geometry = layer.layer.feature.geometry;
            })
            .addTo(JkGroup);
          map.fitBounds(JkGroup.getBounds());
        }
      };

      reader.readAsText(fil, "UTF-8");
    },
    acceptDrop: function(fil) {
      console.log("fil in acceptDrop:", fil);
      // bookkeeping and prep func, if necessary
      this.loadDrop(fil[0]);
    },
    jeakod: function() {
      this.project.loading = true;

      if (typeof JkGroup == "undefined") {
        var JkGroup = new L.featureGroup().addTo(map);
      } else {
        JkGroup.clearLayers();
      }
      var style = this.STYLE();

      let uri =
        this.config.mode == "T"
          ? "http://localhost:8000/spokane-fake.json"
          : "http://localhost:8080/geocode/" + this.incoming;
      $.get(uri, data => {
        this.project.loading = false;

        L.geoJSON(data, {
          style: style
        })
          .bindPopup(layer => {
            return "<div>name: " + layer.feature.properties.name + "</div>";
          })
          .on("popupopen", layer => {
            this.OBJ.properties = layer.layer.feature.properties;
            this.OBJ.geometry = layer.layer.feature.geometry;
          })
          .addTo(JkGroup);
        map.fitBounds(JkGroup.getBounds());
      }); //.get
    }, //jeakod
    getMissings: function() {
      this.console.msgs.push("loading problems");
      $.ajax({
        type: "GET",
        url:
          this.config.mode == "T"
            ? "http://localhost:8000/missings-fake.json"
            : "http://localhost:8080/missings/all",
        dataType: "json",
        beforeSend: () => {},
        success: data => {
          let missingsMap = this.$_.map(data, mi => {
            let o = mi;
            o.group_key = mi.carto.type + ":" + mi.carto.cartodb_id;
            return o;
          });
          this.console.msgs.push("found " + data.length + " missings");
          this.missings = this.$_.sortBy(data, "episode");
          // let missingsGroups = this.$_.groupBy(missingsMap, "group_key");
          // this.missings = this.$_.sortBy(
          // missingsGroups,
          // "carto.cartodb_id"
          // "episode"
          // );
          // .reverse();
        } //success
      }) //ajax
        .fail((err, el) => {})
        .done((unk, el) => {});
    },
    updateth: function() {
      // let id2up = this.active._id.$oid;
      let cid = this.active.carto.cartodb_id;
      let ctyp = this.active.carto.type;
      this.console.msgs.push("updating the missing " + ctyp + ":" + cid);

      $.ajax({
        type: "POST",
        url: "http://localhost:8080/geocode/fix/once",
        data: { cid: cid, ctyp: ctyp },
        dataType: "json",
        beforeSend: el => {
          this.project.loading = true;
        },
        success: data => {
          this.console.msgs.push("update success -- done");
          this.incoming = null;
          this.OBJ.properties.name = null;
          this.OBJ.properties.anno = null;
          this.getMissings();
        }
      })
        .fail((err, el) => {
          console.error("update of " + ctyp + ":" + cid + " failed");
        })
        .done((unk, el) => {
          this.project.loading = false;
        });
    },
    taketh: function() {
      this.console.msgs.push("submitting OBJ.properties.cartodb_id");
      // var el = $(event.target);
      this.OBJ.properties.cartodb_id = this.active.carto.cartodb_id
        ? this.active.carto.cartodb_id
        : null;
      this.OBJ.properties.nb = this.incoming;
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/geocode/submit/cbb",
        data: this.OBJ,
        dataType: "json",
        beforeSend: el => {
          this.project.loading = true;
        },
        success: data => {
          this.project.loading = false;
          this.console.msgs.push("POST success, updating...");
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
          if (!this.active.carto.id) {
            var paste =
              '"location_type": "' +
              pat +
              '","location_id": "' +
              data.response[0].properties.cartodb_id +
              '",';
            this.result = paste;
          }
          this.modalClass = true;
          this.updateth();
        }
      })
        .fail((err, el) => {
          $(el).removeClass("has-text-danger");
        })
        .done((unk, el) => {
          $(el).removeClass("has-text-danger");
        });
    },

    takethOG: function() {
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
a:hover {
  color: brown;
}
nav {
  z-index: 1;
}
.fxr-input-camo {
  font-weight: 800;
  box-shadow: none;
  border: none;
  border-color: transparent;
}
#fxr-console {
  margin-bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 0.5em;
  color: black;
}
#fxr-level-nav-top {
  background-color: rgba(255, 255, 255, 1);
  color: orange;
  font-weight: 800;
  margin-bottom: 1px;
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
.fxr-bt {
  color: orange;
}
.fxr-bt:hover {
  cursor: pointer;
  color: black;
}
.fxr-bt:active {
  color: white;
}
a {
  color: orange;
}
a.is-active {
  font-weight: 800;
}

.is-loading {
  display: inline-block;
  width: 29px;
  height: 29px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border-top-color: rgba(0, 0, 0, 0.3);
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
