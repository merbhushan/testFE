<template>
  <q-table
    ref="leaderBoard"
    class="my-sticky-dynamic"
    :data="data"
    :columns="columns"
    row-key="index"
    :rows-per-page-options="[0]"
    hide-bottom
    no-data-label="I didn't find anything for you"
    style="background-color: #171920; color: white;"
  >
    <template v-slot:top>
      <div class="full-width" style="text-align: center">
        <img
          style="height: 100px; width: 100px; background-color: white; border-radius: 50%; border: 1px solid white;"
          src="/images/logo-without-bg.png"
        />
        <div class="text-h4 text-center" style="margin-top: 5px;">
          Leader Board
        </div>
      </div>
    </template>
    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span> Well this is sad... {{ message }} </span>
        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
      </div>
    </template>
    <template v-slot:body-cell-index="index">
      <q-td :props="index">
        <div>{{ index.pageIndex + 1 }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { scroll } from "quasar";
const { getScrollPosition, setScrollPosition, getScrollHeight } = scroll;

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    refreshData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          name: "index",
          label: "Rank",
          field: "index",
          headerStyle:
            "font-size: xx-large; text-align: center; background-color: #171920;",
          style: "font-size: x-large; text-align: center; "
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.user.name,
          format: val => `${val}`,
          sortable: false,
          headerStyle: "font-size: xx-large; background-color: #171920;",
          style: "font-size: x-large;"
        },
        {
          name: "score",
          align: "center",
          label: "Score",
          field: "score",
          sortable: false,
          headerStyle: "font-size: xx-large; background-color: #171920;",
          style: "font-size: x-large;"
        }
      ]
    };
  },
  mounted() {
    this.scrollToEnd();

    document.querySelector(".q-table__middle").onscroll = event => {
      const targetElement = document.querySelector(".q-table__middle");
      const targetHeight = getScrollHeight(targetElement);
      if (
        getScrollPosition(targetElement) + 1 >
        targetHeight - targetElement.clientHeight
      ) {
        setTimeout(() => {
          this.loading = true;
          setScrollPosition(targetElement, 0, 100);
          this.refreshData();
        }, 5000);
      }
    };
  },
  methods: {
    scrollToEnd() {
      setTimeout(async () => {
        const targetElement = document.querySelector(".q-table__middle");
        const targetHeight = getScrollHeight(targetElement);
        // document.querySelector("table tr").clientHeight * 50;
        const scrollTime = 45 * 1000;
        setScrollPosition(targetElement, targetHeight, parseInt(scrollTime));
      }, 2000);
    }
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
.my-sticky-dynamic {
  /* height or max-height is important */
  height: 95vh;
}
body > table {
  background-color: "#2c5de6bf";
}
</style>
<style lang="sass">

.q-table__middle
  overflow-y: hidden


.my-sticky-dynamic
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
