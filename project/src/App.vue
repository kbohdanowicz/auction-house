<template>
  <div id="app">
    <div v-if="mobileView">
        <NavbarMobile :showNav="showNav" @swap="swap()"/>
    </div>
    <div class="content" :class="{'open':showNav}">
      <div class="top-bar">
        <div id="nav-icon" v-if="mobileView"
          @click="showNav = !showNav">
          <i>
            <div class="icon-bar"></div>
            <div class="icon-bar"></div>
            <div class="icon-bar"></div>
          </i>
        </div>
        <Navbar v-if="!mobileView"/>
      </div>
      <div id="top-spacing"></div>
      <router-view :mobileView="mobileView"/>
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
            mobileView: false,
            showNav: false,
            windowWidth: window.outerWidth
        };
    },
    methods: {
        handleView () {
            this.mobileView = window.innerWidth <= 600;
        },
        swap () {
            this.showNav = !this.showNav;
        }

    },
    created () {
        this.handleView();
        // window.onresize() = event => {
        // };
    }
    // watch: {
    //     windowWidth (val) {
    //         console.log(this.windowWidth);
    //         if (val) {
    //             this.mobileView = val <= 900;
    //         }
    //     }
    // }
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
    background-color: royalblue;
}

// #top-spacing {
//     margin-top: 20px;
//     // padding-top: 5px;
//     padding-bottom: 25px;
// }

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

// .content-page {
//     height: 100%;
//     width: 100%;
//     position: fixed;
// }

#nav-icon {
    background-color: white;
    position: fixed;
    width: 100vw;
    padding: 10px 10px 20px;
    margin-right: 10px;
    cursor: pointer;
    .icon-bar {
        width: 30px;
        height: 4px;
        background-color: black;
        margin: 6px 0;
    }
}

.content {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 110vh;
    background-color: #fff;
    // border-radius: 30px;
    // box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2)
}

.open {
    transform: translate(70%)
}

i {
    font-size: 2rem;
}

#footer {
    text-align: center;
    position: fixed;
    height: 10px;
    width: 100%;
    //margin-top: 0px;
    padding-top: 10px;
    //padding-left: 0px;
    padding-bottom: 25px;
    background-color: royalblue;
    bottom: 0;
}
</style>
