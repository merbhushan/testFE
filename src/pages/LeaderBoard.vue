<template>
  <div class="q-pa-md">
    <Loader v-if="loading" />
    <Listing v-else :data="data" :refreshData="refreshData" />
  </div>
</template>

<script>
import { scroll } from "quasar";
const { getScrollPosition, setScrollPosition, getScrollHeight } = scroll;

import Loader from "src/components/LeaderBoard/Loader";
import Listing from "src/components/LeaderBoard/Listing";

export default {
  components: {
    Loader,
    Listing
  },
  data() {
    return {
      columns: [
        {
          name: "index",
          label: "Rank",
          field: "index"
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.user.name,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "score",
          align: "center",
          label: "Score",
          field: "score",
          sortable: false
        }
      ],
      data: {},
      loading: true
    };
  },
  computed: {
    localData() {
      return this.data ? Object.freeze(Object.values(this.data)) : [];
    }
  },
  created() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      this.loading = true;
      this.data = Object.assign({});
      this.$store.dispatch("common/getLatestScores", {}).then(response => {
        if (response && response.status === 200) {
          // setScrollPosition(document.querySelector(".q-table__middle"), 0);
          // this.$refs.leaderBoard.scrollTo(0);
          setTimeout(() => {
            this.data = response.data.splice(0, 50);
            this.loading = false;
          }, 2000);
        }
      });
    }
  }
};
</script>
