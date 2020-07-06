<template>
  <div id="main_wrap">
    <div class="main_content">
      <div class="content"><router-view /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "layoutMain"
};
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

#main_wrap {
  height: 100vh;
  // position: fixed;
  // left: $navMenu;
  // top: 75px;
  // right: 0;
  // bottom: 0;
  // border: 30px solid #f7f7f7;
  // border-bottom: none;
  // -webkit-box-sizing: border-box;
}
.main_content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-right: 30px;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all 0.3s ease 0s);
  .content {
    width: 100%;
    height: 100%;
    padding: 30px 30px 0;
    background-color: #fff;
    @include webkit(box-sizing, border-box);
  }
}
.open {
  .main_content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main_content {
    padding-left: $navMenuMin + 30;
  }
}
</style>
