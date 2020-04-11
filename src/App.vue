<template>
  <div id="app" class="bg-gray-400 min-h-full">
    <div id="nav" class="flex flex-row justify-center">
      <router-link class="mx-8" to="/">Home</router-link> |
      <router-link class="mx-8" to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#nav {
  margin: auto 0;
}
</style>
