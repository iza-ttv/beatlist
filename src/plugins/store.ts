import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence, { AsyncStorage } from "vuex-persist";
import localForage from "localforage";
import pathify from "@/plugins/pathify";
import modules, { StoreState } from "@/store";

const isDevelopment = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

const vuexLocalCachedData = new VuexPersistence<StoreState>({
  key: "vuex-cached-data",
  storage: localForage as AsyncStorage,
  asyncStorage: true,
  strictMode: isDevelopment,
  reducer: (state) => ({
    // beatmap: state.beatmap,
    beatmap: {
      lastScan: state.beatmap.lastScan,
      beatmaps: state.beatmap.beatmaps,
      // beatmapHashMap は除外
      beatsaverCached: state.beatmap.beatsaverCached,
      beatsaverFailCached: state.beatmap.beatsaverFailCached,
      beatsaverKeyToHashIndex: state.beatmap.beatsaverKeyToHashIndex,
      // beatsaverCacheUpdated は除外
    },
    // playlist: state.playlist,
    playlist: {
      lastScan: state.playlist.lastScan,
      playlists: state.playlist.playlists,
      // playlistFolders は除外
    },
  }),
});

const vuexLocalMain = new VuexPersistence<StoreState>({
  key: "vuex-main",
  storage: localForage as AsyncStorage,
  asyncStorage: true,
  strictMode: isDevelopment,
  reducer: (state) => ({
    settings: state.settings,
    modal: state.modal,
  }),
});

const store = new Vuex.Store<StoreState>({
  plugins: [vuexLocalMain.plugin, vuexLocalCachedData.plugin, pathify.plugin],
  modules,
  mutations: {
    RESTORE_MUTATION: vuexLocalMain.RESTORE_MUTATION,
  },
  strict: isDevelopment,
});

export default store as typeof store & { restored: Promise<void> };
