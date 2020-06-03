<template>
  <div>
    <ul>
      <li class="auction-list"
        v-for="auction in auctions"
        :key="auction._id"
      >
        <Auction
          :auction="auction"
          :currUser="currUser"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Auction from "@/components/Auction";

export default {
    name: "AuctionList",
    components: {
        Auction
    },
    props: ["apiString"],
    data () {
        return {
            currUser: this.$store.getters.currentUser,
            auctions: null,
            currentPage: 0,
            size: {
                type: Number,
                required: false,
                default: 10
            }
        };
    },
    computed: {
        pageCount () {
            const length = this.listData.length;
            const size = this.size;
            return Math.ceil(length / size);
        },
        paginatedData () {
            const start = this.pageNumber * this.size;
            const end = start + this.size;
            return this.listData.slice(start, end);
        }
    },
    methods: {
        nextPage () {
            this.pageNumber++;
        },
        prevPage () {
            this.pageNumber--;
        }
    },
    created () {
        axios
            .get(this.apiString)
            .then((resp) => {
                this.auctions = resp.data.auctions;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>

<style lang="scss" scoped>
</style>
