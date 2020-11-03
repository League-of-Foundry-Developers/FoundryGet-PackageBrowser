<template>
  <div class="hello">
    <settings-overlay
      v-bind:overlayState="settingsOverlay"
      v-on:click="settingsOverlay = $event"
    />
    <modules>
      <section class="sidebar-wrapper">
        <menu class="fixed">
          <nav height="calc(100vh - 92px)" color="accent">

            <p>
              <select
                v-model="filter.authors"
                :items="authors"
                outlined
                dense
                chips
                small-chips
                label="Authors"
                multiple
              />
            </p>

            <p>
              <select
                v-model="filter.languages"
                :items="languages"
                outlined
                dense
                chips
                small-chips
                label="Languages"
                multiple
              />
            </p>

            <p>
              <select
                v-model="filter.systems"
                :items="systemFilter"
                outlined
                dense
                chips
                small-chips
                label="Systems"
                multiple
              />
            </p>

            <!--template v-slot:append>
              <div fill-width class="justify-center">
                <v-btn icon @click="handleSettingsClick">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </div>
            </template-->

          </nav>
        </menu>
      </section>
      <!--v-filterable-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :custom-filter="customFilter"
        :search="filter"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
      -->

      <!--template v-slot:header-->
      <template>

          <div
            dark
            color="primary"
            class="mb-1"
          >
            <input type="text"
              v-model="filter.search"
              clearable
              flat
              solo-inverted
              hide-details
              label="Search"
            />
            <!--template v-if="$vuetify.breakpoint.mdAndUp"-->
            <template>
              <select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                label="Sort by"
              ></select>
              <!--div
                v-model="sortDesc"
                mandatory
              -->
              <div
                mandatory
              >
                <button
                  large
                  depressed
                  color="primary"
                  :value="false"
                >
                  <!--v-icon>mdi-arrow-up</v-icon-->
                </button>
                <button
                  large
                  depressed
                  color="accent"
                  :value="true"
                >
                  <!--v-icon>mdi-arrow-down</v-icon-->
                </button>
              </div>
            </template>
          </div>

                <!-- <v-chip-group
                    column
                    multiple
                >
                    <v-chip filter outlined>Systems</v-chip>
                    <v-chip filter outlined>Modules</v-chip>
                    <v-chip filter outlined>Libraries</v-chip>
                    <v-chip filter outlined>Content Packs</v-chip>
                </v-chip-group> -->
        </template>

        <!--template -->
        <template v-slot:default="props">
          <div>
            <section
              v-for="item in props.items"
              :key="item.name"
              cols="12"
              lg="3"
              md="6"
              sm="12"
            >
                <Module
                    :module="item"
                    :modules="props.items"
                />
            </section>
          </div>
        </template>
<!--
        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span
              class="mr-4
              grey--text"
            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
       -->
      <!--/v-filterable-data-iterator-->

<!--
        <Module
            v-for="module in modules"
            v-bind:module="module"
            :key="module.name"
        /> -->
    </modules>
  </div>
</template>

<script>
import axios from "axios";
import Module from "./Module.vue";
//import VFilterableDataIterator from "./DataIteratorOverride/FilterableDataIterator.vue";
import SettingsOverlay from "./SettingsOverlay.vue";

export default {
  name: "Modules",

  components: {
    Module,
    //VFilterableDataIterator,
    SettingsOverlay
  },

  data() {
    return {
      loading: true,    // can be used for loading icon
      modules: null,
      languages: [],
      authors: [],
      systemFilter: [],
      systemCache: {
        any: "System Agnostic"
      },
      filter: {
        search: '',
        languages: [],
        systems: [],
        authors: [],
      },
      sortDesc: false,
      sortBy: 'name',
      page: 1,
      itemsPerPage: 5,
      itemsPerPageArray: [6, 9, 12],
      keys: [
        'Name',
        'Type',
        'Installs'
      ],
      items: [],
      settingsOverlay: false,
    };
  },

  methods: {

    mountAPI() {
      this.loading = true;
      const apis = localStorage.getObject("apis");

      let modules = [];
      let systems = [];

      let buffer = {};

      Object.keys(apis).forEach(async (key) => {
        if (apis[key]) {
          buffer[key] = undefined;

          axios
          .get(
            key
          )
          .then(response => {
            console.log(response.data.packages);
            response.data.packages.forEach(Package => {
              if (Package.type === "system") {
                systems.push(Package);
              } else if (Package.type === "module") {
                modules.push(Package);
              }
            })
            this.items = [...this.items, ...response.data.packages].reduce((newArray, item) => {
              if (newArray.map(x => x?.name).includes(item?.name || "")) return newArray;
              else return [...newArray, item];
            }, [])

            delete buffer[key];
          })
        }
      });

      (async () => {
        let working = true;
        setTimeout(() => working = false, 15000)
        while (working) {
          await this.$func.sleep(100);
          if (Object.keys(buffer).length === 0) working = false;
        }

        this.modules = modules;
        this.systems = systems;
        this.languages = this.getLanguages();
        this.systemFilter = this.getSystems();
        this.authors = this.getAuthors();

        this.loading = false;
      })();

    },

    customFilter(items, filter) {
      // filters
      let textSearch = "";
      try {
        textSearch = filter.search.toString().toLowerCase();
      }
      catch {
        textSearch = "";
      }
      let languagesSearch = filter.languages
      let systemSearch = [];
      filter.systems.forEach(system => systemSearch.push(this.getSystem(system)));
      let authorSearch = filter.authors;


      // check if any filter active
      if (
           ( typeof filter.search !== 'string' || filter.search.trim().length === 0 ) // check if search is empty
        && ( typeof filter.languages !== 'object' || filter.languages.length === 0 ) // check if languages is empty
        && ( typeof filter.systems !== 'object' || filter.systems.length === 0 ) // check if systems is empty
        && ( typeof filter.authors !== 'object' || filter.authors.length === 0 ) // check if authors is empty
      ) return items;

      /**@type {Object} item -- object with module data
       * @type {String} key -- current key that's being looked at
       * @type {String} value -- current value that got returned from combination object - key */
      return items.filter((item) => {
        // object with all filters, used for multi-filter
        let check = {
          filterSearch: false,
          filterLanguage: false,
          filterSystem: false,
          filterAuthor: false
        };

        Object.keys(item).forEach(key => {
          let value = null; //This line needs fixed because Vuetify is gone getObjectValueByPath(item, key);

          if ( value != null ) {
            if ( !check.filterSearch && this.filterSearch(value, textSearch) ) check.filterSearch = true;
            if ( !check.filterLanguage && this.filterLanguage(value, languagesSearch, key) ) check.filterLanguage = true;
            if ( !check.filterAuthor && this.filterAuthor(value, authorSearch, key) ) check.filterAuthor = true;
          }
          if (value !== undefined) {
            if ( !check.filterSystem && this.filterSystem(value, systemSearch, key) ) check.filterSystem = true;
          }
        })

        return Object.keys(check).every( k => check[k] );
      });
    },

    filterSearch(value, textSearch) {
      if ( !textSearch || textSearch.trim() === '' ) return true;
      return value.toString().toLocaleLowerCase().indexOf(textSearch.toLocaleLowerCase()) !== -1;
    },

    filterLanguage(value, languagesSearch, key) {
      if ( !languagesSearch || languagesSearch?.length === 0 ) return true;
      if ( value?.length === 0 || key !== "languages" ) return false;

      let isTrue = false;
      value.forEach(language => {
        let localLanguage = this.$func.getLanguageByTag(language);

        if (languagesSearch.includes(localLanguage)) isTrue = true;
      })
      return isTrue;
    },

    filterSystem(value, systemSearch, key) {
      if ( !systemSearch || systemSearch?.length === 0 ) return true;
      if ( key !== "systems" ) return false;
      if (value === null) return systemSearch.includes("any");

      let isTrue = false;
      value.forEach(system => {
        if (systemSearch.includes(system)) isTrue = true;
      })
      return isTrue;
    },

    filterAuthor(value, authorSearch, key) {
      if ( !authorSearch || authorSearch?.length === 0 ) return true;
      if ( value?.length === 0 || key !== "author" ) return false;

      let isTrue = false;
      authorSearch.forEach(author => {
        if (this.$func.ciIncludes(value, author)) isTrue = true;
      });
      return isTrue;
    },

    getLanguages() {
      let languages = [];
      this.modules.forEach(module => {
        if (module.languages && module.languages.length !== 0) {
          module.languages.forEach(language => {
            let languageTag = this.$func.getLanguageByTag(language);
            if (!languages.includes(languageTag)) {
              languages.push(languageTag);
            }
          });
        }
      });
      return languages.sort(Intl.Collator().compare);
    },

    getSystems() {
      let systems = [];
      this.modules.forEach(module => {
        if (module.systems && module.systems.length !== 0) {
          module.systems.forEach(system => {
            if (!Object.keys(this.systemCache).includes(system)) {
              let systemObject = this.systems.filter(globalSystem => globalSystem.name === system);
              if (!systems.includes(systemObject[0]?.title || system)) {
                systems.push(systemObject[0]?.title || system);
                this.systemCache[system] = systemObject[0]?.title || system;
              }
            }
          });
        }
      });
      systems = systems.sort(Intl.Collator().compare)
      systems.unshift("System Agnostic")
      return systems
    },

    getSystem(systemId) {
      let out = "";
      Object.entries(this.systemCache).forEach(([key, val]) => {
        if (val === systemId) out = key;
      });
      return out;
    },

    getAuthors() {
      let authors = [];
      this.modules.forEach(module => {
        if (module.author && module.author?.length !== 0) {
          const regex = /(,|\[|\]|\(|\)|<|>|-|–|[^/:]\/|[^ps]:| and | maintained by )/gi;
          module.author.split(regex).forEach(author => {
            if (typeof author !== "object"
                && author.match(regex) == null
                && author.match(/(object Object|translation|discord|https?:\/\/)/gi) == null
                && author.match(/[a-zA-Z]/) != null
            ) {
              author = author.split(" by ")?.[1] || author;
              author = author.split(" from ")?.[1] || author;
              author = author.split("#")?.[0] || author;
              author = author.trim();
              if (!(
                    this.$func.ciIncludes(authors, author.replace("@", ""))
                || (author.includes("@") && author.includes("."))
              )) {
                authors.push(author.replace("@", ""));
              }
            }
          });
        }
      });
      return authors.sort(Intl.Collator().compare);
    },

    handleSettingsClick() {
      this.settingsOverlay = !this.settingsOverlay;
    }

  },

  mounted() {
    console.log("Mounted");
    if (!localStorage.getObject("apis") || Object.keys(localStorage.getObject("apis")).length === 0) {
      localStorage.setObject("apis", {
        "https://forge-vtt.com/api/bazaar": true,    // For future reference, the Dev API is at: "https://dev.forge-vtt.com/api/bazaar"
        // "https://dev.forge-vtt.com/api/bazaar": true
      });
    }

    this.mountAPI();

  },

  computed: {
    filteredKeys () {
      return this.keys.filter(key => key !== `Name`)
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;

  .fixed {
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .sidebar-wrapper {
    flex: 0 0 256px;
    background: none;
    box-shadow: none;
    margin: {
      right: 20px;
    }
  }
  .v-navigation-drawer {

  }
  .v-data-iterator {
    flex: 1;
  }
}


h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
