<template>
  <div id="app">
    <div>
      <NavbarMobile v-if="isMobileVew()" :showSideBar="showSideBar" @swap="swap()"/>
    </div>
    <div class="content" :class="{'open':showSideBar}">
      <div id="nav-icon" v-if="isMobileVew()">
        <div id="touch-box" @click="showSideBar = !showSideBar">
          <i>
            <div class="icon-bar"></div>
            <div class="icon-bar"></div>
            <div class="icon-bar"></div>
          </i>
        </div>
      </div>
      <router-view/>
    </div>
    <div v-if="!isMobileVew()">
      <Navbar/>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";

export default {
    components: {
        Navbar,
        NavbarMobile
    },
    data () {
        return {
            showSideBar: false
        };
    },
    methods: {
        isMobileVew () {
            return this.$store.getters.isMobileView;
        },
        handleView () {
            this.$store.dispatch("calculateView", window.innerWidth);
        },
        swap () {
            this.showSideBar = !this.showSideBar;
        }

    },
    created () {
        this.handleView();
        window.addEventListener("resize", this.handleView, false);
    },
    updated () {
        if (document.getElementsByName("NavbarMobile") &&
            this.$store.getters.isMobileView === false) {
            this.showSideBar = false;
        }
    }
};
</script>

<style lang="scss">
body {
    width: 100%;
    height: 100vh;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Montserrat', sans-serif;
}
#app {
    background-color: white;
}

.header-text {
    text-align: center;
    position: fixed;
    background-color: white;
    height: 10px;
    width: 100%;
    margin-top: 0px;
    padding-top: 10px;
    padding-left: 0px;
    padding-bottom: 25px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}

.content {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
}
#nav-icon {
    background-color: white;
    position: fixed;
    width: 100vw;
    padding-left: 10px;
    padding-top: 10px;;
    #touch-box {
        height: 50px;
        width: 13%;
        cursor: pointer;
        .icon-bar {
            width: 30px;
            height: 4px;
            background-color: black;
            margin: 6px 0;
        }
    }
}
.open {
    transform: translate(230px);
    overflow: initial;
}
.blank{
    visibility: hidden;
    height: 80px;
}
#footer {
    text-align: center;
    position: fixed;
    height: 10px;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 25px;
    background-color: royalblue;
    bottom: 0;
}

.no-content-message {
    padding-top: 20px;
    h2 {
        display: table;
        margin: 0 auto;
    }
}
</style>
