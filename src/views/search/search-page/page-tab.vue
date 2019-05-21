<template>
  <li>
    <span v-on:click="$emit('selectTab')"> {{ tab }} </span>
  </li>
</template>

<script>
export default {
  props: ['tab']
}
</script>

<style lang="less" scoped>
</style>
