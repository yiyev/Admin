<template>
  <div id="header_wrap">
    <div class="pull_left header_icon" @click="navMenuState">
      <svg-icon iconClass="menu" className="menu" />
    </div>
    <div class="pull_right">
      <div class="user_info pull_left">{{ username }}</div>
      <div class="pull_left header_icon" @click="exit">
        <svg-icon iconClass="exit" className="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const navMenuState = () => {
      root.$store.commit("app/UPDATE_COLLAPSE");
    };
    const username = computed(() => root.$store.state.app.username);
    // 退出
    const exit = () => {
      root.$store.dispatch("app/exit").then(() => {
        root.$router.push({
          name: "Login"
        });
      });
    };
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
#header_wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
  line-height: 75px;
}
.open {
  #header_wrap {
    left: $navMenu;
  }
}
.close {
  #header_wrap {
    left: $navMenuMin;
  }
}
.header_icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user_info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header_icon {
    padding: 0 28px;
  }
}
</style>
